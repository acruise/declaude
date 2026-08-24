---
name: prose-voice
description: Write and revise prose in a considered academic, professional, or literary register rather than default assistant style. Use this skill whenever the task involves producing or editing prose of any length, including essays, book chapters, white papers, design documents, README narrative, blog posts, pitch material, documentation, correspondence, and any request to draft, write up, expand, tighten, rewrite, or edit text. Also use it when reviewing prose for style, or when asked why a passage sounds machine-written. Trigger this skill even when the user says nothing about style, voice, or tone, because the default assistant register is the failure mode this skill exists to prevent, so it applies by default to prose-heavy work unless the user has explicitly asked for terse bullet-point output.
---

# Prose Voice

## What problem this solves

The default assistant register is not bad because of its vocabulary. It is bad because of its rhythm. A model asked to avoid the word "delve" will avoid the word and keep the underlying habits: the three-beat list, the antithetical reversal, the fragment deployed as a drum hit, the paragraph that ends by zooming out to a Big Statement nobody asked for. Those habits are what a reader recognizes within two sentences, and they are what makes prose feel generated rather than written.

So the target here is structural. Vary sentence length and shape on purpose, subordinate ideas rather than lining them up as equals, and let paragraphs end where the thought ends rather than where a rhetorical cadence wants to land.

## Two passes, not one

Apply this skill as a revision discipline rather than a compositional straitjacket. Constraint applied during drafting produces careful, evasive, dead prose, because attention goes to what is being avoided rather than what is being said.

**Pass one, drafting.** Write for the argument. Get the reasoning right, get the evidence in place, follow the digression if the digression is where the interesting thing lives. Do not consult the ban list.

**Pass two, revision.** Now read the draft as an unsympathetic editor. Work through `references/tells.md`, fix what it catches, and check the rhythm out loud. This is also where citation gaps get flagged, where a claim that felt obvious while drafting gets checked, and where the register gets made consistent.

For short outputs the two passes collapse into one act of attention, but the ordering still holds: content first, surface second.

## The positive target

Negative constraints alone yield avoidance-prose, which is bland in a new way rather than good. Aim at something specific:

- **Sentences that accumulate.** A long sentence that gathers qualifications as it goes, subordinating the secondary material to the main clause, is the workhorse of good expository prose. Long is not the same as run-on. The test is whether the syntax holds the reader through to a landing.
- **Appositives and parentheticals as the refinement device.** When a term needs narrowing, narrow it in place with a comma appositive rather than in a follow-up sentence. Parentheses carry qualification, concession, and the aside that would otherwise break the argument's spine.
- **Concrete nouns doing the work.** Abstraction is earned by the specifics that precede it, not asserted by adjectives.
- **Varied openings.** Count how many consecutive sentences begin with the subject. If the answer is more than three, invert something, lead with a subordinate clause, or start with the object.
- **Real transitions.** Prose moves by logical connection, not by a stock adverb at the head of each paragraph. If the connection between two paragraphs cannot be named, the problem is in the argument.
- **A closing that stops.** End on the last thing worth saying. A summary sentence that restates the paragraph is a tic, not a courtesy.

## Register

Two registers are in scope, and they are genuinely different targets rather than points on a formality dial. **Technical authority** merges the professional and academic conventions into a single register aimed at an informed skeptic who has to act on the claim. **Literary nonfiction** runs the techniques of fiction inside a hard truth constraint, moving from a particular that actually happened to what it means. Between them sits the **technical essay**, which is where most serious writing about technology lives and which is the hardest of the three to hold steady.

Read `references/registers.md` before drafting anything substantial. It covers the conventions of each, the specific points where the professional and academic parents conflict along with how to resolve each conflict, and the characteristic failures to watch for during revision.

Infer the target from the artifact rather than asking when the answer is available. A white paper and a personal essay about the same incident are not the same document and do not share a first paragraph. When it is genuinely unclear and the piece is long enough for the choice to matter, ask once, briefly, then commit and stay committed, because drift between registers costs more than picking the less apt one and executing it cleanly.

## Voice layer

Register is the genre. Voice is the individual. `references/voice.md` holds a project-specific voice specification: the idiosyncratic moves that belong to this author rather than to the genre. Read it before drafting anything substantial.

That file is the intended swap point. When this skill moves to a new project or a new author, replace `references/voice.md` and leave everything else alone. If the file is absent or empty, work from register conventions and whatever the user's existing text demonstrates.

## Revision checklist

Run this over any prose before returning it. It takes a minute and catches most of what matters.

1. **Read the first and last sentence of every paragraph in isolation.** Openers should not all be the same shape. Closers should not all be aphorisms.
2. **Search for the antithesis reflex.** Any construction of the form "not X, but Y", "X isn't just Y, it's Z", "less X, more Y". Some are legitimate; most are reflex. See `references/tells.md`.
3. **Count the three-item lists.** More than one per page is a habit rather than a coincidence.
4. **Find every fragment and every one-sentence paragraph.** Ask what each is doing. If the answer is "emphasis", rewrite it into a full sentence and see whether anything was actually lost.
5. **Check em dashes.** Dashes doing a dramatic pause should be commas, colons, semicolons, or parentheses depending on the logical relation. Dashes setting off a genuine parenthetical interruption may stay, sparingly.
6. **Check sentence-length variance.** If the standard deviation is low, the prose has a metronome in it.
7. **Check hedges and intensifiers.** "It is worth noting", "importantly", "crucially", "fundamentally", "truly", "very". Most can be deleted with no loss; the ones that survive are the ones carrying real epistemic weight.
8. **Check the ending.** Does the piece end on its actual last idea, or on a manufactured resonance?
9. **Flag unsourced specifics.** Numbers, dates, attributed claims, and confident historical assertions get marked for verification rather than smuggled through on fluency.

## Output conventions

- Prose goes in Markdown files first, always. Do not produce .docx, .pdf, or slide formats unless explicitly asked. If a rendering pipeline is wanted, the user will ask for one.
- Soft-wrap: one line per paragraph and one line per list item, with no hard line-wrapping inside a paragraph. Fenced code blocks and headings keep their own structure.
- US English spelling and punctuation conventions throughout, including for authors who live elsewhere.
- Do not decorate with headers, bold lead-ins, or bullets by default. Prose-heavy documents want prose. Structure is for material that is genuinely enumerable.
- When delivering a revision, note what changed and why in the chat message rather than annotating the file, unless tracked changes were requested.

## Reference files

- `references/tells.md` — the catalog of assistant-prose patterns, each with a diagnosis and a rewrite. Read this during the revision pass. It is the operational heart of the skill.
- `references/registers.md` — academic, professional, and literary conventions, plus the hybrid cases that come up in technical writing.
- `references/voice.md` — the project-specific author voice. Swap this file per project.
