// tools/discussions — read, validate and cite ponderer's conversation archive
// (<path>/manifest.json + transcript.jsonl, written by WFE's archive writer:
// discussions/<id>/ for conversations that began as discussions, format
// ag.argue.discussion.v1 or since challenge p2 ag.conversation.v1;
// conversations/<id>/ for every other conversation), the episode index
// and the pinned wedo-argue findings. Deterministic and read-only: it never
// changes a file. (Moved from pj-argue tools/argue in argue p4 ex1; the
// format and episode schema keep their original names.)
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HELP = `tools/discussions <command> …   (ponderer's discussion archive; read-only)

list                      archived conversations (discussions/ and conversations/): id, path,
                          state, title, horizon, members
show <id> [--since <msg>] the archived transcript as text: messages (who spoke, for which run and
                          invitation, what it answers, whom the person addressed), membership
                          and invitation events, links (handoff, cites); under a message the
                          files (name, size, id, bundle) and challenges (id, revision) it carried
validate [<id>…]          check each archive: format, every record once, transcript extent equal
                          to the manifest horizon, every re/invitation reference resolvable; every file a message
                          names is in a bundle manifest of the same archive (same id, hash, size,
                          name) and the archive manifest's files list, and every bundle manifest's
                          digest holds (file bytes are on the shared area and not read).
                          Exit 1 when a check fails
cite <id> <msg>…          print messages exactly as archived, each with its citation
                          ponderer@<commit>:<path>/transcript.jsonl#<msg> (the commit
                          that last changed the transcript in this working tree's HEAD). Older
                          citations argue@<commit>:… name commits that are in this repository's
                          history too (HISTORY.md); the message's files and
                          challenges are listed after its text
wedo                      the wedo-argue findings at the commit this checkout pins
                          (wedo/wedo-argue): index.md, then each finding's title and status line
episodes [<id>]           the episode index (episodes/index.json): each comparable discussion
                          episode with its task, conditions, discussions and analysis; with <id>
                          its entry in full and its analysis file
episodes validate         check the index: schema, ids, each analysis file present, each named
                          discussion archived here (or marked unarchived), every condition given
                          or listed as unknown. Exit 1 when a check fails

The archive is published by WFE (wfe conversation archive); what is not
published yet is in wfe conversation show.`

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
type Rec = { type: string; id: number; [k: string]: unknown }
interface Manifest { format: string; id: string; title: string; state: string; horizon: { message: number; link: number; membership: number; event: number; activity?: number; annotation?: number }; members: { participant: string; kind: string }[]; exports: unknown[]; conductor?: string | null }

// A conversation's archive path: discussions/<id> (begun as a discussion,
// before challenge p2) or conversations/<id>; it never moves.
const NAMESPACES = ['discussions', 'conversations']
const pathOf = (id: string) => `${NAMESPACES.find(n => existsSync(join(root, n, id, 'manifest.json'))) ?? 'discussions'}/${id}`
const dir = (id: string) => join(root, pathOf(id))
function load(id: string): { manifest: Manifest; records: Rec[] } {
  if (!existsSync(join(dir(id), 'manifest.json'))) throw new Error(`no archived conversation ${id} (discussions/${id}/ or conversations/${id}/manifest.json)`)
  const manifest = JSON.parse(readFileSync(join(dir(id), 'manifest.json'), 'utf8')) as Manifest
  const t = join(dir(id), 'transcript.jsonl')
  const records = existsSync(t) ? readFileSync(t, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l) as Rec) : []
  return { manifest, records }
}
const ids = () => NAMESPACES.flatMap(n => existsSync(join(root, n)) ? readdirSync(join(root, n), { withFileTypes: true }).filter(d => d.isDirectory() && existsSync(join(root, n, d.name, 'manifest.json'))).map(d => d.name) : []).sort()
const commitOf = (path: string) => { try { return execFileSync('git', ['-C', root, 'log', '-1', '--format=%H', '--', path], { encoding: 'utf8' }).trim() || null } catch { return null } }

// Message files (workflow_editor p19, docs/message-files.md): a message's
// attachments are kind "file" ({id, bundle, ordinal, name, mime, bytes, sha256, ref})
// or kind "challenge" ({id, commit, title, sha256}); the bundle manifests are
// kept at <path>/attachments/<bundle>/manifest.json (ag.message-files.v1).
interface Att { kind: string; id?: string; bundle?: string; conversation?: string; message?: number; ordinal?: number; name?: string; mime?: string; bytes?: number; sha256?: string; ref?: string; commit?: string; title?: string }
interface BundleManifest { kind?: string; conversation?: string; bundle?: string; files?: { id: string; ordinal: number; name: string; mime: string; bytes: number; sha256: string }[]; digest?: string }
const attsOf = (r: Rec) => ((r.attachments as Att[] | undefined) ?? [])
const canonical = (v: unknown): string => Array.isArray(v) ? `[${v.map(canonical).join(',')}]` : v && typeof v === 'object' ? `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${canonical((v as Record<string, unknown>)[k])}`).join(',')}}` : JSON.stringify(v)
const digestOf = (m: BundleManifest) => { const { digest: _d, ...body } = m; return `sha256:${createHash('sha256').update(canonical(body)).digest('hex')}` }
const size = (n: number) => n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KiB` : `${(n / 1048576).toFixed(1)} MiB`
// What a message carried, one line per attachment (empty when none).
const carried = (r: Rec) => attsOf(r).map(a => a.kind === 'file'
  ? `📎 file ${a.id}: ${a.name} (${a.mime}, ${size(a.bytes ?? 0)} = ${a.bytes} bytes, sha256 ${String(a.sha256).slice(0, 12)}…; bundle ${a.bundle}; bytes on the shared area: wfe conversation fetch ${a.conversation} --message ${r.id} --attachment ${a.id})`
  : a.kind === 'challenge' ? `⚑ challenge ${a.id} @ ${String(a.commit).slice(0, 12)}: ${a.title}`
  : `? attachment of kind ${a.kind}`)
const bodyLines = (r: Rec) => [...(String(r.text) === '' ? [attsOf(r).length ? '(no text)' : '(empty)'] : String(r.text).split('\n')), ...carried(r)]

function validateFiles(id: string, manifest: Manifest & { files?: { bundle: string; manifest?: string; digest?: string; messages?: number[] }[] }, records: Rec[]): string[] {
  const problems: string[] = []
  const bundles = new Map<string, BundleManifest | null>()
  const read = (b: string) => {
    if (bundles.has(b)) return bundles.get(b)!
    const f = join(dir(id), 'attachments', b, 'manifest.json')
    let m: BundleManifest | null = null
    if (!existsSync(f)) problems.push(`bundle ${b}: attachments/${b}/manifest.json is not in this archive`)
    else {
      try { m = JSON.parse(readFileSync(f, 'utf8')) as BundleManifest } catch { problems.push(`bundle ${b}: manifest.json is not JSON`) }
      if (m) {
        if (m.kind !== 'ag.message-files.v1') problems.push(`bundle ${b}: manifest kind is ${m.kind}, not ag.message-files.v1`)
        if (m.bundle !== b) problems.push(`bundle ${b}: manifest names bundle ${m.bundle}`)
        if (m.conversation !== id) problems.push(`bundle ${b}: manifest names conversation ${m.conversation}, not ${id}`)
        if (digestOf(m) !== m.digest) problems.push(`bundle ${b}: manifest digest ${m.digest} does not hold (recomputed ${digestOf(m)})`)
      }
    }
    bundles.set(b, m)
    return m
  }
  const listed = new Map((manifest.files ?? []).map(e => [e.bundle, e]))
  const named = new Map<string, Set<number>>()
  for (const r of records.filter(r => r.type === 'message')) for (const a of attsOf(r)) {
    if (a.kind === 'challenge') { if (!a.id || !a.commit || !a.sha256) problems.push(`#${r.id}: challenge attachment lacks id, commit or sha256`); continue }
    if (a.kind !== 'file') { problems.push(`#${r.id}: attachment of unknown kind ${a.kind}`); continue }
    const at = `#${r.id} file ${a.id}`
    if (!a.bundle || !a.id || !a.sha256) { problems.push(`${at}: lacks bundle, id or sha256`); continue }
    if (a.message !== r.id) problems.push(`${at}: record says message ${a.message}`)
    if (a.conversation !== id) problems.push(`${at}: record says conversation ${a.conversation}`)
    ;(named.get(a.bundle) ?? named.set(a.bundle, new Set()).get(a.bundle)!).add(r.id)
    const m = read(a.bundle)
    if (!m) continue
    const f = (m.files ?? []).find(x => x.id === a.id)
    if (!f) { problems.push(`${at}: not in bundle ${a.bundle}'s manifest`); continue }
    for (const k of ['sha256', 'bytes', 'name', 'mime', 'ordinal'] as const) if (f[k] !== a[k]) problems.push(`${at}: ${k} is ${JSON.stringify(a[k])} in the transcript, ${JSON.stringify(f[k])} in the manifest`)
    if (a.ref && !a.ref.endsWith(`/${id}/attachments/${a.bundle}/${a.id}`)) problems.push(`${at}: ref ${a.ref} does not point at this bundle and file`)
  }
  for (const [b, msgs] of named) {
    const e = listed.get(b)
    if (!e) { problems.push(`bundle ${b}: named by #${[...msgs].join(', #')} but not in the archive manifest's files list`); continue }
    const m = bundles.get(b)
    if (m && e.digest !== m.digest) problems.push(`bundle ${b}: archive manifest digest ${e.digest} differs from the bundle manifest's ${m.digest}`)
    if (e.manifest && e.manifest !== `attachments/${b}/manifest.json`) problems.push(`bundle ${b}: archive manifest names ${e.manifest}`)
    for (const n of msgs) if (!(e.messages ?? []).includes(n)) problems.push(`bundle ${b}: carried by #${n}, which the archive manifest's files list omits`)
  }
  for (const b of listed.keys()) if (!named.has(b)) {
    problems.push(`bundle ${b}: in the archive manifest's files list but no archived message names it`)
    read(b)
  }
  return problems
}

function validate(id: string): string[] {
  const problems: string[] = []
  const { manifest, records } = load(id)
  if (manifest.format !== 'ag.argue.discussion.v1' && manifest.format !== 'ag.conversation.v1') problems.push(`format is ${manifest.format}`)
  if (manifest.id !== id) problems.push(`manifest id ${manifest.id} is not its folder ${id}`)
  const seen = new Set<string>()
  for (const r of records) { const k = `${r.type}:${r.id}`; if (seen.has(k)) problems.push(`record ${k} appears twice`); seen.add(k) }
  const max = (type: string) => Math.max(0, ...records.filter(r => r.type === type).map(r => r.id))
  // activity and annotation records (argue p4) are absent from older archives: horizon 0.
  const extent = { message: max('message'), link: max('link'), membership: max('membership'), event: max('invitation'), activity: max('activity'), annotation: max('annotation') }
  for (const k of Object.keys(extent) as (keyof typeof extent)[]) if (extent[k] > (manifest.horizon[k] ?? 0)) problems.push(`transcript has ${k} ${extent[k]} beyond the horizon ${manifest.horizon[k] ?? 0}`)
  if (extent.message !== manifest.horizon.message) problems.push(`the newest archived message is #${extent.message}, the horizon says #${manifest.horizon.message}`)
  const msgs = new Set(records.filter(r => r.type === 'message').map(r => r.id))
  for (const r of records.filter(r => r.type === 'message')) for (const n of (r.re as number[] | undefined) ?? []) if (!msgs.has(n)) problems.push(`#${r.id} answers #${n}, which is not archived`)
  problems.push(...validateFiles(id, manifest as never, records))
  return problems
}

// The episode index (argue p4): comparable discussion episodes and their
// analyses. Conditions a record does not hold are listed as unknown, never
// reconstructed.
interface Episode {
  id: string; title: string; date: string; devdocs: string; analysis: string
  discussions: { id: string; archived: boolean }[]
  task: string
  conditions: Record<string, unknown>
  unknown: string[]
}
const CONDITIONS = ['conductor', 'participants', 'profiles', 'revisions', 'guidance', 'brief', 'interventions', 'reuse']
function validateEpisodes(idx: { schema: string; episodes: Episode[] }): string[] {
  const problems: string[] = []
  if (idx.schema !== 'ag.argue.episodes.v1') problems.push(`schema is ${idx.schema}, not ag.argue.episodes.v1`)
  const seen = new Set<string>()
  for (const e of idx.episodes ?? []) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(e.id ?? '')) problems.push(`episode id "${e.id}" is not [a-z0-9-]`)
    if (seen.has(e.id)) problems.push(`episode ${e.id} appears twice`); seen.add(e.id)
    if (!e.analysis || !existsSync(join(root, e.analysis))) problems.push(`${e.id}: analysis ${e.analysis} is not in this repository`)
    for (const d of e.discussions ?? []) if (d.archived && !existsSync(join(root, 'discussions', d.id, 'manifest.json'))) problems.push(`${e.id}: discussion ${d.id} is marked archived but discussions/${d.id}/manifest.json is missing`)
    for (const k of CONDITIONS) if (!(k in (e.conditions ?? {})) && !(e.unknown ?? []).some(u => u.startsWith(`${k}:`) || u === k)) problems.push(`${e.id}: condition ${k} is neither given nor listed as unknown`)
  }
  return problems
}

function show(id: string, since = 0): string {
  const { manifest, records } = load(id)
  const out = [`${id} (${manifest.state}): ${manifest.title}`, `members: ${manifest.members.map(m => `${m.participant} (${m.kind})`).join(', ')}; horizon #${manifest.horizon.message}`]
  for (const r of records) {
    if (r.type === 'message' && r.id > since) {
      const head = r.role === 'person' ? `${r.author} (person)${(r.addressed as string[]).length ? ` to ${(r.addressed as string[]).join(', ')}` : ''}` : `${r.participant} (${r.author}${r.run ? ` for ${r.run}` : ''}${r.invitation ? `, invitation ${r.invitation}` : ''})`
      out.push('', `#${r.id} ${r.at} ${head}${r.kind !== 'message' ? ` [${r.kind}]` : ''}${(r.re as number[]).length ? ` re ${(r.re as number[]).map(n => `#${n}`).join(', ')}` : ''}`, ...bodyLines(r).map(l => `    ${l}`))
    } else if (r.type === 'membership') out.push(`  · ${r.participant} ${r.action} (by ${r.by}${r.note ? `: ${r.note}` : ''})`)
    else if (r.type === 'invitation') out.push(`  · invitation ${r.invitation} ${r.state}${r.participant ? ` → ${r.participant}` : ''}${r.run ? ` ${r.run}` : ''}${r.note ? `: ${r.note}` : ''}`)
    else if (r.type === 'link') out.push(`  · #${r.message} ${r.relation} ${r.run} (by ${r.by}: ${r.note})`)
    else if (r.type === 'activity') {
      const a = r.data as { kind?: string; node?: string; text?: string; run?: string } | undefined
      out.push(r.kind === 'activity' ? `  · activity ${r.activity} ${a?.kind} ${a?.node} ${r.state}${r.note ? `: ${r.note}` : ''}${a?.kind === 'ponder' && a.text ? ` — "${String(a.text).split('\n')[0].slice(0, 140)}"` : ''}` : `  · ${r.kind} ${r.state}: ${r.note}`)
    } else if (r.type === 'annotation') out.push(`  ⟂ ${r.kind} by ${r.author} (outside the speech)${(r.re as number[]).length ? ` re ${(r.re as number[]).map(n => `#${n}`).join(', ')}` : ''}: ${String(r.text).split('\n')[0]}`)
  }
  return out.join('\n')
}

const [cmd, ...args] = process.argv.slice(2)
const opt = (k: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined }
try {
  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') { console.log(HELP); process.exit(0) }
  if (cmd === 'list') {
    for (const id of ids()) { const { manifest } = load(id); console.log(`${id.padEnd(28)} ${pathOf(id).split('/')[0]!.padEnd(13)} ${manifest.state.padEnd(6)} #${String(manifest.horizon.message).padEnd(5)} [${manifest.members.map(m => m.participant).join(', ')}] ${manifest.title}`) }
  } else if (cmd === 'show') {
    if (!args[0]) throw new Error('show <id>')
    console.log(show(args[0], Number(opt('since') ?? 0)))
  } else if (cmd === 'validate') {
    let bad = 0
    for (const id of args.length ? args : ids()) { const p = validate(id); if (p.length) bad++; console.log(p.length ? `${id}: ${p.length} problem(s)\n${p.map(x => `  - ${x}`).join('\n')}` : `${id}: ok`) }
    process.exit(bad ? 1 : 0)
  } else if (cmd === 'cite') {
    const [id, ...ms] = args
    if (!id || !ms.length) throw new Error('cite <id> <msg>…')
    const { records } = load(id)
    const commit = commitOf(`${pathOf(id)}/transcript.jsonl`)
    for (const m of ms.map(x => Number(x.replace(/^#/, '')))) {
      const r = records.find(x => x.type === 'message' && x.id === m)
      if (!r) { console.log(`#${m}: not archived (yet)`); continue }
      console.log(`ponderer@${commit ?? '(uncommitted)'}:${pathOf(id)}/transcript.jsonl#${m} — ${r.role === 'person' ? `${r.author} (person)` : `${r.participant} (${r.author}, ${r.run})`}, ${r.at}:\n${bodyLines(r).map(l => `> ${l}`).join('\n')}\n`)
    }
  } else if (cmd === 'wedo') {
    const w = join(root, 'wedo', 'wedo-argue')
    if (!existsSync(join(w, 'index.md'))) throw new Error('wedo/wedo-argue is not checked out here (git submodule update --init wedo/wedo-argue)')
    let pin = '(unknown)'
    try { pin = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD:wedo/wedo-argue'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { /* not committed yet */ }
    let at = '(unknown)'
    try { at = execFileSync('git', ['-C', w, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() } catch { /* not a checkout */ }
    console.log(`wedo-argue checked out at ${at}${pin !== at ? ` (pinned by HEAD: ${pin})` : ' (the pinned commit)'}\n`)
    console.log(readFileSync(join(w, 'index.md'), 'utf8').trim())
    const fd = join(w, 'findings')
    for (const f of existsSync(fd) ? readdirSync(fd).filter(f => f.endsWith('.md')).sort() : []) {
      const t = readFileSync(join(fd, f), 'utf8')
      console.log(`findings/${f}: ${(/^# (.*)$/m.exec(t)?.[1] ?? '(untitled)')}${/^\*\*Status\.\*\* (.*)$/m.exec(t) ? ` — ${/^\*\*Status\.\*\* (.*)$/m.exec(t)![1]}` : ''}`)
    }
  } else if (cmd === 'episodes') {
    const file = join(root, 'episodes', 'index.json')
    if (!existsSync(file)) throw new Error('no episodes/index.json')
    const idx = JSON.parse(readFileSync(file, 'utf8')) as { schema: string; episodes: Episode[] }
    if (args[0] === 'validate') {
      const p = validateEpisodes(idx)
      console.log(p.length ? `episodes: ${p.length} problem(s)\n${p.map(x => `  - ${x}`).join('\n')}` : `episodes: ok (${idx.episodes.length})`)
      process.exit(p.length ? 1 : 0)
    }
    if (args[0]) {
      const e = idx.episodes.find(x => x.id === args[0])
      if (!e) throw new Error(`no episode ${args[0]} in episodes/index.json`)
      console.log(JSON.stringify(e, null, 2))
      if (e.analysis && existsSync(join(root, e.analysis))) console.log(`\n${readFileSync(join(root, e.analysis), 'utf8').trim()}`)
    } else for (const e of idx.episodes) console.log(`${e.id.padEnd(20)} ${e.date}  ${e.discussions.map(d => d.id).join(', ').padEnd(28)} ${e.title}`)
  } else throw new Error(`no command "${cmd}" (tools/discussions --help)`)
} catch (e) { console.error(`tools/discussions: ${(e as Error).message}`); process.exit(2) }
