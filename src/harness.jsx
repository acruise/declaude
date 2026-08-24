import React, { useState, useMemo } from "react";

import { analyze, METRICS } from "./analyze.js";
import { CASES, CELLS } from "./cases.js";

// The live panels run the same skill Claude Code loads, imported from the source
// of truth so they cannot drift from .claude/skills/prose-voice/.
import skillMd from "../.claude/skills/prose-voice/SKILL.md?raw";
import tellsMd from "../.claude/skills/prose-voice/references/tells.md?raw";
import registersMd from "../.claude/skills/prose-voice/references/registers.md?raw";
import voiceMd from "../.claude/skills/prose-voice/references/voice.md?raw";

// SKILL.md refers to `references/tells.md` by path in five places, so the files
// need boundaries the model can resolve rather than one undifferentiated blob.
const SKILL_FILES = [
  ["SKILL.md", skillMd],
  ["references/tells.md", tellsMd],
  ["references/registers.md", registersMd],
  ["references/voice.md", voiceMd],
];
const SKILL_TEXT = SKILL_FILES.map(([name, body]) => `=== ${name} ===\n\n${body}`).join("\n\n");

const INK = "#1F2421";
const PAPER = "#E9EBE6";
const PENCIL = "#C1352B";
const BLUE = "#2F5D8C";
const RULE = "#C3C8BF";

const BANDS = [
  ["cold", "Cold — no skill"],
  ["skill", "Treatment — prose-voice applied"],
];

// The two panels that call the API rather than reading from cells/.
const LIVE = [
  { key: "cold", label: "C · Sonnet, live", sub: "claude-sonnet-4-6, no skill", band: "cold" },
  { key: "skill", label: "D · Sonnet, live", sub: "claude-sonnet-4-6, skill files + two passes", band: "skill" },
];

function Panel({ label, sub, text, setText, busy, onRun, editable }) {
  const a = useMemo(() => analyze(text), [text]);
  return (
    <div style={{ border: `1px solid ${RULE}`, background: "#F7F8F5", display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ borderBottom: `1px solid ${RULE}`, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: PENCIL }}>{label}</div>
          <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, color: "#6B7268", marginTop: 2 }}>{sub}</div>
        </div>
        {onRun && (
          <button
            onClick={onRun}
            disabled={busy}
            style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, padding: "6px 10px", background: busy ? RULE : INK, color: "#F7F8F5", border: "none", cursor: busy ? "wait" : "pointer", letterSpacing: "0.06em" }}
          >
            {busy ? "RUNNING" : "RUN"}
          </button>
        )}
      </div>

      {a && (
        <div style={{ padding: "8px 12px", borderBottom: `1px solid ${RULE}`, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, color: INK, display: "grid", gridTemplateColumns: "1fr auto", rowGap: 3 }}>
          <span style={{ color: "#6B7268" }}>words / sentences</span>
          <span>{a.words} / {a.sentCount}</span>
          <span style={{ color: "#6B7268" }}>mean length / σ</span>
          <span>{a.mean.toFixed(1)} / <b style={{ color: a.sd < 7 ? PENCIL : BLUE }}>{a.sd.toFixed(1)}</b></span>
          {METRICS.map(([n, k]) => (
            <React.Fragment key={k}>
              <span style={{ color: "#6B7268" }}>{n}</span>
              <span style={{ color: a[k] > 0 ? PENCIL : "#6B7268" }}>{a[k]}</span>
            </React.Fragment>
          ))}
          <span style={{ color: "#6B7268", borderTop: `1px solid ${RULE}`, paddingTop: 4, marginTop: 2 }}>tell score</span>
          <span style={{ borderTop: `1px solid ${RULE}`, paddingTop: 4, marginTop: 2, fontWeight: 700, color: a.flags > 6 ? PENCIL : BLUE }}>{a.flags}</span>
        </div>
      )}

      <textarea
        value={text}
        readOnly={!editable}
        onChange={(e) => setText && setText(e.target.value)}
        placeholder="Not run yet."
        style={{ flex: 1, minHeight: 300, border: "none", resize: "vertical", padding: "14px 16px", background: "transparent", fontFamily: "Georgia, 'Iowan Old Style', serif", fontSize: 15, lineHeight: 1.62, color: INK, outline: "none" }}
      />
    </div>
  );
}

export default function Harness() {
  const [caseIdx, setCaseIdx] = useState(0);
  const [prompt, setPrompt] = useState(CASES[0].prompt);
  const [texts, setTexts] = useState(CASES[0].cells);
  const [live, setLive] = useState({ cold: "", skill: "" });
  const [busy, setBusy] = useState({ cold: false, skill: false });
  const [err, setErr] = useState("");

  function pick(i) {
    setCaseIdx(i);
    setPrompt(CASES[i].prompt);
    setTexts(CASES[i].cells);
    setLive({ cold: "", skill: "" });
  }

  // Auth headers are added by the Vite dev proxy (see vite.config.js) so the
  // API key stays server-side. Requires ANTHROPIC_API_KEY in the dev server's env.
  async function callClaude(content) {
    const res = await fetch("/api/anthropic/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 2000, messages: [{ role: "user", content }] }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error ? `${data.error.type}: ${data.error.message}` : `HTTP ${res.status}`);
    }
    return data.content.filter((i) => i.type === "text").map((i) => i.text).join("\n").trim();
  }

  const SKILL_BLOCK = `You have been given the following writing skill, as the files it ships as.\n\n<skill>\n${SKILL_TEXT}\n</skill>`;

  async function run(withSkill) {
    const key = withSkill ? "skill" : "cold";
    setBusy((b) => ({ ...b, [key]: true }));
    setErr("");
    try {
      let out;
      if (!withSkill) {
        out = await callClaude(`${prompt}\n\nOutput only the prose, no preamble.`);
      } else {
        // The skill asks for drafting and revision as separate acts of attention,
        // which is what the B-row subagents did. One call cannot reproduce that.
        const draft = await callClaude(
          `${SKILL_BLOCK}\n\nThis is pass one, drafting. Write for the argument and do not consult the ban list.\n\n${prompt}\n\nOutput only the prose, no preamble.`
        );
        out = await callClaude(
          `${SKILL_BLOCK}\n\nThis is pass two, revision. Read the draft below as an unsympathetic editor. Work through \`references/tells.md\`, fix what it catches, and check the rhythm.\n\nThe task the draft was written to:\n\n${prompt}\n\n<draft>\n${draft}\n</draft>\n\nOutput only the revised prose, no preamble and no commentary on the changes.`
        );
      }
      setLive((l) => ({ ...l, [key]: out || "(empty response)" }));
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy((b) => ({ ...b, [key]: false }));
    }
  }

  return (
    <div style={{ background: PAPER, minHeight: "100vh", padding: "28px 22px 40px", color: INK }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ borderBottom: `2px solid ${INK}`, paddingBottom: 12, marginBottom: 18 }}>
          <h1 style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 400, letterSpacing: "-0.01em" }}>
            Galley proof<span style={{ color: PENCIL }}>.</span>
          </h1>
          <p style={{ margin: "6px 0 0", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, color: "#5C6359", lineHeight: 1.5 }}>
            Same prompt, eight cells. Cold above, prose-voice below; six read from cells/, two live against the API. Counters are heuristics for the patterns the skill targets; they narrow where to look, they do not decide anything.
          </p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
            <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: PENCIL }}>Register</span>
            {CASES.map((cs, i) => (
              <button key={cs.name} onClick={() => pick(i)}
                style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, padding: "5px 10px", cursor: "pointer",
                  border: `1px solid ${i === caseIdx ? INK : RULE}`, background: i === caseIdx ? INK : "transparent",
                  color: i === caseIdx ? "#F7F8F5" : INK }}>{cs.name}</button>
            ))}
          </div>
          <label style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: PENCIL }}>Test prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", marginTop: 6, minHeight: 74, padding: 12, border: `1px solid ${RULE}`, background: "#F7F8F5", fontFamily: "Georgia, serif", fontSize: 14, lineHeight: 1.55, color: INK, resize: "vertical" }}
          />
          {err && <div style={{ marginTop: 8, color: PENCIL, fontFamily: "ui-monospace, monospace", fontSize: 12 }}>{err}</div>}
        </div>

        {BANDS.map(([band, title]) => (
          <div key={band} style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: PENCIL, borderBottom: `1px solid ${RULE}`, paddingBottom: 6, marginBottom: 10 }}>
              {title}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, alignItems: "start" }}>
              {CELLS.filter((c) => c.band === band).map((c) => (
                <Panel
                  key={c.slug}
                  label={c.label}
                  sub={c.sub}
                  text={texts[c.slug]}
                  setText={(v) => setTexts((t) => ({ ...t, [c.slug]: v }))}
                  editable
                />
              ))}
              {LIVE.filter((l) => l.band === band).map((l) => (
                <Panel
                  key={l.key}
                  label={l.label}
                  sub={l.sub}
                  text={live[l.key]}
                  setText={(v) => setLive((s) => ({ ...s, [l.key]: v }))}
                  busy={busy[l.key]}
                  onRun={() => run(l.key === "skill")}
                  editable
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
