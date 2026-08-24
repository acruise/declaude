# Condition B1 — Sonnet, prose-voice skill applied (literary nonfiction)

**Prompt:** Write the opening ~400 words of a literary nonfiction essay about the night a production system failed, moving from scene toward reflection on how organizations decide what counts as an emergency. First person. No invented statistics.

---

## Sev One

The phone found me before I found my glasses, which is the correct order for the phone and the wrong order for me; by the time the screen resolved into legible text I already understood the shape of the next six hours. PagerDuty does not experiment with subtlety, sending the identical tone whether a disk is quietly filling up or the checkout flow has stopped taking money, so the real triage happens not at the alert but in the fifteen seconds after it, standing in a dark kitchen with a phone too small for the graph it's trying to show you, trying to decide whether tonight is the night you go back to bed.

It was not that kind of night. The error rate on the payment service had climbed from its usual quiet hum into something closer to a straight line, and a straight line on that particular graph means, roughly, that the company has stopped selling things and started apologizing for not selling them. I got the laptop open on the counter, still wearing the shirt I'd slept in, and joined a call where four other people were doing what I was doing: reading logs and typing half-sentences into a channel, all of it aimed at finding the boundary between what had actually broken and what had merely noticed the breakage and started screaming about it.

Finding the fault took something like forty minutes. Convincing the room that it was the fault, and not merely the loudest of several plausible alarms, took twenty more, though by then none of us were tracking time closely enough for either number to be trusted, and it was that second stretch, the argument over whether the thing we could all see was the thing worth fixing, that I kept returning to once the outage itself had become old news.

An emergency, inside an organization, is not a property of the system. It is a claim someone has to win, in real time, against competing claims, made by people running on adrenaline and too little sleep whose sense of what matters does not automatically align with anyone else's. Nothing declares itself a Sev One; a person declares it, and then spends the next hour defending that declaration to whoever eventually asks why the whole company got pulled out of bed for it, and the real definition of "emergency" lives in that defense, not in the runbook that claims to supply one.
