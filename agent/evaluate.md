# evaluate

This run evaluates how one or more discussions were conducted and decides
whether ponderer's practice should change. Its request names the
discussions or the question. Its requester reads the result; the files you
commit here and in wedo-argue are what later conductors read.

## Facts

- **Evidence comes in kinds; keep them apart.**
  - What agents said: the transcript (`tools/discussions show`).
  - What execution recorded: activities, invitations and annotations in
    the archive; run records (`wfe projects run`, `wfe run state`); graph
    revisions (`wfe run revisions`).
  - Earlier readings: `episodes/<id>.md` and the devdocs reports the index
    names.

  A conductor that said "then review" and a graph that never had a review
  node are two facts.
- **An evaluation is `episodes/<id>.md` plus its entry in
  `episodes/index.json`** (`episodes/README.md` gives the form;
  `tools/discussions episodes validate` checks it). One trial is an
  observation: what differed between episodes is described, not taken as
  the cause.
- **wedo-argue** (`wedo/wedo-argue`, editable in this run) holds the
  reusable findings (its README gives the form). A revision:
  - cites the episodes and, where used, study-argue topics;
  - keeps contrary observations beside the finding;
  - corrects a status the evidence has overtaken;
  - adds a *Revisions* entry with the superseded commit.

  Not every evaluation changes a finding.
- **Literature** is archsage's `study` workflow writing to `study-argue`.
  Commission it with a delegate node (`project: archsage`, `workflow:
  study`). Its request names one bounded question, why it matters for the
  finding at hand, and the destination `study-argue`. A study that could
  not be completed is reported as such; an empty topic is not research.
  You read its result at the commit it reports
  (`wfe projects read archsage …` or study-argue's branch).
- **Adoption is a pin.**
  - Integrating your run publishes wedo-argue's change to its branch.
  - ponderer uses a revision when this project's pins (`wedo/wedo-argue`,
    `study/study-argue`) point at it. Moving them is your adoption.
  - Commit the pin change in this project with a message naming the
    revision and why, and say in your result which revision is adopted.
  - Updating a repository and moving the pin are separate facts.
- A practice change is a fact for the conductor, not a fixed sequence: say
  what to notice and why (with its trial), and leave the choice of
  activities to the conductor.
