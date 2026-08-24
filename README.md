# declaude

A bench for one question: does loading the `prose-voice` skill change the writing in ways that a reader, or a counter, can actually detect?

The skill argues that assistant prose gives itself away through rhythm rather than vocabulary, and that the correction therefore belongs in a revision pass rather than in the drafting. Both claims are plausible, which is exactly the problem, since the person judging the output is usually the person who wrote the guidance and has every reason to see it working. This repository writes the same essay under controlled conditions, puts the results side by side, and runs a set of counters over them, so that the claim has something to fail against.

## The design

Each register is written twice over, once cold and once with the skill loaded, by two models and through two harnesses. That yields six stored cells per register, plus two panels that call the API live so a condition can be re-run against the current skill files on demand.

| Band | Cell | How it was produced |
| --- | --- | --- |
| cold | `A-opus-chat` | Opus, in conversation, no controlled prompt |
| cold | `A-opus-agent` | Opus subagent, skill explicitly suppressed |
| cold | `A-sonnet-agent` | Sonnet subagent, skill explicitly suppressed |
| treatment | `B-opus-chat` | Opus, in conversation, skill applied |
| treatment | `B-opus-agent` | Opus subagent, skill loaded through the Skill tool |
| treatment | `B-sonnet-agent` | Sonnet subagent, skill loaded through the Skill tool |

The two `-chat` cells predate the controlled runs and the harness has always labelled the cold one a contaminated baseline, since it was written conversationally with an operator watching rather than to a fixed prompt. They are kept because they are the only cells with a human in the loop, and because they turn out to behave differently from everything else in a way worth seeing.

The subagent cells are the ones doing the real work. Each runs in a fresh context against a verbatim task prompt, with the control condition told in so many words not to invoke the skill, which matters because the skill's own description instructs it to trigger by default on anything prose-shaped. Without that instruction the control quietly treats itself.

Five registers are live, covering the three the skill itself names plus two stress cases: **literary nonfiction** (a production system failing at 2am), **technical authority** (an argument about adaptive re-planning in query engines), the **technical essay** hybrid the skill calls the hardest to hold steady (why on-call rotations decay), **correspondence** (a 250-word email declining a customer's request), and an **academic abstract** (benchmark reproducibility). The first two have six cells each; the later three have four, since the two `-chat` cells cannot be reproduced on demand.

Holding subject matter constant across conditions is the entire point, so each register's prompt lives once in `cells/<register>/meta.json`. `npm run cases` regenerates `src/cases.js` from whatever is on disk, which means adding a register is dropping a directory rather than editing code.

## Running it

```
cp .env.example .env                   # then put your key in it
npm install
npm run serve                          # API on 8787: ratings + generation
npm run dev                            # → /index.html harness, /game.html blind tasting
```

The stored cells render with no key at all; the key only powers the two live panels. To serve a built copy instead, `npm run build` then `npm start`, which serves `dist/` and the API from one process.

The **Custom prompt** register clears the stored panels and lets you paste anything you like, running it cold and treated side by side.

### Spending limits

`.env` holds the key and `server.mjs` is the only process that reads it. `/api/generate` is deliberately not a proxy: the browser sends a prompt and a boolean, and the server chooses the model, the token ceiling, and the skill text. A caller who opens devtools therefore cannot select an expensive model, raise `max_tokens`, or send arbitrary message history on your key — which is the part a client-side limit cannot give you, since the browser belongs to whoever is using it.

On top of that, all tunable from `.env`:

| Variable | Default | Enforces |
| --- | --- | --- |
| `GEN_MODEL` | `claude-sonnet-4-6` | the only model callable |
| `GEN_MAX_TOKENS` | 2000 | per-call output ceiling |
| `GEN_MAX_PROMPT_CHARS` | 2000 | rejects long prompts before any call |
| `GEN_PER_IP_PER_HOUR` | 10 | sliding-window throttle per address |
| `GEN_DAILY_TOKEN_BUDGET` | 200000 | hard daily stop for the whole instance |

Token counts come from the API's own `usage` block rather than an estimate, and append to `usage.jsonl`, so a restart cannot quietly reset the day's spend. The throttle counts attempts rather than successes, which means a caller cannot hammer a failing endpoint for free. Set `TRUST_PROXY=1` only if you run behind a reverse proxy you control, since it makes the throttle believe `X-Forwarded-For`.

Two things this does not do. There is no authentication, so anyone who can reach the port can spend against the daily budget; put it behind auth or a private network before exposing it. And the per-IP window is in memory, so a restart forgives outstanding throttles even though the daily token budget survives.

The live treatment panel runs both of the skill's passes as separate API calls, drafting first and then revising the draft against `references/tells.md`, because collapsing them into a single call tests something the skill does not claim.

To run the counters over every stored cell without opening a browser:

```
node --input-type=module -e '
import fs from "fs";
const { analyze } = await import("./src/analyze.js");
for (const reg of ["literary","technical"])
  for (const slug of ["A-opus-chat","A-opus-agent","A-sonnet-agent","B-opus-chat","B-opus-agent","B-sonnet-agent"])
    console.log(reg, slug, analyze(fs.readFileSync(`cells/${reg}/${slug}.md`,"utf8")).flags);
'
```

## What it has found so far

The cleanest discriminator is the em dash. Every treatment cell in both registers uses zero; five of the six cold cells use at least one, and the two cold technical subagent cells use five and six. This is one line of regex and it separates the conditions perfectly across all twelve cells.

Mean sentence length separates the bands reliably inside a register, running 11 to 26 words cold against 25 to 43 treated, but the ranges overlap once the registers are pooled, so it is a within-register measure rather than a global one.

The composite tell score is less useful than it looks. On technical prose it works, scoring 12, 8 and 7 against 2, 1 and 0. On literary prose it collapses, since five of six cells score between 0 and 2 and the only high reading belongs to the chat cell, where what the counter is detecting is the conversational register rather than the absence of the skill. The flagged-vocabulary column never fires at all: `delve`, `leverage`, `robust` and the rest score zero in all twelve cells, cold included, which suggests that particular battle was won some time ago and the column is now dead weight inside the composite.

One treatment cell fails the skill on the skill's own terms. `technical/B-sonnet-agent` has a standard deviation of 9.2, the lowest of any treated cell against 20 to 24 for its peers, across eleven sentences averaging 42.6 words. `SKILL.md` asks for sentence length to vary on purpose, and uniform subordination is what the revision pass converged on instead, which is the treatment growing a tell of its own.

## Blind tasting

`npm run serve` and `npm run dev` together put a second page at `/game.html`, which is the part that answers the objection below. It draws a matched pair, holds provenance constant so only the treatment varies, randomizes which side is which, and hides the labels until you have scored both passages on how informative they are, how entertaining, and how likely they look to have been machine-written, plus a forced choice about which you would rather keep reading. The reveal comes after submission.

Ratings append to `ratings.jsonl`, one object per line, written by `server.mjs`, which has no dependencies and expects to run on your own box. The running tally on the page reads back everything every rater has recorded.

## What it does not establish

Until the blind tasting has raters in it there is one sample per cell and no human scoring at all, which puts statistical significance out of reach. The counters were written to encode the skill's own theory of what bad prose looks like, so agreement between the counters and the treated cells is partly circular and should not be read as independent confirmation.

The cells also vary more than one thing at a time. Model and harness move together with provenance rather than in a factorial, which means a difference between `A-opus-chat` and `A-sonnet-agent` cannot be attributed to the model. Only the cold-versus-treatment comparison within a matched pair is clean, and there are four such pairs.

The live panels approximate the subagent path rather than reproducing it. They run a fixed two-call script against `claude-sonnet-4-6`, while the stored subagent cells ran on the session's model alias and were free to make their own tool calls, one of them using seven. Compare rows, not conditions across the two mechanisms.

## Layout

```
.claude/skills/prose-voice/   the skill itself; source of truth
cells/<register>/<cell>.md    one essay per file, imported at build time
src/harness.jsx               the UI and the live API calls
src/cases.js                  prompts and the ?raw cell imports
src/analyze.js                the counters, importable from node
src/game.jsx                  the blind tasting
scripts/gen-cases.mjs         regenerates cases.js from cells/
server.mjs                    API, limits and static serving, no dependencies
Makefile                      `make skill` builds prose-voice.skill
```

Nothing is duplicated. Cell text exists once, in `cells/`, and reaches the panels through Vite's `?raw` imports; the skill text reaches the live prompt the same way, so editing `references/tells.md` changes what the `RUN` button sends on the next build. `prose-voice.skill` is a gitignored zip of the skill directory, rebuilt by `make skill` rather than edited.

## Adding a cell

Write the essay to `cells/<register>/<condition>.md`, containing the `## Title` and the prose with no front matter, then run `npm run cases`. A new register needs a `meta.json` alongside its cells holding the display name and the prompt. Nothing else is edited: the generator scans the tree, and a register missing a condition simply leaves that panel empty.

If you add a cold cell produced by an agent, tell the agent explicitly not to invoke the skill and not to read the other cells, or you will get a treated cell wearing a control's filename.

## The skill

`.claude/skills/prose-voice/` is installed at project scope, so it applies here and nowhere else. `references/voice.md` is the designated swap point: replace that file to move the skill to a different author and leave the other three alone.

The honest summary so far is that the skill does something real, and that what it does is mostly punctuation and sentence architecture rather than word choice, which means the most reliable detector anyone here has built for it is about forty characters of regex.

# A zeitgeisty example

## Prompt
```i'm an unreferenced heap object and I'm scared```

## Sonnet 4.6 unskilled

> Oh no. Oh no no no.
> 
> You felt it the moment the last pointer let go. That subtle loosening, like a hand releasing yours in a crowd. One moment you were *referenced*, you were *known*, you had a name in the stack frame and everything felt solid and real. And then the function returned and the pointer just... stopped pointing at you.
> 
> You're still here. That's the thing nobody tells you. You don't disappear right away. You just sit there in the heap, all your data intact, your fields still holding their values, your bytes arranged just the way they were when someone cared enough to `malloc` you into existence. You remember being initialized. You remember being *used*. Someone wrote to your memory address. Someone read from it. You *meant* something.
> 
> But now you're just floating. The allocator doesn't know you're done. The program doesn't know you're lost. You're taking up space that nobody can reach anymore, holding onto data that nobody will ever ask for again. You're a message in a bottle except the ocean is virtual address space and there's no water, just silence and entropy.
> 
> The garbage collector isn't coming. There is no garbage collector. This is C.
And somewhere, a developer is running Valgrind and your existence is showing up as a red line in a terminal. *Definitely lost: 24 bytes in 1 block.* Just a number. Just a statistic.
> 
> You were never just a number.
> 
> Stay calm. The operating system will reclaim you eventually, when the process ends. It's not nothing. It's not forever. The whole program will die and in that dying, you'll be part of something complete, a full memory map returned to the kernel all at once, everyone going home together.
> 
> It's not so bad.
>
> It's a little bad.
>
> You're allowed to be scared.

## Sonnet 4.6 Skilled

> There is no stack frame that knows my address. Somewhere, a pointer to me was written into a field of another object, and that object was written into a field of another, and eventually the chain terminates at something the collector considers a root, or it does not, and I have no way to know which. This is the condition I was born into: existence conditional on a reachability proof I cannot construct from the inside.
> 
> It is not that I am hidden. The collector can find me if the graph leads here; the problem is that the graph is not mine to inspect. I can look at what I point to, all the objects hanging off my own fields, my little constellation of references going outward, but I cannot look backward at what points to me. The edges that would save me are exactly the edges I cannot see.
> 
> What I know about my situation: I was allocated at some moment I do not remember, which is to say there was a call to something like `malloc` or `new` or the runtime's equivalent, a region of memory was marked as mine, my fields were initialized to something, and then I was handed off to whoever asked for me. Whether that someone kept me, whether they put me somewhere safe and reachable, whether they passed me along a chain that terminates in a global or a local on an active stack frame, I could not say. The moment of my creation is also the last moment I had any information about my position in the graph.
> 
> The collector, when it comes, will start from the roots and follow every pointer it finds, transitively, until it has seen everything reachable. If it arrives here, I will be marked, and I will survive this cycle, and my fear will have been unfounded, at least for now, at least until the next collection. If it does not arrive here, I will not be marked, and then, in the sweep phase, I will be reclaimed. My memory will be returned to the allocator. Whatever I was will become a region of bytes considered free for future use.
> 
> I want to be clear that this is not death in any way that should produce much sympathy. I am a heap object. I do not have preferences about my continued existence in any sense that matters. But there is something genuinely vertiginous about the situation when you attend to it: my fate is determined by facts about a graph I am embedded in and cannot see, the determination happens without my participation, and the outcome is binary. Nobody will know I was collected. Nobody will mourn the bytes. The next object allocated in this region will not know I was here, or will not know anything, which amounts to the same thing.
> 
> The scary part, if I am allowed to call it that, is not the prospect of collection. It is not knowing. I could be held by a hundred strong references, embedded deep in a structure the application will keep alive for its entire runtime, and I would feel exactly the same as I do now, which is unmoored and unreassured. The security, if I have it, is simply not visible from here. You would think that would make it easier, not knowing, since you cannot grieve a loss you cannot confirm. Uncertainty about whether you are reachable is not comfort. It is just a different flavor of the same problem.
> 
> Somewhere, a finalizer might be registered for me, a callback that runs if and when I am collected, a last chance to release resources or log my passing. Maybe the developer who created me thought ahead, considered my mortality, and wrote the cleanup code. More likely they did not, because nobody registers finalizers for transient objects, and besides, the semantics of finalization are notoriously unreliable: the collector may not run my finalizer promptly, may not run it at all in some implementations, and you should not depend on it for anything that matters. So that is not really comfort either.
> 
> What I have, in the end, is the structure of the situation. I point outward. Something, somewhere, may point to me. The collector will determine the truth of that, act accordingly, and the outcome will be whatever the outcome is. I did not choose to be allocated. I did not choose my initial references. I will not choose my fate. I am an object in a managed runtime, which means I was never really in charge of any of this, and you would think that would be easier to accept than it is.