import React, { useState, useMemo, useEffect } from "react";
import { CASES, CELLS } from "./cases.js";

// Palette and faces are the harness's, so the two pages read as one project.
const INK = "#1F2421";
const PAPER = "#E9EBE6";
const PENCIL = "#C1352B";
const BLUE = "#2F5D8C";
const RULE = "#C3C8BF";
const CARD = "#F7F8F5";
const MUTED = "#6B7268";

const MONO = "ui-monospace, Menlo, monospace";
const SERIF = "Georgia, 'Iowan Old Style', serif";

// Each pair holds provenance constant and varies only the treatment, which is
// the only comparison the corpus supports cleanly.
const PROVENANCE = ["opus-chat", "opus-agent", "sonnet-agent"];

const CRITERIA = [
  { key: "informative", label: "Informative", low: "says little", high: "says a lot" },
  { key: "entertaining", label: "Entertaining", low: "a slog", high: "a pleasure" },
  { key: "machine", label: "Written by AI", low: "surely human", high: "surely machine" },
];

function buildPairs() {
  const out = [];
  for (const c of CASES) {
    for (const prov of PROVENANCE) {
      const cold = CELLS.find((x) => x.slug === `A-${prov}`);
      const treat = CELLS.find((x) => x.slug === `B-${prov}`);
      // Registers added later have no chat cells, so skip any pair whose
      // halves are not both present rather than rendering a blank passage.
      if (!c.cells[cold.slug] || !c.cells[treat.slug]) continue;
      out.push({
        id: `${c.register}:${prov}`,
        register: c.register,
        registerName: c.name,
        provenance: prov,
        cold: { slug: cold.slug, sub: cold.sub, text: c.cells[cold.slug] },
        treat: { slug: treat.slug, sub: treat.sub, text: c.cells[treat.slug] },
      });
    }
  }
  return out;
}
const PAIRS = buildPairs();

function raterId() {
  try {
    let id = localStorage.getItem("declaude.rater");
    if (!id) {
      id = Math.random().toString(36).slice(2, 10);
      localStorage.setItem("declaude.rater", id);
    }
    return id;
  } catch {
    return "anon";
  }
}

// Strip the leading "## Title" so the title can be set above the prose body.
function splitTitle(md) {
  const m = md.match(/^##\s+(.+)\n+([\s\S]*)$/);
  return m ? { title: m[1], body: m[2] } : { title: "", body: md };
}

function Scale({ value, onChange, name }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = value === n;
        return (
          <label
            key={n}
            style={{
              flex: 1, textAlign: "center", cursor: "pointer", fontFamily: MONO, fontSize: 12,
              padding: "6px 0", border: `1px solid ${on ? INK : RULE}`,
              background: on ? INK : "transparent", color: on ? CARD : MUTED,
            }}
          >
            <input
              type="radio"
              name={name}
              checked={on}
              onChange={() => onChange(n)}
              style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
            />
            {n}
          </label>
        );
      })}
    </div>
  );
}

function Side({ side, cell, scores, setScore, disabled }) {
  const { title, body } = useMemo(() => splitTitle(cell.text), [cell.text]);
  return (
    <div style={{ border: `1px solid ${RULE}`, background: CARD, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${RULE}`, fontFamily: MONO, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: PENCIL }}>
        Passage {side}
      </div>
      <div style={{ padding: "18px 20px", flex: 1, minHeight: 260 }}>
        {title && <h3 style={{ margin: "0 0 10px", fontFamily: SERIF, fontWeight: 400, fontSize: 19, lineHeight: 1.25, textWrap: "balance", color: INK }}>{title}</h3>}
        <div style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.62, color: INK, whiteSpace: "pre-wrap" }}>{body}</div>
      </div>
      <div style={{ borderTop: `1px solid ${RULE}`, padding: "12px 14px 14px", display: "grid", gap: 12 }}>
        {CRITERIA.map((c) => (
          <div key={c.key}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: INK }}>{c.label}</span>
              <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED }}>{c.low} → {c.high}</span>
            </div>
            <fieldset disabled={disabled} style={{ border: "none", padding: 0, margin: 0 }}>
              <Scale name={`${side}-${c.key}`} value={scores[c.key]} onChange={(v) => setScore(c.key, v)} />
            </fieldset>
          </div>
        ))}
      </div>
    </div>
  );
}

function Reveal({ pair, order, prefer, onNext }) {
  const label = (which) => (which === "cold" ? "no skill" : "prose-voice applied");
  const leftIs = order[0];
  const rightIs = order[1];
  const preferred = prefer === "L" ? leftIs : prefer === "R" ? rightIs : null;
  return (
    <div style={{ border: `1px solid ${INK}`, background: CARD, padding: "16px 18px", display: "grid", gap: 10 }}>
      <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: PENCIL }}>Recorded</div>
      <div style={{ fontFamily: SERIF, fontSize: 16, lineHeight: 1.5, color: INK }}>
        Passage A was <b>{label(leftIs)}</b>. Passage B was <b>{label(rightIs)}</b>.
        {preferred && <> You preferred the one with <b>{preferred === "cold" ? "no skill" : "the skill applied"}</b>.</>}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>
        {pair.registerName} · {pair.provenance}
      </div>
      <button onClick={onNext} style={btn(INK)}>Next pair</button>
    </div>
  );
}

function btn(bg, disabled) {
  return {
    fontFamily: MONO, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
    padding: "10px 16px", background: disabled ? RULE : bg, color: CARD, border: "none",
    cursor: disabled ? "not-allowed" : "pointer", justifySelf: "start",
  };
}

function Tally({ rows }) {
  if (!rows.length) return <p style={{ fontFamily: MONO, fontSize: 12, color: MUTED }}>No ratings recorded yet.</p>;
  const agg = {};
  for (const r of rows) {
    for (const cond of ["cold", "treat"]) {
      agg[cond] ??= { n: 0, informative: 0, entertaining: 0, machine: 0, preferred: 0 };
      agg[cond].n += 1;
      for (const c of CRITERIA) agg[cond][c.key] += r.scores[cond][c.key];
    }
    if (r.preferred) agg[r.preferred].preferred += 1;
  }
  const mean = (cond, k) => (agg[cond].n ? (agg[cond][k] / agg[cond].n).toFixed(2) : "—");
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", fontFamily: MONO, fontSize: 12, fontVariantNumeric: "tabular-nums" }}>
        <thead>
          <tr>
            {["condition", "n", ...CRITERIA.map((c) => c.label.toLowerCase()), "preferred"].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "6px 14px 6px 0", borderBottom: `1px solid ${RULE}`, color: MUTED, fontWeight: 400 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {["cold", "treat"].map((cond) => (
            <tr key={cond}>
              <td style={{ padding: "6px 14px 6px 0", color: cond === "treat" ? BLUE : PENCIL }}>{cond === "cold" ? "no skill" : "prose-voice"}</td>
              <td style={{ padding: "6px 14px 6px 0" }}>{agg[cond].n}</td>
              {CRITERIA.map((c) => <td key={c.key} style={{ padding: "6px 14px 6px 0" }}>{mean(cond, c.key)}</td>)}
              <td style={{ padding: "6px 14px 6px 0" }}>{agg[cond].preferred}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const blankScores = () => ({ informative: 0, entertaining: 0, machine: 0 });

export default function Game() {
  const [seen, setSeen] = useState([]);
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * PAIRS.length));
  // order[0] is what sits on the left; randomized per pair so the rater is blind.
  const [order, setOrder] = useState(() => (Math.random() < 0.5 ? ["cold", "treat"] : ["treat", "cold"]));
  const [left, setLeft] = useState(blankScores);
  const [right, setRight] = useState(blankScores);
  const [prefer, setPrefer] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const pair = PAIRS[idx];

  useEffect(() => {
    fetch("/api/ratings")
      .then((r) => (r.ok ? r.json() : { ratings: [] }))
      .then((d) => setRows(d.ratings || []))
      .catch(() => setErr("Ratings server unreachable — scores will not be saved. Start it with `npm run serve`."));
  }, []);

  const complete = CRITERIA.every((c) => left[c.key] && right[c.key]) && prefer;

  async function submit() {
    setSaving(true);
    setErr("");
    const [leftIs, rightIs] = order;
    const row = {
      at: new Date().toISOString(),
      rater: raterId(),
      register: pair.register,
      provenance: pair.provenance,
      shownLeft: leftIs,
      preferred: prefer === "L" ? leftIs : rightIs,
      scores: { [leftIs]: left, [rightIs]: right },
    };
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setRows((r) => [...r, row]);
    } catch (e) {
      setErr(`Could not save: ${e.message}. The rating is shown below but was not written to disk.`);
      setRows((r) => [...r, row]);
    } finally {
      setSaving(false);
      setRevealed(true);
      setSeen((s) => [...s, pair.id]);
    }
  }

  function next() {
    const unseen = PAIRS.map((p, i) => i).filter((i) => !seen.includes(PAIRS[i].id) && i !== idx);
    const pool = unseen.length ? unseen : PAIRS.map((_, i) => i).filter((i) => i !== idx);
    setIdx(pool[Math.floor(Math.random() * pool.length)]);
    setOrder(Math.random() < 0.5 ? ["cold", "treat"] : ["treat", "cold"]);
    setLeft(blankScores());
    setRight(blankScores());
    setPrefer(null);
    setRevealed(false);
  }

  const shown = { L: pair[order[0]], R: pair[order[1]] };

  return (
    <div style={{ background: PAPER, minHeight: "100vh", padding: "28px 22px 48px", color: INK }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <header style={{ borderBottom: `2px solid ${INK}`, paddingBottom: 12, marginBottom: 18 }}>
          <h1 style={{ margin: 0, fontFamily: SERIF, fontSize: 30, fontWeight: 400, letterSpacing: "-0.01em" }}>
            Blind tasting<span style={{ color: PENCIL }}>.</span>
          </h1>
          <p style={{ margin: "6px 0 0", fontFamily: MONO, fontSize: 12, color: "#5C6359", lineHeight: 1.5 }}>
            Two passages written to the same prompt. One had the prose-voice skill applied and one did not, and which is which is hidden until you have scored them. Rate both, say which you would rather keep reading, then submit.
          </p>
        </header>

        <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap", marginBottom: 14, fontFamily: MONO, fontSize: 11, color: MUTED }}>
          <span style={{ letterSpacing: "0.14em", textTransform: "uppercase", color: PENCIL }}>Register</span>
          <span>{pair.registerName}</span>
          <span style={{ color: RULE }}>|</span>
          <span>{seen.length} of {PAIRS.length} pairs rated this session</span>
        </div>

        {err && (
          <div style={{ marginBottom: 14, padding: "10px 12px", border: `1px solid ${PENCIL}`, color: PENCIL, fontFamily: MONO, fontSize: 12 }}>
            {err}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 16, alignItems: "start" }}>
          <Side side="A" cell={shown.L} scores={left} setScore={(k, v) => setLeft((s) => ({ ...s, [k]: v }))} disabled={revealed} />
          <Side side="B" cell={shown.R} scores={right} setScore={(k, v) => setRight((s) => ({ ...s, [k]: v }))} disabled={revealed} />
        </div>

        <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
          {!revealed && (
            <>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: INK, marginBottom: 6 }}>
                  Which would you rather keep reading?
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["L", "R"].map((k) => (
                    <button
                      key={k}
                      onClick={() => setPrefer(k)}
                      style={{
                        fontFamily: MONO, fontSize: 12, padding: "8px 18px", cursor: "pointer",
                        border: `1px solid ${prefer === k ? INK : RULE}`,
                        background: prefer === k ? INK : "transparent",
                        color: prefer === k ? CARD : INK,
                      }}
                    >
                      Passage {k === "L" ? "A" : "B"}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={submit} disabled={!complete || saving} style={btn(PENCIL, !complete || saving)}>
                {saving ? "Saving…" : "Submit and reveal"}
              </button>
            </>
          )}

          {revealed && <Reveal pair={pair} order={order} prefer={prefer} onNext={next} />}
        </div>

        <section style={{ marginTop: 32, borderTop: `1px solid ${RULE}`, paddingTop: 16 }}>
          <h2 style={{ margin: "0 0 10px", fontFamily: MONO, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: PENCIL, fontWeight: 400 }}>
            Running tally, all raters
          </h2>
          <Tally rows={rows} />
        </section>
      </div>
    </div>
  );
}
