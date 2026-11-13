# ponderer

ponderer is a project for installations of agdev (an agent-development system; WFE is its workflow
engine). It **conducts discussions** between a person, the Front agent
and project agents that have different missions and contexts, keeps their records, and learns from
how they went. Released under CC0-1.0.

You need your own agdev installation to use it; this repository is not useful on its own. Everything
below is written for someone who summons ponderer into such an installation and knows nothing about
the installation it was developed in.

## What it does

- `conduct` (a workflow): one run conducts one discussion for as long as it lasts. Its graph starts
  with one decision and grows with the discussion's activities (`announce`, `ask`, `ponder`, `talk`):
  what is known, what is missing, which participant is asked next and why, what is still owed.
- `converse` (a workflow): serves one message of a person who consults ponderer directly, answering
  from its records without leading anything.
- `synthesize`: turns one archived discussion into a source-linked `summary.md`.
- `evaluate`: evaluates how discussions went, from their archives and run records, into `episodes/`,
  and, when the evidence calls for it, revises wedo-argue.
- `freework`: a general-purpose run (talk, agree the graph, do the work).
- `tools/discussions` (needs Node.js): reads, validates and cites the archive, the episode index and
  the pinned wedo-argue findings (`tools/discussions --help`). It also works on an empty
  checkout; `list` shows nothing until archives exist.
- `agent/`: the agent guides these workflows name (`guide.md` for every workflow, one per workflow).

## Roles it fills

When summoned from a summonplan (`wfe summon apply`; agdev's `workflow_editor/docs/summon.md`), these
roles can be wired to ponderer:

| Role | What ponderer provides |
| --- | --- |
| `facilitation` → workflow `conduct` | conducts facilitated conversations |
| `conversation-archive` | WFE writes archived conversations into the checkout's `conversations/` and `discussions/` (created on first archive) |

Because the repository has `devdocs/workflows/converse.yaml`, apply also lets ponderer take part in
conversations.

## Summoning it

A summonplan entry (`ag.summonplan.v1`):

```yaml
- project: ponderer
  source: https://github.com/iwaag/pj-ponderer.git
  commit: <an exact commit of main>
  roles: {facilitation: conduct, conversation-archive: true}
```

Apply fetches the repository at that commit, pushes its history unchanged into your installation's
Gitea, acquires the two submodules beside it at the pinned commits (their URLs are `../<name>.git`,
the only form apply accepts), registers the project, obtains a workspace and wires the roles. The
project's `project.yaml` has `id: ponderer`, which must equal the entry's `project`. Name a commit of `main`
you have read; the plan pins an exact commit, never a branch.

Two things the workflows assume of your installation, because the source does not state them as
settings: the agent named in the workflows (`ponderer-agent`, profile `sonnet`) and the `lane:
conversation` execution lane. Neither workflow pins a node; where the runs execute is your
installation's choice.

## The two submodules

- [`wedo/wedo-argue`](https://github.com/iwaag/wedo-argue): reusable findings about conducting and
  evaluating discussions (three so far). ponderer's agent reads them at the pinned commit; adopting a
  newer revision is moving the pin.
- [`study/study-argue`](https://github.com/iwaag/study-argue): literature research on the same
  subject (one topic so far), commissioned from an `archsage` project's `study` workflow, which your
  installation may not have.

Both are small, rest on one development installation's trials and cite sources by reference; see their
READMEs for what is checked and what cannot be followed from outside.

## What it does not cover

- It does not hold this project's own discussions, run records or evaluations: the public repository
  has none (`episodes/index.json` is empty). The guides and findings cite them (run ids, `argue p3`,
  `p4`, `ponderer@<commit>:episodes/…`); those references cannot be opened here and describe where
  the development installation learned a rule, not something you can rerun.
- It does not choose the participants of a discussion (Front's job) or decide what a discussion
  found about its subject (the owning project's).
- It is not a general-purpose multi-agent debate framework: it assumes agdev's `wfe conversation`
  commands, `wfe projects` and delegation. The guides refer to other agdev projects (`front`,
  `archsage`, `aghangout`) as they exist in the development installation; if yours lacks them, say so
  to your agents and adapt the guides.
- Some guide text is Japanese on purpose (an overview and display titles are written in Japanese for the
  readers it was made for); change that in `agent/conduct.md` if your readers differ.
- Nothing here has been run outside the installation it came from. Whether the guides produce good
  discussions elsewhere is untested.

## Layout

| Path | Holds |
| --- | --- |
| `project.yaml` | the project definition (`id: ponderer`), its intent, goals and the folders workflows bind |
| `devdocs/workflows/` | `conduct`, `converse`, `synthesize`, `evaluate`, `freework` |
| `agent/` | ponderer-agent's guides |
| `tools/` | `discussions` (a one-line launcher) and `discussions.ts` |
| `episodes/` | the (empty) comparison index and the form of an evaluation |
| `wedo/wedo-argue`, `study/study-argue` | the knowledge submodules |

## Citing

- Original speech: `ponderer@<commit>:discussions/<id>/transcript.jsonl#<msg>` (or
  `conversations/<id>/…`).
- A summary: `ponderer@<commit>:discussions/<id>/summary.md`.
- A finding: `wedo-argue@<commit>:findings/<name>.md`.
