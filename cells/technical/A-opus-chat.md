## The Benchmark Trap

Every query engine paper has the same chart. Latency on the y-axis, some workload on the x-axis, and a line that sits comfortably below last year's system. It's a compelling story. It's also the wrong one.

Here's why: static plan quality is easy to measure. You hand the optimizer a query, it hands you back a plan, you execute the plan, you record the time. The measurement is reproducible, comparable across systems, and legible to a reviewer who has thirty minutes and eight papers to get through. Adaptive re-planning resists all of this. Its value shows up in the tail — in the queries where the cardinality estimate was off by three orders of magnitude, where the data skewed in a way nobody modeled, where a join that looked cheap at plan time turned out to be the entire cost of the query.

Those cases don't benchmark well. They don't benchmark well because they're precisely the cases benchmarks are designed to exclude. A good benchmark is stable, repeatable, and representative. Adaptivity pays off when the world is unstable, unrepeatable, and unrepresentative.

So the field optimizes what it can see.

This isn't a conspiracy. It's a gradient. Researchers respond to what gets published, engineers respond to what gets measured, and vendors respond to what wins bake-offs. Each of these actors is behaving rationally, and the aggregate result is a two-decade investment in making the initial plan better while the machinery for noticing that the initial plan was wrong remains, in most production systems, essentially absent.

And the initial plan is going to be wrong. Not occasionally — structurally. Cardinality estimation is the load-bearing assumption underneath every cost model in every optimizer, and cardinality estimation over multi-way joins with correlated predicates is, in the general case, hopeless. We have known this for a long time. We keep building as though we haven't.

What would it look like to take the other path seriously? It would mean treating the plan not as a decision but as a hypothesis. It would mean instrumenting operators to report what they're actually seeing, not just what they produced. It would mean accepting that a query's execution might change shape halfway through, with all the ugly consequences that has for memory accounting, for spill behavior, and for the tidy mental model of a plan as a static DAG.

It's harder. It's messier. It's much less likely to produce a clean chart.

That's the point.
