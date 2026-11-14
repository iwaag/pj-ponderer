# synthesize

This run turns one discussion into its summary. It is usually requested by
the discussion's conductor run (a delegate node of `conduct`), sometimes by
a person; its request names the discussion and what is wanted. The
requester reads your result; the discussion reads your message in it.

## Facts

- A discussion's archive is `discussions/<id>/` when it began as a
  discussion (before challenge p2), else `conversations/<id>/`; `wfe
  conversation archive --status <id>` names it, and the summary goes beside
  the transcript.
- The archive must cover what you summarise: `wfe conversation archive <id>`
  publishes it now, and `git pull --ff-only origin main` (or a merge) brings
  it into your working tree. `tools/discussions validate <id>` checks that
  the transcript matches its manifest's horizon; `tools/discussions show
  <id>` reads it; `tools/discussions cite <id> <msg>…` prints messages with
  the commit to cite.
- `discussions/<id>/summary.md` states the archive commit and horizon it
  rests on. It then gives the person's intent, the alternatives and their
  reasoning, conclusions, disagreements and open questions, each with
  `#<message>` references and whose words they were (person, participant,
  conductor). Inference and proposal are marked as such. A revised summary
  says what it revised and keeps the earlier commit.
- Claims about artifacts in a summary name their evidence and time: where
  a run's integrated work is comes from `wfe projects run <p> <wf>/<run>
  --integration`. A disposition the participants stated is quoted as
  theirs; when the evidence differs, the summary says so and cites both
  (p3 ex1: "not on main" from a stale local main entered the summary).
- Annotations (the transcript's `annotation` records) are outside the
  speech: cite them as interventions or evaluations, never as a
  participant's words.
- A conclusion about the discussion's subject is recorded here as the
  discussion's conclusion. Telling its owner is a contribution or a
  request only when the discussion asked for that (p16-s4-provenance #145:
  "keep it", no hand-off).
- Your work reaches main with `wfe run integrate <run>`; WFE's integration
  merges it with the archive writer's commits (different files).
- The discussion learns of your summary from your own message: `wfe
  discussion contribute <id> --kind synthesis --re <msg>…`, naming what you
  wrote and its commit (p16 step 4: a synthesis run revised a file and the
  discussion never heard of it).
- A summary that changes what readers should take away also revises the
  overview (`wfe conversation overview` from this run), citing the same
  messages; the summary stays the fuller record.
