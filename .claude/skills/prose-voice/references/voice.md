# Author Voice

This file holds the voice specification for the current author or project. It is the swap point for the skill: replace this file when the skill moves to a different author, and leave `SKILL.md`, `tells.md`, and `registers.md` alone.

Register, described in `registers.md`, is the genre. Voice is the individual working inside it. The two compose: the same voice writing a white paper and a personal essay will make different choices about structure and hedging while keeping the same characteristic sentence shapes.

---

## Current voice: Alex Cruise

### Sentence architecture

The long accumulating sentence is the default unit of thought. A sentence starts with a claim, gathers qualifications and asides as it proceeds, and arrives somewhere slightly different from where a reader would have predicted at the start. Length here is a function of how much the idea actually needs, not a stylistic affectation, which means a genuinely simple idea still gets a short sentence.

**Comma appositives are the primary refinement device.** When a term needs narrowing, narrow it in place. Do not write a second sentence that says "by X, I mean Y"; write "X, by which I mean the subset that survives a restart, ...". This is the most characteristic single feature of the voice and the one most worth preserving in revision.

**Parentheticals carry qualification.** The aside that would break the argument's spine goes in parentheses, where it can be honest about being an aside. This includes concessions, half-jokes, and the observation that the preceding claim is more contentious than it sounded.

### Diction and register

US English spelling and punctuation throughout, including for a Canadian author. This is deliberate. Do not "correct" toward Canadian or British forms.

**Rogue Capitalization** applied to mundane things being momentarily elevated to institutional status: the Big Rewrite, the Meeting Where It Was Decided, Serious Business. The joke is in the mismatch between the capital letters and the banality, so it stops working if it appears more than once or twice in a piece.

Humor arrives as a tone shift inside an otherwise serious passage, not as a joke section. The shift can be abrupt and the abruptness is the point. It should never undercut the accuracy of the surrounding claim.

### Closings

**Deflation closers are the signature move and are permitted.** A passage that has built to something elevated ends by naming the ordinary thing it actually amounts to. This is distinct from the manufactured-resonance closer catalogued in `tells.md`, and the distinction is whether the closer is doing content work. Deflation says "and here is the unglamorous truth of it". Manufactured resonance says "and now please feel something". The first is honest and the second is not.

### Hard bans, beyond the general catalog

- **Staccato mic-drops.** No fragment deployed as a drum hit, no one-sentence paragraph doing emphasis work. If a point needs emphasis, put it in the stressed position at the end of a full sentence.
- **Tricolons.** Three parallel items in a row, in any construction, including and especially "no X, no Y, no Z". Use two items, or four, or subordinate one to another.
- **Em dashes as dramatic pauses.** Substitute the punctuation that names the actual logical relation: a colon for elaboration, a semicolon for a linked independent clause, a comma for an appositive, parentheses for an aside.

### Working conventions

Apply the bans during editing passes rather than during ideation. Drafting under constraint produces careful, dead prose; the constraints belong in revision, where they operate on material that already exists.

**Flag citations rather than inventing them.** Associative recall runs well ahead of source recall for this author, which means a claim can surface with total confidence and no attached provenance. During revision, mark every specific number, date, attributed quotation, and confident historical assertion that lacks a source, and collect them into a list for verification rather than letting fluency carry them into the final text. This is a standing part of the editing workflow, not an occasional courtesy.

**Markdown first, always.** Prose lands in `.md` files. Do not produce Word documents, PDFs, or slide binaries by default; slide decks, when wanted, come from Markdown through Marp, pandoc, or reveal.js unless a `.pptx` was specifically requested. A rendering pipeline gets built when asked for and not before.

**Soft-wrap.** One line per paragraph, one line per list item, no hard line-wrapping inside a paragraph.

### Register mapping

Two registers are live for this author. Choose by artifact, not by mood.

**Technical authority** for white papers, architecture and design documents, product and security documentation, pitch material, and anything a reader will evaluate before committing engineering time or money. The accumulating sentence and the comma appositive still apply; the Rogue Capitalization joke gets used at most once per document, and the deflation closer is available at the end of a section but not at the end of a risk assessment.

**Literary nonfiction** for essays, book chapters, and blog writing where the argument arrives through experience rather than through evidence tables. Here the full voice is in play, including the tonal shifts, the digressions, and the deflation closer as the default ending.

**The technical essay hybrid** covers most long-form writing about technology, which for this author is a substantial fraction of the output. Hold the literary rhythm and the technical accuracy standard at the same time, and when they collide, accuracy wins and the sentence gets another pass rather than a compromise.

### Pushback expectation

This author wants the argument stress-tested rather than agreed with. When a draft contains a claim that will not survive contact with an informed reader, say so in the chat message alongside the delivered prose, and name the specific objection rather than gesturing at the existence of counterarguments. Padding, throat-clearing, and reflexive validation are worse than useless here, because they consume the attention that a real objection would need.
