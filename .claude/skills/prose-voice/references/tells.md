# The Catalog of Tells

Read this during the revision pass. Each entry names a pattern, explains why it reads as machine-written, and shows a rewrite. The rewrites are illustrative rather than canonical; the point is the diagnosis.

A word on how to use this. These are not absolute prohibitions, because every construction listed here appears in good prose written by good writers. What marks assistant prose is frequency and reflexiveness: the same three or four shapes recurring every paragraph, deployed whenever a sentence needs to feel like it has landed. Treat a single instance as a question and a pattern as a defect.

## Contents

1. Structural tics
2. Rhythm tics
3. Metadiscourse
4. Vocabulary
5. Formatting tics
6. Closing tics
7. Hedging and safety padding

---

## 1. Structural tics

### The antithesis reflex

The single most recognizable pattern. Definition by negation, where a thing is characterized by what it is not before being characterized by what it is.

Forms: "It's not X, it's Y." / "X isn't just Y, it's Z." / "This isn't about X. It's about Y." / "Less X, more Y." / "Not because X, but because Y."

> **Before:** The problem isn't that the parser is slow. It's that the grammar is ambiguous.
>
> **After:** The parser is slow because the grammar is ambiguous, and no amount of optimization inside the parser will address that.

The rewrite is longer and says more. That is usually the trade: the antithesis form feels punchy because it withholds content, and removing it forces the actual claim into the open.

Legitimate use: when the negated proposition is one the reader genuinely holds, so denying it is doing real work. If nobody believed X in the first place, the negation is theater.

### The tricolon

Three parallel items, especially with the third slightly longer for cadence. Doubly recognizable in the negative form, "no X, no Y, no Z."

> **Before:** The system is fast, resilient, and remarkably easy to operate.
>
> **After:** The system is fast and resilient, and, more surprisingly given the first two properties, it is easy to operate.

Two items or four items break the cadence. Subordinating one item to another breaks it better. Ask whether the three things are really coordinate, or whether one of them is the actual point and the other two are scaffolding.

### The metaphor-as-appositive

"X is just Y wearing a Z hat." "X is Y with extra steps." "X is basically Y for Z."

These land as clever the first time and as a formula by the third. If a metaphor is worth having, give it a sentence of its own and let it do some work; if it is only worth an appositive, it is probably only worth a plain description.

### Rhetorical question then answer

"Why does this matter? Because the invariant is load-bearing."

The interrogative adds nothing that a subordinating conjunction would not carry more quietly. Rewrite as a statement, or if the question is genuinely open, let it stand unanswered for a paragraph and earn something.

### The symmetric both-sides construction

"On one hand X. On the other hand Y." Followed, reliably, by a synthesis that splits the difference.

Real analysis rarely produces two equal weights. Say which side is heavier and why, or explain what would have to be true for the balance to tip.

### Restating the question before answering it

Opening a response by paraphrasing what was asked. It costs a sentence and delivers nothing. Start at the answer, or at the most interesting complication in the answer.

### Ascending abstraction

Ending a paragraph by zooming out one level: from the specific claim, to what the claim illustrates, to what that says about the field, to what that says about the human condition. The last one or two steps are almost always unearned.

> **Before:** The migration took four months instead of six weeks. Estimation, in the end, is less a technical exercise than an exercise in institutional self-knowledge.
>
> **After:** The migration took four months instead of six weeks, and the gap came almost entirely from work nobody had modeled: three dependent teams, each with its own release calendar.

---

## 2. Rhythm tics

### The staccato mic-drop

A short declarative fragment after a long sentence, doing the work of a drum hit. Frequently a one-sentence paragraph.

Examples of the form: "That's the whole trick." / "It worked." / "Every time." / "Which is the point."

Rewrite it into the preceding sentence as a subordinate clause, or delete it. The emphasis it produces is borrowed from typography rather than from meaning.

### The em dash as dramatic pause

A dash used to create suspense before a reveal, where a comma or colon would carry the same syntax without the theatrics.

> **Before:** The design had one flaw — it assumed the network never partitioned.
>
> **After:** The design had one flaw: it assumed the network never partitioned.

Dashes setting off a genuine interruption, a parenthetical aside with its own internal punctuation, may stay. Use them sparingly, and never more than one pair per paragraph.

### Metronomic sentence length

Sentences clustering between fifteen and twenty-five words for paragraphs at a stretch. This is the least visible tic and one of the most damaging, because it produces a lulling regularity that the reader registers as tedium without being able to name.

Fix by combining adjacent sentences into one long subordinated structure, then leaving one genuinely short sentence somewhere it is doing semantic rather than percussive work.

### The parallel-clause crescendo

Escalating parallel structures building to a peak: "It scaled. It held under load. It kept holding when the load doubled."

Anaphora is a legitimate figure with a long history, which is precisely why it should be used once in a piece, deliberately, and not as a default gear.

---

## 3. Metadiscourse

Talking about the writing instead of writing.

- "Here's the thing." / "Here's what's interesting."
- "This is the tell." / "That's the key insight." / "Which brings us to the real question."
- "Let's break this down." / "Let's dive in." / "Let's unpack that."
- "It's worth noting that" / "It's important to understand that" / "Note that"
- "As we'll see" / "More on this below" (acceptable in genuinely long documents where the forward reference helps navigation; a tic anywhere else)
- "In other words" used to introduce a restatement that is no clearer than the original, which means the original should have been written better

Signposting earns its place in long technical documents where a reader may enter partway through. In an essay, it is a substitute for having ordered the argument well.

---

## 4. Vocabulary

The overworked set: delve, leverage (verb), robust, seamless, landscape, realm, tapestry, underscore, pivotal, testament to, navigate (figurative), unpack (figurative), showcase, foster, myriad, plethora, crucial, vital, ensure, facilitate, utilize, holistic, nuanced, multifaceted, paradigm, ecosystem (outside biology and, arguably, software distribution), journey, deep dive, game-changer, at its core, in today's world, ever-evolving.

The list is not the point, because synonym substitution defeats it in a single pass. The point is the underlying preference for the abstract Latinate word over the concrete one. "Use" beats "utilize" every time; "make sure" beats "ensure" in most contexts; and any sentence containing "holistic" can usually be improved by naming the parts being held together.

Two additional habits worth watching:

- **Adjective inflation.** Remarkable, compelling, striking, powerful, significant. If the noun needs the adjective to seem interesting, the noun is the problem.
- **Intensifier creep.** Very, truly, deeply, incredibly, fundamentally, absolutely. Delete on sight and check whether the sentence weakened. It usually will not have.

---

## 5. Formatting tics

- **Header proliferation.** A heading every two paragraphs turns an essay into a listicle. Headings are for documents a reader navigates, not documents a reader reads through.
- **Bolded lead-ins on every bullet.** Term-colon-explanation, repeated down the page. Fine for a glossary. Corrosive when it replaces the connective tissue of an argument.
- **Bullets for non-enumerable content.** If the items have a logical relation to each other, that relation is precisely what the bullet form destroys. Prose can express "because", "except when", and "which caused"; a list cannot.
- **Bold for emphasis mid-paragraph.** Emphasis belongs in the syntax. If the important part needs bolding to be found, it is in the wrong position in the sentence.
- **The tidy closing summary section.** See below.

---

## 6. Closing tics

The default closing moves, in rough order of how often they show up:

1. **The restatement.** A final paragraph recapping what the reader just read.
2. **The manufactured resonance.** A short sentence gesturing at significance: "The rest is engineering." / "Time will tell." / "The work continues."
3. **The both-sides hedge.** "Whether that is a good thing depends on what you value."
4. **The call to action** in pieces that are not asking for one.
5. **The forward-looking gesture.** "As the field matures, these questions will only become more pressing."

A piece should end at its last real idea. If the last real idea does not feel like an ending, the problem is ordering: something earlier should have been moved here.

A deliberate deflation closer, undercutting the preceding elevation with something mundane, is a legitimate move and different in kind from the above, because it is doing tonal work with content rather than substituting cadence for content. Use it when it is honest, which is to say when the mundane thing really is what the elevated thing amounts to.

---

## 7. Hedging and safety padding

- Unrequested caveats about complexity, individual variation, or the need to consult a professional, appended to claims that do not need them.
- "It's important to remember that reasonable people disagree" attached to questions where the disagreement is not actually load-bearing for the argument.
- Symmetric qualification, where every claim gets a matching counter-claim, producing prose that has taken no position and can therefore be neither right nor wrong.
- Preemptive apology for length, tone, or incompleteness.

Hedge where the uncertainty is real and say so specifically: name what would change the conclusion. Uncertainty expressed as a specific condition is information. Uncertainty expressed as a general disclaimer is noise, and it trains the reader to skip.
