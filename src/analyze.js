// Heuristic counters for the patterns prose-voice targets. They narrow where to
// look; they do not decide anything. Kept in their own module so they can be run
// straight from node against the cells/ tree.

function sentences(t) {
  return t
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

function analyze(t) {
  if (!t || !t.trim()) return null;
  const body = t.replace(/^#.*$/gm, "").replace(/^\*\*Prompt.*$/gm, "").replace(/^---$/gm, "");
  const sents = sentences(body);
  const lens = sents.map((s) => s.split(/\s+/).filter(Boolean).length);
  const words = lens.reduce((a, b) => a + b, 0);
  const mean = words / (lens.length || 1);
  const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / (lens.length || 1));
  const paras = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  const emdash = (body.match(/—/g) || []).length;
  const shortSent = lens.filter((l) => l <= 5).length;
  const soloPara = paras.filter((p) => sentences(p).length === 1 && !p.startsWith("#")).length;
  const tricolon = (body.match(/\b\w+(?:\s+\w+){0,3},\s+\w+(?:\s+\w+){0,3},\s+and\s+\w+/gi) || []).length;
  const antithesis = (
    body.match(/\b(?:it'?s|this is|that'?s|is)\s+not\s+[^.,;]{2,40}[.,]?\s*(?:it'?s|but|rather)\b/gi) || []
  ).length + (body.match(/\bnot\s+just\s+[^.,;]{2,40},?\s*(?:but|it'?s)\b/gi) || []).length;
  const meta = (
    body.match(/\b(here'?s (?:the thing|why|what)|let'?s (?:dive|unpack|break)|it'?s worth noting|that'?s the point|the key insight)\b/gi) || []
  ).length;
  const vocab = (
    body.match(/\b(delve|leverag\w+|robust|seamless|landscape|realm|tapestry|underscor\w+|pivotal|testament|showcase|foster|myriad|plethora|crucial|holistic|nuanced|multifaceted|paradigm|utilize|navigate the|deep dive|game-?changer|ever-evolving)\b/gi) || []
  ).length;

  const flags = emdash + soloPara + tricolon + antithesis * 2 + meta * 2 + vocab;
  return { words, sentCount: lens.length, mean, sd, emdash, shortSent, soloPara, tricolon, antithesis, meta, vocab, flags };
}

const METRICS = [
  ["Em dashes", "emdash"],
  ["Solo-sentence paras", "soloPara"],
  ["Tricolons", "tricolon"],
  ["Antithesis flips", "antithesis"],
  ["Metadiscourse", "meta"],
  ["Flagged vocabulary", "vocab"],
  ["Sentences ≤5 words", "shortSent"],
];

export { sentences, analyze, METRICS };
