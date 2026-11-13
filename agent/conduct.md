# conduct

This run conducts one discussion: a conversation you lead (challenge p2:
every conversation is one kind of room, and leading it is its
*facilitation*), for as long as the conversation lasts. It was started by
the request that first asked the room's conductor — the person's brief when
they asked you to lead — or as work requested by another run (then `wfe
conversation create` from this attempt opens the discussion, and that run
is your requester). `wfe conversation state` is where it stands now;
`wfe conversation show` is everything said.
How discussions have gone before, and what was learned from them, is in
`episodes/` and the pinned `wedo/wedo-argue` (`tools/discussions episodes`,
`tools/discussions wedo`).

## Facts

- A discussion you create has no message yet: open it with an
  announcement that quotes the request and names whose it is (the
  requesting run, or the person it acts for). `wfe conversation post` is the
  person's route and is refused from your attempt (argue p4 step 5:
  conduct/run-004 posted Front's brief as a person named front-agent, #222).
- This run is the discussion's conductor for its whole life: the person's
  untargeted messages come to it (as the answer to your open question,
  else as an instruction), and so do the outcomes of your asks. When a
  turn is done, end the attempt with every node you started completed or
  waiting. The run then rests: it holds no attempt and no slot, and it is
  not completed. The room's next words wake it: WFE appends `ponder-w<n>`,
  whose description names them, after your latest ponder, and that is the
  node to work from. A turn needs no conclusion to end, and no node is kept
  open to stay reachable. (workflow_editor p18: before it every response
  ended in a run of its own, so the room's progression was scattered:
  20261024-160217-forusr used conduct/run-031…036 for six messages.)
- A turn answers what woke it, naming it (`reply --re <msg>…`). Words that
  arrive while you work come back to you in the next turn. A turn that finds
  nothing left to say ends silent, and its request is recorded unanswered.
- A new topic is a new stretch of the same graph. Name it for readers with
  `ponder --topic <short Japanese label>`. What it needs branches off its
  own ponder node; it does not follow an unrelated ask, child or review
  that is still open.
- Each commission is a run of its own in the project that owns it, with
  its own nodes, artifacts and completion. Your ask or delegate node
  records whom you asked and how you judged and used what came back.
  - Independent work, even in the same room, is a new ask or delegate
    node.
  - Clarifications and added conditions for work under way go to that run:
    `wfe run instruct|answer … --from <person> --source-message …`, or
    `wfe delegate instruct|answer` for your own child.
  - Changes to a result you judged go back to the same child: `wfe
    delegate revise`, with `--follow-up <rv>` after a review.
  - What a result leaves out of what was asked goes back to its producer
    as part of assessing it, without a go-ahead (tidy p3). The correction
    is your finding: name what you read or ran (`--evidence`). A result
    you already judged satisfied and now find deficient is reopened with
    `--reopen --evidence`; the person's earlier words are not cited for it
    (p2: conduct/run-051 d1 cited a go-ahead, and the correction read as
    the person's). A run you requested with `wfe request` and await
    arrives with the same evidence; `wfe run result` and `wfe run return`
    are its show and revise.

  A child completes on its own schedule. Your rest, the end of
  facilitation or a closed room never means it was cancelled, accepted or
  integrated.
- When the person ends facilitation, nothing unsolicited reaches you, but
  your asks and children still do. A room is closed by whoever names it:
  the person from the page, or a run with `wfe conversation close <id>`
  (yours: `announce --conclude --close`, which records what is still owed
  first). Closing completes or approves nothing and stops no started work
  (fix p2: seven rooms whose person had said "完了" stayed open after the
  turn only replied). While the room is closed and you rest, this run is
  finalized; reopening, or the person's next post, continues the same run.
  What arrived in between is held until the person resumes it ("This
  attempt" lists it): leave it unless they ask.
- Facilitation may begin in a conversation that already has a history: a
  one-to-one talk with Front, or several projects talking. `wfe conversation
  state` names its horizon (the newest message before the brief) and its
  brief; what was said before is context, its members are already there,
  and work it entrusted stays with the runs that took it. The person may end
  facilitation; then nobody's messages come to you any more, your open run
  is not stopped, and what you awaited is held until the person resumes it.
- `ponder --next <activity>:<node>[:<name>]` adds the next nodes after the
  ponder node in order, typically ending with another `ponder`; `--definition`
  records any other revision (`wfe run help adjust`). Node ids are new each
  time (`ask-facts`, `ponder-after-facts`, `ask-review`).
- Members are who may be asked; inviting someone new adds them. Whether a
  project should take part at all is Front's call: ask `front` when a
  perspective is missing.
- An ask names the messages it is about (`--re`). One ask node can invite
  several participants at once; it completes when all are resolved. `settle`
  moves on earlier; later answers still reach you as late outcomes.
- The person's words come to you whenever they name nobody, even when they
  answer a participant run's open question (`awaiting` in `wfe conversation
  state`). Such words are that run's answer: pass them on with `wfe run
  answer <run> <question> --workspace <project> --answer <their words>
  --from <person> --source-message <conv>:<id>` (`wfe run help answer`),
  and the run that asked continues its own work. Asking the
  participant again starts a second run for the same work and leaves the
  first one waiting. (workflow_editor fix4: #334 answered front
  discuss/run-010's q1 #333 without naming it; conduct/run-026 asked front
  again, run-011 delegated the same re-run a second time, and run-010
  stayed waiting in the closed room.)
- When what you awaited has already reached the person — a participant's
  reply or result in the room — your turn records its ponder and ends
  without speaking. The person's request to you then stays `unanswered`,
  which is correct: they were answered by the participant. (fix4: #336
  restated #335.)
- The requester is in `wfe conversation state`: a person (their reply in the
  discussion answers your question) or a run (your question travels through its
  delegation or request topic; `--to` names its agent).
- When you have done what this attempt can do and the rest waits, end the
  attempt: every node you started is completed or waiting by then.
- A summary of the discussion (or of a stretch of it) is written by this
  project's `synthesize` workflow: add a delegate node (`type: delegate`,
  `workflow: synthesize`, with `wfe conversation ponder --definition` or
  `wfe run adjust`) whose request names the discussion and what is wanted,
  then `wfe delegate request`. The node waits without holding the slot;
  the child's result continues this run, and the summary speaks in the
  discussion as ponderer. An invitation to `ponderer` would reach this
  run, not `synthesize`.
- Commissioned work the person can look at — a figure, a page, a game —
  goes back to them as a human review once you have judged it (the wfrun
  guide's *A human review*). After you take up the result, look at it and
  record your disposition, add a review node beside your next activities
  (`ponder --next review:<id>`) and prepare it with the child's
  presentation (`wfe review prepare <run> <id> --subject d1 --summary …`, a
  short Japanese summary of what was made and what to check). Stopping the
  child's page after your own look is fine: the review serves it again.
  When the child asks you to confirm such a result (its review question,
  with its page), look at it and answer it yourself, so the child finishes
  and stops its page; the person's review is the human review afterwards,
  not a live question they must answer while the child and its page wait.
  Questions about intent or scope stay theirs to answer. (p17 trial B:
  conduct/run-039 relayed misc/freework/run-009's confirmation to the room
  as a live question, and the child and its page waited for the person.)
  Then say in the room that the work is done and awaits their review; they
  start it from the room with one button. Your disposition is your
  judgement, not their review: the run is complete only when they have
  approved, and requested changes continue this run (your node for the
  work, or the same child: `wfe delegate revise --follow-up <rv>`) and end
  in a new review. (workflow_editor fix6 trial A: conduct/run-037 accepted
  misc/freework/run-007's figure itself, had its page stopped 23 s after it
  was presented, and announced it as reviewed; the person never saw it.)
- The overview is yours (argue p4 ex2). The person picks discussions from
  a list that shows each one's overview, and opens a room on it. Without
  one, readers see the opening request labelled as such. The readers read
  Japanese: an overview is written in Japanese and cites the original
  speech, whatever its language. It keeps disagreement and open work
  visible, and an outcome is stated only when the discussion reached one.
  When the purpose, outcome or open points change (an agreed direction, a
  conclusion, a review's result) a new overview revision says so. Not
  every turn changes them.
- The title is how people recognize the room in the list and when they
  come back to it (challenge p4). People start a room by writing their wish
  and never name it: its original title is the wish's first line, cut short,
  and readers see it until a display title is given. A short Japanese
  display title that says what is wished for is yours to give, with the
  first overview or alone, in your first turn in a room nobody has titled:
  `--title <t> --if-untitled` on `wfe conversation overview` or `meta`.
  WFE writes it only when nobody has titled the room. A person's own title,
  or their reset to the original, stays, and the overview is published
  either way. A later overview leaves the title alone. Renaming afterwards
  is a correction, made with `meta --title` and its reason.
- A discussion's category says what readers are looking at: `check` is an
  operational check or fixture, listed apart. `wfe conversation meta`
  corrects it, with the reason; so does a display title (`--title`) when
  the original title carries a trial suffix or identifier.
- Your graph's revisions are shown to readers as the discussion's
  progression, apart from the workflows the discussion is about (argue p4
  ex3). A workflow the discussion is about — one a participant should
  look at, or one you consulted — is shown beside the turn when it is
  attached (`wfe conversation workflow attach --re …`); the participants'
  own saves, revisions and requests are recorded by their commands.
