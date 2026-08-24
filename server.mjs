// Backend for the harness and the blind-tasting game. Zero dependencies on
// purpose: this is meant to run on your own box.
//
//   node server.mjs            API only (Vite proxies /api to it in dev)
//   node server.mjs --static   also serve dist/, for production
//
// Two endpoints:
//   /api/ratings   GET  list every rating; POST append one
//   /api/generate  POST run one prose condition and return the text
//
// /api/generate is deliberately NOT a proxy. The caller sends a prompt and a
// boolean; the model, the token ceiling, and the skill text are all chosen
// here. A caller therefore cannot pick an expensive model, raise max_tokens,
// or send arbitrary message history on your key. That is the difference
// between a limit and a suggestion: anything enforced in the browser is
// advisory, because the browser is the attacker's machine.
import { createServer } from "node:http";
import { appendFile, readFile } from "node:fs/promises";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname ?? ".");
const DIST = join(ROOT, "dist");
const STORE = join(ROOT, "ratings.jsonl");
const USAGE = join(ROOT, "usage.jsonl");
const SKILL_DIR = join(ROOT, ".claude", "skills", "prose-voice");

// --- .env ---------------------------------------------------------------
// Parsed here rather than in vite.config.js, so the key lives in exactly one
// process and never enters the dev server or the bundle.
function loadDotEnv() {
  const f = join(ROOT, ".env");
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const val = m[2].trim().replace(/^["'](.*)["']$/, "$1");
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}
loadDotEnv();

const PORT = Number(process.env.RATINGS_PORT || 8787);
const SERVE_STATIC = process.argv.includes("--static");
const API_KEY = process.env.ANTHROPIC_API_KEY;
const TRUST_PROXY = process.env.TRUST_PROXY === "1";

// --- limits -------------------------------------------------------------
// Every one of these is enforced server-side. Tune in .env.
const MODEL = process.env.GEN_MODEL || "claude-sonnet-4-6";
const MAX_TOKENS = Number(process.env.GEN_MAX_TOKENS || 2000);
const MAX_PROMPT_CHARS = Number(process.env.GEN_MAX_PROMPT_CHARS || 2000);
const PER_IP_PER_HOUR = Number(process.env.GEN_PER_IP_PER_HOUR || 10);
const DAILY_TOKEN_BUDGET = Number(process.env.GEN_DAILY_TOKEN_BUDGET || 200_000);

const SKILL_FILES = ["SKILL.md", "references/tells.md", "references/registers.md", "references/voice.md"];
let SKILL_TEXT = "";
try {
  SKILL_TEXT = SKILL_FILES.map((f) => `=== ${f} ===\n\n${readFileSync(join(SKILL_DIR, f), "utf8")}`).join("\n\n");
} catch (e) {
  console.warn(`skill files unreadable (${e.message}); the skill condition will refuse`);
}

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function json(res, code, body) {
  const payload = JSON.stringify(body);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(payload) });
  res.end(payload);
}

function clientIp(req) {
  if (TRUST_PROXY) {
    const fwd = req.headers["x-forwarded-for"];
    if (fwd) return String(fwd).split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

// --- usage accounting ---------------------------------------------------
// Counts come from the API's own usage block, not from an estimate, and are
// appended to disk so a restart cannot silently reset the daily budget.
const hits = new Map(); // ip -> number[] of request timestamps

function loadTodaysTokens() {
  if (!existsSync(USAGE)) return 0;
  const today = new Date().toISOString().slice(0, 10);
  let total = 0;
  for (const line of readFileSync(USAGE, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const r = JSON.parse(line);
      if (r.at?.slice(0, 10) === today) total += r.tokens || 0;
    } catch {
      /* skip */
    }
  }
  return total;
}
let tokensToday = loadTodaysTokens();
let tokensDay = new Date().toISOString().slice(0, 10);

function rollDay() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== tokensDay) {
    tokensDay = today;
    tokensToday = 0;
  }
}

function checkLimits(ip) {
  rollDay();
  if (tokensToday >= DAILY_TOKEN_BUDGET) {
    return { code: 429, error: "Daily token budget for this instance is spent. Try again tomorrow." };
  }
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 3_600_000);
  hits.set(ip, recent);
  if (recent.length >= PER_IP_PER_HOUR) {
    return { code: 429, error: `Rate limit: ${PER_IP_PER_HOUR} generations per hour. Try again later.` };
  }
  return null;
}

async function callClaude(content) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    // model and max_tokens are fixed here; the caller has no say in either.
    body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, messages: [{ role: "user", content }] }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error ? `${data.error.type}: ${data.error.message}` : `HTTP ${res.status}`);
  }
  const used = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);
  const text = data.content.filter((i) => i.type === "text").map((i) => i.text).join("\n").trim();
  return { text, used };
}

async function generate(prompt, withSkill) {
  const skillBlock = `You have been given the following writing skill, as the files it ships as.\n\n<skill>\n${SKILL_TEXT}\n</skill>`;
  let used = 0;
  let text;
  if (!withSkill) {
    const r = await callClaude(`${prompt}\n\nOutput only the prose, no preamble.`);
    text = r.text;
    used += r.used;
  } else {
    // The skill asks for drafting and revision as separate acts of attention.
    const draft = await callClaude(
      `${skillBlock}\n\nThis is pass one, drafting. Write for the argument and do not consult the ban list.\n\n${prompt}\n\nOutput only the prose, no preamble.`
    );
    used += draft.used;
    const revised = await callClaude(
      `${skillBlock}\n\nThis is pass two, revision. Read the draft below as an unsympathetic editor. Work through \`references/tells.md\`, fix what it catches, and check the rhythm.\n\nThe task the draft was written to:\n\n${prompt}\n\n<draft>\n${draft.text}\n</draft>\n\nOutput only the revised prose, no preamble and no commentary on the changes.`
    );
    used += revised.used;
    text = revised.text;
  }
  return { text, used };
}

async function readRatings() {
  if (!existsSync(STORE)) return [];
  const rows = [];
  for (const line of (await readFile(STORE, "utf8")).split("\n")) {
    if (!line.trim()) continue;
    // A truncated final line from an interrupted write should not take out the
    // whole history, so bad lines are skipped rather than thrown.
    try {
      rows.push(JSON.parse(line));
    } catch {
      /* skip */
    }
  }
  return rows;
}

function validateRating(row) {
  if (!row || typeof row !== "object") return "not an object";
  for (const k of ["register", "provenance", "preferred", "scores"]) if (!row[k]) return `missing ${k}`;
  if (!["cold", "treat"].includes(row.preferred)) return "preferred must be cold or treat";
  for (const cond of ["cold", "treat"]) {
    const s = row.scores[cond];
    if (!s) return `missing scores.${cond}`;
    for (const c of ["informative", "entertaining", "machine"]) {
      const v = s[c];
      if (!Number.isInteger(v) || v < 1 || v > 5) return `scores.${cond}.${c} must be 1-5`;
    }
  }
  return null;
}

function body(req, limit = 64_000) {
  return new Promise((resolve, reject) => {
    let buf = "";
    req.on("data", (c) => {
      buf += c;
      if (buf.length > limit) {
        req.destroy();
        reject(new Error("body too large"));
      }
    });
    req.on("end", () => resolve(buf));
    req.on("error", reject);
  });
}

function serveStatic(req, res) {
  const url = new URL(req.url, "http://localhost");
  let path = decodeURIComponent(url.pathname);
  if (path === "/") path = "/index.html";
  if (path === "/game") path = "/game.html";
  const file = join(DIST, normalize(path).replace(/^(\.\.[/\\])+/, ""));
  if (!file.startsWith(DIST) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found. Run `npm run build` first.");
    return;
  }
  res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/ratings" && req.method === "GET") {
    try {
      return json(res, 200, { ratings: await readRatings() });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  if (url.pathname === "/api/ratings" && req.method === "POST") {
    let row;
    try {
      row = JSON.parse(await body(req));
    } catch (e) {
      return json(res, 400, { error: e.message === "body too large" ? e.message : "body is not valid JSON" });
    }
    const bad = validateRating(row);
    if (bad) return json(res, 400, { error: bad });
    row.receivedAt = new Date().toISOString();
    try {
      await appendFile(STORE, JSON.stringify(row) + "\n");
      return json(res, 201, { ok: true });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  }

  // Budget state, so the page can show what is left instead of guessing.
  if (url.pathname === "/api/limits" && req.method === "GET") {
    rollDay();
    const now = Date.now();
    const recent = (hits.get(clientIp(req)) || []).filter((t) => now - t < 3_600_000);
    return json(res, 200, {
      enabled: Boolean(API_KEY),
      model: MODEL,
      maxPromptChars: MAX_PROMPT_CHARS,
      perIpPerHour: PER_IP_PER_HOUR,
      usedThisHour: recent.length,
      dailyTokenBudget: DAILY_TOKEN_BUDGET,
      tokensToday,
    });
  }

  if (url.pathname === "/api/generate" && req.method === "POST") {
    if (!API_KEY) return json(res, 503, { error: "No ANTHROPIC_API_KEY on the server. Copy .env.example to .env." });

    let payload;
    try {
      payload = JSON.parse(await body(req, 16_000));
    } catch (e) {
      return json(res, 400, { error: e.message === "body too large" ? e.message : "body is not valid JSON" });
    }

    const prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : "";
    if (!prompt) return json(res, 400, { error: "prompt is required" });
    if (prompt.length > MAX_PROMPT_CHARS) {
      return json(res, 400, { error: `Prompt is ${prompt.length} characters; the limit is ${MAX_PROMPT_CHARS}.` });
    }
    const withSkill = payload.withSkill === true;
    if (withSkill && !SKILL_TEXT) return json(res, 503, { error: "Skill files unreadable on the server." });

    const ip = clientIp(req);
    const limited = checkLimits(ip);
    if (limited) return json(res, limited.code, { error: limited.error });

    // Reserve the slot before the call, so concurrent requests cannot both
    // pass the check and blow through the per-IP limit together.
    hits.set(ip, [...(hits.get(ip) || []), Date.now()]);

    try {
      const { text, used } = await generate(prompt, withSkill);
      tokensToday += used;
      appendFile(USAGE, JSON.stringify({ at: new Date().toISOString(), ip, withSkill, tokens: used }) + "\n").catch(() => {});
      return json(res, 200, { text, tokens: used, tokensToday, dailyTokenBudget: DAILY_TOKEN_BUDGET });
    } catch (e) {
      return json(res, 502, { error: e.message });
    }
  }

  if (SERVE_STATIC) return serveStatic(req, res);

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`server on http://localhost:${PORT}`);
  console.log(`  ratings   → ${STORE}`);
  console.log(`  generate  → ${API_KEY ? `${MODEL}, ${PER_IP_PER_HOUR}/ip/hr, ${DAILY_TOKEN_BUDGET} tokens/day` : "disabled (no ANTHROPIC_API_KEY)"}`);
  if (SERVE_STATIC) console.log(`  static    → ${DIST}  (/ = harness, /game = blind tasting)`);
});
