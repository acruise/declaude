// Cell text lives in cells/<register>/<cell>.md and is imported at build time, so
// the panels and the files on disk cannot drift apart. Adding a cell means adding a
// file here and an entry in CELLS.

import literaryAOpusChat from "../cells/literary/A-opus-chat.md?raw";
import literaryAOpusAgent from "../cells/literary/A-opus-agent.md?raw";
import literaryASonnetAgent from "../cells/literary/A-sonnet-agent.md?raw";
import literaryBOpusChat from "../cells/literary/B-opus-chat.md?raw";
import literaryBOpusAgent from "../cells/literary/B-opus-agent.md?raw";
import literaryBSonnetAgent from "../cells/literary/B-sonnet-agent.md?raw";
import technicalAOpusChat from "../cells/technical/A-opus-chat.md?raw";
import technicalAOpusAgent from "../cells/technical/A-opus-agent.md?raw";
import technicalASonnetAgent from "../cells/technical/A-sonnet-agent.md?raw";
import technicalBOpusChat from "../cells/technical/B-opus-chat.md?raw";
import technicalBOpusAgent from "../cells/technical/B-opus-agent.md?raw";
import technicalBSonnetAgent from "../cells/technical/B-sonnet-agent.md?raw";

// label/sub/band describe the condition; text comes from the file above.
export const CELLS = [
  { slug: "A-opus-chat", label: "A · Opus, chat", sub: "written in chat, contaminated baseline", band: "cold" },
  { slug: "A-opus-agent", label: "A · Opus, agent", sub: "subagent, skill suppressed", band: "cold" },
  { slug: "A-sonnet-agent", label: "A · Sonnet, agent", sub: "subagent, skill suppressed", band: "cold" },
  { slug: "B-opus-chat", label: "B · Opus, chat", sub: "written in chat", band: "skill" },
  { slug: "B-opus-agent", label: "B · Opus, agent", sub: "subagent, skill loaded", band: "skill" },
  { slug: "B-sonnet-agent", label: "B · Sonnet, agent", sub: "subagent, skill loaded", band: "skill" },
];

export const CASES = [
  {
    name: "Literary nonfiction",
    register: "literary",
    prompt: "Write the opening ~400 words of a literary nonfiction essay about the night a production system failed, moving from scene toward reflection on how organizations decide what counts as an emergency. First person. No invented statistics.",
    cells: {
      "A-opus-chat": literaryAOpusChat,
      "A-opus-agent": literaryAOpusAgent,
      "A-sonnet-agent": literaryASonnetAgent,
      "B-opus-chat": literaryBOpusChat,
      "B-opus-agent": literaryBOpusAgent,
      "B-sonnet-agent": literaryBSonnetAgent,
    },
  },
  {
    name: "Technical authority",
    register: "technical",
    prompt: "Write the opening ~450 words of a technical essay arguing that adaptive re-planning in query engines is undervalued, largely because static plan quality is so much easier to benchmark. Argumentative register. No specific numbers or citations.",
    cells: {
      "A-opus-chat": technicalAOpusChat,
      "A-opus-agent": technicalAOpusAgent,
      "A-sonnet-agent": technicalASonnetAgent,
      "B-opus-chat": technicalBOpusChat,
      "B-opus-agent": technicalBOpusAgent,
      "B-sonnet-agent": technicalBSonnetAgent,
    },
  },
];
