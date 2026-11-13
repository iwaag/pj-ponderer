# Episodes

An index of comparable discussion episodes and their analyses,
so a later trial can be compared with earlier ones on what was actually
recorded. Written by ponderer's `evaluate` runs. `tools/discussions episodes` lists it;
`tools/discussions episodes validate` checks it.

- `index.json` (`ag.argue.episodes.v1`): one entry per episode — `id`,
  `title`, `date`, `devdocs` (where the episode's reports are kept, if
  anywhere), `analysis` (a file here), `discussions` (`{id, archived}`),
  `task`, `conditions` and `unknown`.
- `conditions` names what differed between episodes: `conductor` (which
  workflow progressed the discussion), `participants`, `profiles` (requested
  execution profiles; actual models are in the runs' attempt records),
  `revisions` (system and project commits), `guidance` (what the agents'
  guides said that bears on the trial), `brief` (who wrote it, how it was
  posted), `interventions` (hints, repairs, cleanups), `reuse` (earlier
  artifacts the agents could use).
- A condition the records do not hold is listed in `unknown`
  (`"<condition>: <why>"`) rather than reconstructed.

An analysis (`<id>.md`) keeps, in this order: the task; the conditions in
short; the path the discussion took; observations for each comparison
question (question selection, repeated discussion, waits and their
owners, interventions and their effect, completion against speech,
accuracy of the final account, preservation); limitations; sources.
Observations quote or cite the record; an evaluator's reading is marked as
such. A few trials compare these episodes; they do not rank models or
workflows in general.

A fresh installation starts with an empty index.
