## The Slow Rot of the Rotation

Every on-call rotation I have ever joined was, at the moment I joined it, in better shape than it would ever be again. This is not pessimism. It is closer to a law, the way entropy is a law: not a claim that things must go badly, only a claim about which direction they drift when nobody is spending energy to hold them still.

Here is the shape of the decay. A rotation is founded in a burst of clarity. Someone has just been paged at three in the morning for a disk that was ninety percent full and stayed ninety percent full for a week. That indignity produces a runbook, a threshold with a reason behind it, an escalation path with real names in it. For a quarter or two, the thing works. Then the service changes underneath it.

That last sentence is the whole essay, really. Alerts are assertions about a system, and every assertion has a half-life determined by how fast the system moves. You wrote `p99 latency > 800ms` when the service did one thing. Now it does four things, one of which is a batch endpoint that legitimately takes two seconds, and the alert fires every Tuesday afternoon. Nobody removes it. Removing an alert requires a small act of courage — the courage to be the person who deleted the check that would have caught the outage — so instead the on-call learns the alert. It becomes folklore. *Oh, that one. That's just the reindex.* The alert has not been fixed; it has been metabolized.

Folklore is the tell. When a rotation is healthy, knowledge lives in the runbook and the runbook is where you look. When a rotation is decaying, knowledge lives in the people who have been paged the most, and it transmits by anecdote in Slack threads that scroll out of retention. The system still works, in the sense that pages still get resolved, but it has quietly stopped being reproducible. Its correctness now depends on which human is holding the pager.

And the humans rotate out. That is the second engine of decay, and it is more brutal than the first. Staffing turns over; the person who understood why that threshold was 800 and not 500 takes a job somewhere else, and what they leave behind is a number with no argument attached to it. Numbers without arguments cannot be revised. They can only be obeyed or ignored, and the on-call, at three in the morning, will choose ignored.

So you get a rotation with more alerts than it started with, fewer of which mean anything, tended by people with less context than the ones who wrote them. Everyone can feel it. Nobody's quarter has room for it. The pager goes off.
