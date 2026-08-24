# Registers

Two targets, plus the hybrid that sits between them and accounts for a great deal of real technical writing.

Choose deliberately before drafting. The registers differ not in vocabulary but in what they treat as evidence, where they place the conclusion, and how much of the writer is permitted on the page. A piece that drifts between them reads as unreliable, because the reader has been given no stable basis for judging what the sentences are claiming.

---

## 1. Technical authority (professional / academic)

Professional and academic writing are commonly treated as separate genres, and for good reason, but in working technical prose they collapse into a single register with a coherent purpose: to make a claim that an informed skeptic can evaluate and act on. What follows is that merged register, with the parent conventions named where they conflict, because the conflicts are where most technical documents go wrong.

### What each parent contributes

From the academic side: claims are scoped rather than universal, terminology is fixed, non-obvious assertions are traceable to something, and the limits of the analysis are stated rather than discovered by the reader.

From the professional side: the reader has other things to do, the conclusion is worth stating early, tradeoffs are named explicitly, and the document exists to enable a decision rather than to demonstrate thoroughness.

### Where they conflict, and how to resolve it

**Placement of the conclusion.** Academic form builds toward the finding; professional form leads with it. Resolve toward professional. State the claim in the first paragraph and spend the document earning it, on the assumption that a meaningful fraction of readers will stop after the second paragraph and should still leave with the right idea in their heads.

**Confidence.** Academic form hedges; professional form projects certainty. Resolve toward neither. State a confidence level and then name the specific thing that would change it. "We are reasonably confident, and the assumption carrying the most weight is that write volume stays within an order of magnitude of today's" does the work that both a bare assertion and a general disclaimer fail to do. Generic hedging, the sentence acknowledging that circumstances vary and results may differ, is padding and should be cut on sight.

**Structure.** Academic form signposts heavily; professional form uses functional headings. Both are permitted, and both are frequently overused. Headings exist so a reader can navigate a document they will not read linearly. They do not license the collapse of argument into bulleted fragments: the connective tissue of reasoning, the *because*, the *except when*, the *which is why we rejected the obvious alternative*, lives in prose and cannot survive being bulleted.

**Agency and voice.** Academic form tolerates the passive where the agent is genuinely unimportant. Professional form wants the actor named, because accountability for a decision is part of the content. Resolve toward naming the actor for anything anyone chose, and permitting the passive for things that merely happened.

**Terminology.** Fixed, in both parents, and non-negotiable here. Elegant variation, reaching for a synonym so a paragraph does not repeat itself, is a defect in this register, because the reader must then work out whether a new word signals a new concept. Repeat the term.

**Evidence.** Academic standards apply to anything presented as fact. Professional writing additionally admits a kind of evidence the academic form does not, namely accumulated practitioner experience, and that is legitimate provided it is labeled as what it is. "In three deployments of this pattern we have seen the same failure" is honest. The same claim dressed as a general property of the pattern is not.

### Sentence mechanics

Long accumulating sentences work well here and are underused, but each one has to survive being diagrammed: if the subordination is doing real logical work, keep it, and if the sentence is long because clauses were appended in the order they occurred to you, restructure. Parentheticals carry qualification. Humor is permitted and should be rationed, since a joke inside a risk assessment either lands well or destroys the paragraph's credibility, with very little middle ground.

### Characteristic failures

The lab coat over the sales pitch, which readers detect immediately and which costs more credibility than the document was ever going to gain. False precision, where a number carries three significant figures and one significant assumption. Process nouns all the way down, so that no sentence contains a concrete actor. And the design document that describes only the happy path, which is a proposal wearing a design document's clothes: state what would falsify the design.

---

## 2. Literary nonfiction

The genre's defining condition is a constraint, not a permission. Everything asserted is offered as true, including reconstructed scene, remembered dialogue, and the emotional weather of a room, and the whole apparatus of literary technique operates inside that constraint. The techniques of fiction are available; the license of fiction is not.

### Conventions

**The particular earns the abstract.** An essay moves from something that actually happened to something it means, and the meaning is convincing only in proportion to how specific the something was. Reverse the order and the reader is being asked to accept a conclusion before seeing the grounds.

**Concrete does not mean visual.** Sensory description is the most commonly taught form of concreteness and among the least interesting. Sequence, procedure, dialogue, physical action, sound, cost, duration, and the exact wording of what someone said are all concrete, frequently more so than an inventory of what a room looked like, and they carry information the visual sweep does not.

**First person carries an epistemic function.** The "I" is not there for warmth. It marks the difference between what was observed, what was inferred afterward, what was reconstructed from someone else's account, and what is being conceded as possibly misremembered. Used well it makes the essay more reliable rather than less. Used as a mood, it is self-indulgence.

**Compression is allowed; invention is not.** Time can be compressed, a dozen conversations can become one, and dead ends can be omitted. Details cannot be manufactured for effect. When a scene is a composite, say so somewhere, once, without apology.

**Uncertainty about the past is material, not a defect.** Memory is unreliable and the honest essay says so in the text. "I have told this story enough times that I no longer trust the version I have" is a stronger sentence than a confident reconstruction, and it belongs in the essay rather than in a footnote.

**Digression is permitted and often the point,** provided it returns and provided the return is not announced.

**Rhythm is a design surface.** Sentence length, clause order, and where the stress lands at the end of a sentence are all under deliberate control here in a way they are not elsewhere.

**Tonal shift is structural.** Humor arriving inside a serious passage, or seriousness arriving inside a comic one, carries meaning through the shift itself. This is a load-bearing device, not decoration, and it fails when it is applied evenly.

**The turn comes late and unannounced.** The pivot from what happened to what it means should not be signposted, and should not arrive in the second paragraph.

### Characteristic failures

The epiphany closer, in which the writer arrives at a realization sized to fit the essay rather than to fit the events. Scene deployed as decoration, with a paragraph of atmosphere preceding an argument that owes it nothing. Borrowed profundity, where the subject is invested with a significance it cannot support. Overwriting, particularly of sensory detail, which reliably signals a writer who does not trust the material. And the closing fragment reaching for resonance, which is the single most common way an otherwise good essay ends badly.

---

## 3. The hybrid: the technical essay

Most serious writing about technology lives here, and it is the hardest of the three to hold steady.

It takes from literary nonfiction the rhythm, the tonal freedom, the willingness to digress, and the first-person epistemic marking. It takes from technical authority the discipline about claims: every entertaining assertion is still an assertion, still has a truth value, and still needs to be right. The failure mode specific to the hybrid is that literary permission quietly erodes the accuracy constraint, because a sentence that scans well is harder to interrogate than a sentence that does not.

The governing rule: when the elegant version of a sentence is less true than the clumsy version, ship the clumsy version and then find a third version that is both. Two of the three constraints, elegance and accuracy, are usually satisfiable at once. It just takes another pass.

A practical tell that the hybrid has slipped: check whether the strongest claim in the piece is also the one with the least support. In a drifting technical essay it almost always is, because it arrived on the strength of its cadence.
