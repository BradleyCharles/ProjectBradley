# RO Dev Suite — Project Reference

A personal reference document summarizing what RO Dev Suite is, how it
works, and the technical/design decisions behind it. Written for reuse in
resumes, this site, or talking through the project with someone who
hasn't seen the code. Source material: the ro-dev-suite repo's
`docs/PROGRESS.md` and every per-tool progress doc (`docs/effects_progress.md`,
`docs/sprite-viewer_progress.md`, `docs/skills_progress.md`,
`docs/items_progress.md`, `docs/npcs_progress.md`), plus
`docs/open_items.md` and `docs/ro_dev_suite_roadmap_v4.md`, as of 2026-09-07.

A published, designed version of this material also exists as a Claude
Artifact case study, and as this site's own `/projects/rds` page and
homepage Featured Project slot.

---

## What it is

A browser-based tool suite for building content for a private *Ragnarok
Online* server — one workbench that browses the client's compiled
visual-effect and sprite assets, and authors skills, items, and NPC
scripts against the server's real data files.

*Ragnarok Online* private servers distribute two large, loosely-documented
asset trees: a **client** (graphics, sprites, Lua "database" files) and a
**server** (YAML configuration and NPC scripts). Editing either by hand
means digging through binary archives and undocumented file formats with
a text editor and a lot of tribal knowledge. This suite turns that into a
real application, without ever taking a developer's assets off their own
machine.

**By the numbers:**
- 7 tools sharing one registry, shell, and file-access layer
- 2,373 effect IDs (0–2372) fully classified by decoding the client's own machine code
- 530+ automated Vitest tests, re-run and diffed against clean HEAD on every change
- 0 game assets ever stored server-side — the app ships code and UI only

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4,
File System Access API, custom WebGL2 engine, IndexedDB + OPFS, hand-rolled
binary/Lua parsers, Vitest + Playwright.

---

## Architecture: everything runs in the tab that's open

The foundational decision behind the whole suite: **no server-side asset
storage, ever.** A *Ragnarok Online* client is several gigabytes of
copyrighted, redistribution-sensitive game data (`.grf` archives, sprites,
textures); a private server's script tree is a developer's own unpublished
work. Neither belongs on someone else's infrastructure just to run a
browsing tool.

So the app grants itself access to a user's local folders through the
browser's `showDirectoryPicker()` API, stores only the directory *handle*
(in IndexedDB, with permission re-verified each session — the browser
never grants silent indefinite access), and every downstream read — GRF
archive, loose data folder, or server checkout — goes through one
`SourceReader` interface so parsers never know or care where the bytes
actually came from.

```
Developer's machine                 This app, in-tab                  Vercel
──────────────────────    ⇄FS      ──────────────────────   ⇄static  ──────────────────────
Local RO client (.grf,    Access   Next.js UI · parsers ·   deploy   Code and UI only —
loose folders) + server   API      WebGL renderer ·                  no upload endpoint
checkout                           IndexedDB cache · OPFS            exists for game data
                                    backup store
```

A consequence stated plainly rather than hidden: the app is
**Chromium-only**. The File System Access API isn't implemented in Firefox
or Safari — a known trade-off, not an oversight.

**Everything downstream of the grant reduces to caching.** Reading a
multi-thousand-entry GRF archive or parsing a large Lua table on every
page load would make the tools unusable. Every tool follows the same
pipeline: *detect sources → read through a cascading reader → build a
typed index → cache the index in IndexedDB, versioned.* The version number
is load-bearing — bumped on every shape change, because a stale cache
deserializing into a shape the code no longer expects should rebuild once,
automatically, rather than crash or silently misbehave.

> **From the suite-wide progress log:** "Stale source names are pruned on
> load. A remembered source filter can name a GRF the currently granted
> client doesn't have; left alone it would empty the grid with no
> checkbox on screen to explain it." — the standing rule behind every
> persisted-state feature in the suite: a saved setting must degrade to a
> safe default field-by-field, never take down the whole page.

---

## The suite: one registry, seven tools

Every tool is a single entry in `lib/tools-registry.ts` — id, route,
description, status — which drives the sidebar, the dashboard tiles, and
the "coming soon" placeholders. Adding a tool is one registry entry and a
route; nothing about the shell, navigation, or the shared directory-grant
controls needs to change.

| Tool | Status | What it does |
| --- | --- | --- |
| **Effects Viewer** | Active | Browses and renders every `.str` visual effect the client can produce, decoded straight from the game's own compiled executable. |
| **Sprite Viewer** | Active | Browses NPC, monster, and homunculus sprites with full `.spr`/`.act` animation playback. |
| **Skill Builder** | Active | Authors skill tooltips and mechanics against the client's own `skillinfoz` Lua tables. |
| **Item Builder** | Active | Authors item display data and the full rAthena `item_db.yml` schema, writing directly into real files. |
| **NPC Builder** | In progress (wip) | Authors NPC scripts — placement, sprite, shops, warps, dialogue — with a live in-game preview. Held at `wip` specifically because the direct-write path hasn't yet been exercised on a live server reload. |
| **Set Builder** | Planned | Item set combo bonuses. Registry placeholder only. |
| **Quest Builder** | Planned | Multi-NPC quest chains, built on the shared quest module already mounted inside the NPC Builder. |

### Effects Viewer — highlights
- Reverse-engineered effect ID → filename table, decoded from disassembled switch-dispatch code in the client executable.
- Custom shared-context WebGL2 renderer with D3DBLEND-accurate compositing.
- Every ID (0–2372) typed and explained, including the free slots.

### Sprite Viewer — highlights
- Binary `.spr`/`.act` parsers built from scratch, corrected against real files after the first pass (built from recalled documentation) proved wrong.
- Pre-rendered "filmstrip" thumbnails so 40k+ animated cards stay cheap.
- Pose-chunked detail view with a compass-style facing picker.

### Skill Builder — highlights
- Hand-written Lua tokenizer/parser reading the live client folder.
- One line-builder is the single source for both the live preview and the codegen — they cannot drift.
- Homunculus tooltip layout derived from the client's real hex color data, not guesswork.

### Item Builder — highlights
- Byte-exact writes preserve legacy Latin-1/EUC-KR bytes that a clipboard paste would silently corrupt.
- Every write is backed up to disk (OPFS) first, five deep, restorable.
- rAthena's `pre-re` / `re` / `import` server layers kept deliberately separate, never merged.

### NPC Builder — highlights
- Hybrid editor: structured header form, raw script body with lint and snippets.
- Own `.gat`/`.gnd` map parsers; click-to-place on the client's real minimap.
- Reads/writes `signboardlist.lub` — the client's undocumented name-plate mechanic, reverse-engineered from real data rather than documentation.

---

## Deep dive: decoding the client's compiled binary

The hardest and highest-payoff problem in the suite lives in the Effects
Viewer. A `.str` effect file has no header field saying which in-game
skill or hat effect plays it — that mapping is compiled directly into the
client's executable as a numeric ID and a jump table, with no shipped
documentation. Community reference tools (roBrowserLegacy) hand-maintain
a partial list covering a fraction of the real ID space.

Rather than accept that gap, the project treated the compiled client
itself as the source of truth and reverse-engineered it in three stages,
each a hypothesis checked against real bytes before being trusted.

**01 — Recover the string table.** Confirmed the hardcoded `.str` resource
names are literal strings inside the executable: 100% of a 235-name anchor
set was located in the binary, clustered in a single contiguous
1,091-member run inside the `.rdata` section. That hit rate is what made
the next two stages worth attempting.

**02 — Locate the dispatch code.** A pointer-table scan located the code
region that consumes those strings. An early automated check reported
this as a failure (`passesGate: false`) — later shown to be a metric
mismatch in the validator itself, not a real negative, and corrected in
the log rather than quietly dropped.

**03 — Decode the actual switch tables.** A disassembly-level decoder
walked the real switch dispatch blocks — every case in every dispatch,
including ones that push a texture, a sprite, or hand-written code with
no string at all, and the ones that fall through to the unused-ID default
handler. That default handler isn't assumed — its address is recovered
from the bounds-check branch's own displacement bytes and confirmed
against the real instruction stream.

> **Effects tooling log, 2026-07-24:** "Scope 3's headline 90.9% was a
> **pooled** average that hid a 0/22-anchor failure in its single largest
> dispatch (83% of all decoded IDs)... Gate now passes: every validated
> dispatch is at 100% anchor agreement, worst-case included." The 10
> remaining disagreements were checked **in-game** with the `@effect` GM
> command and turned out to be stale community reference data, not decode
> errors — three were confirmed as three variants of one trap effect the
> decode already had right, and the community reference file was
> corrected to match (with the originals preserved alongside the fix).

**The payoff:** every one of the 2,373 possible effect IDs is now typed —
renders live, is a real effect this viewer can't draw (a texture, a
sprite, hardcoded code), is a genuinely confirmed-empty slot, or is one of
the 10 IDs that are simply undecodable with certainty. That matters in
practice: a real, working effect (`EF_ENDURE`, `EF_SOULSTRIKE`, and 534
others) was initially misclassified as an empty slot by an earlier, cruder
heuristic — exactly the situation where a developer grabs a "free" ID and
silently clobbers a live effect. The fix required a second signal (a real
`EF_` constant paired with a real description) and a hand-built exclusion
list for the literal placeholder strings that genuinely do mean "empty."

---

## Deep dive: a shared WebGL engine, built around a browser limit

Rendering a grid of hundreds of simultaneously-animating particle effects
ran straight into a real platform ceiling: Chromium caps a page at
roughly **16 live WebGL contexts**. One canvas-per-card — the obvious
first implementation — silently lost contexts past that cap during a fast
virtualized scroll, and a lost context renders as a blank white box with
no error.

The fix wasn't a workaround at the edges; it was **one shared GL context**
for the entire visible grid, with each card claiming a
`gl.viewport`/`gl.scissor` rectangle computed analytically from the
virtualizer's own layout math — never measured from the DOM, so there's no
scroll-driven reflow cost.

Getting the pixels right took three cooperating, load-bearing pieces, each
discovered by a specific visible bug and left as a standing "don't remove
this" note in the codebase:

1. **A transparent canvas that never clears.** The shared canvas overlays
   the whole scrollable grid, including every card's own filename/category
   text — so it has to stay fully transparent everywhere it isn't actively
   drawing an effect. An early attempt made the canvas opaque to fix effect
   rendering and blacked out every card's text in the process.
2. **A per-slot opaque backdrop, alpha-locked.** *Ragnarok Online* effects
   are authored for an opaque dark scene — their additive blends only make
   black vanish against something non-black behind them. Each slot draws a
   checker backdrop into just its own scissor rect and then locks that
   rectangle's alpha channel with `gl.colorMask`, so the effect layers
   drawn on top can't drag the slot back toward transparent.
3. **D3DBLEND fidelity via a constant-alpha trick.** The original client's
   DirectX blend modes `DESTALPHA`/`INVDESTALPHA` read the back buffer's
   own alpha — a channel the real client's back buffer never had. Mapping
   those to WebGL's `CONSTANT_ALPHA`/`ONE_MINUS_CONSTANT_ALPHA` with a
   fixed blend color reproduces that exact behavior deliberately, rather
   than by coincidence of the backdrop being opaque.

The same engine handles magenta/black colorkey transparency, per-effect
multi-layer compositing, an adjustable rest between animation loops (so a
fast effect's real duration is actually visible), and a
continuous-vs-finite classification computed by inspecting whether any
layer is still above 1/255 alpha at its final authored keyframe — a
file-content fact, deliberately named to avoid claiming knowledge of how
the live client actually schedules playback.

---

## Deep dive: binary formats, decoded from nothing

None of this suite's binary parsers came from a library — *Ragnarok
Online*'s asset formats predate any maintained JS ecosystem for them.
Every one was written from scratch against a mix of format documentation,
a reference client's open-source loader code, and — decisively, every
time documentation and reality disagreed — real files read byte-for-byte
until the parser matched them.

| Format | What it holds | Where the truth came from |
| --- | --- | --- |
| `.grf` | The client's packed archive format — a file table plus zlib-compressed entries, optionally DES-encrypted | Ported decrypt logic from roBrowserLegacy; decompression via `pako` since Node's `zlib` doesn't run client-side |
| `.str` | Layered, keyframed particle-effect animations — textures, blend modes, transforms per layer per frame | Binary layout confirmed against thousands of real files pulled through the archive reader |
| `.spr` / `.act` | Sprite frames (indexed + RLE, or RGBA) paired with per-action, per-direction animation data | First pass built from recalled documentation — wrong in several places. Rebuilt against roBrowser's actual loader source read directly, then verified frame-by-frame against a real client |
| `.gat` / `.gnd` | A map's walkability/altitude grid and its ground mesh | Ported from two independent reference implementations that disagreed with each other and with the public format docs — resolved by parsing a real 240×240 map and checking which byte offset actually lands on end-of-file |
| `.lub` / `.lua` | The client's own "database" files — skill tooltips, item display data, NPC identity tables — as Lua table literals | A hand-written tokenizer and recursive-descent parser, since no npm package parses arbitrary Lua table literals against this project's exact real-file quirks |

> **Map-parsing log, 2026-07-31:** "A GND surface's texture id is read
> **signed**. roBrowserLegacy reads it as `readUShort()`, which turns the
> `-1` 'no texture' sentinel into `65535`... The GND surface record is
> **40 bytes**. The research lab's GND page lists it as 56... parsing
> `alde_uclock.gnd` at 40 bytes lands exactly on EOF; at 56 it overruns by
> 283,056." Two respected references, both wrong in the same file format,
> caught only by checking the arithmetic against a real file's actual
> length.

The sprite-format saga is the most candid entry in the whole project log:
the first implementation, based on recalled general knowledge of the
format, simply didn't work against real files. Rather than patch around
it, the fix was to go get roBrowser's actual, current loader source and
re-derive the parser from it — documented explicitly as a lesson in
working from ground truth rather than memory, not quietly fixed and
forgotten.

---

## Deep dive: authoring pipeline — text that becomes real bytes

Skill, Item, and NPC authoring share a harder problem than parsing: every
generated block eventually has to become *correct bytes, in a real file,
on a real server checkout* — and every one of those files is decades of
hand-maintained legacy-encoding text, not clean UTF-8.

### One line-builder, two consumers, zero drift

Skill and item tooltips are colored, line-wrapped text with a strict
in-game character width. Rather than let the live preview and the
exported code independently format that text — the classic way two
renderers quietly disagree — a single typed model feeds one line-builder
function that is the **only** place that knows field order, color
palette, and formatting rules. Every generated line carries a `fieldId`
tracing it back to the exact form field that produced it, which is also
how the editor surfaces "this line will wrap in-game" warnings *next to
the field that caused them* instead of in the read-only preview.
Line-wrap prediction uses a per-character weighted-width table, calibrated
against real screenshots, because a flat character count measurably
disagreed with what the game client actually wraps.

### The byte-safety incident

The most consequential bug of the whole project. Item resource names can
contain legacy CP949/EUC-KR bytes; the tool correctly decoded them to real
Unicode for display and icon lookup — but the only export path was a
clipboard copy. The user pasted a generated block into their real client
file, saved it in their editor, and **it crashed the game and broke every
sprite**: the receiving editor silently re-saved the pasted text as
UTF-8, which is a different byte sequence than the legacy encoding the
client actually reads. No amount of getting the decode "more correct"
fixes that — a clipboard round-trip through an arbitrary text editor
cannot be made byte-safe.

> "Clipboard export can't be made byte-safe for non-ASCII resource names;
> there's no way to control what encoding the paste target saves with." —
> the decision that ended the clipboard-copy approach for every
> byte-sensitive file in the suite.

The real fix, found by reading a working reference implementation rather
than guessing: keep the raw legacy bytes as the only *stored*
representation, decode to Unicode only transiently for display, and write
directly back into the real file — never through a clipboard — using the
File System Access API's `createWritable()`, encoded with a hand-written
`encodeLatin1` that throws loudly rather than truncating if it ever meets
a code point outside its range. Every direct write is preceded by a
disk-backed backup in the **Origin Private File System** — five
generations deep, independently restorable — because a direct write to a
developer's real, unversioned server checkout needs its own undo path
that doesn't depend on IndexedDB, which this app already treats as
disposable.

### Splice, never regenerate

Every direct write — an item's `item_db.yml` entry, an NPC's script block,
a signboard row — is a targeted line/brace-depth splice against the real
file, never a parsed-and-redumped rewrite. rAthena YAML and NPC scripts
carry hand-written license headers, changelog comments, and section notes
that a full `js-yaml` `load()`/`dump()` round-trip would silently
discard. The writer instead locates the exact entry by its marker line and
indentation, replaces or appends just that block, and leaves every other
byte in the file untouched.

---

## Engineering culture: how the suite stays coherent across seven tools

With four active builders and a growing shared library underneath them,
the thing that keeps the codebase from fragmenting into slightly-different
copies of the same idea is a small set of practices applied consistently,
not a framework.

- **Extract on the second consumer, not the first.** Shared modules — the
  Lua parser, the icon-thumbnail cache, the drag-reorder hook, the
  colored-span editor, the binary cursor reader, the map renderer — are
  never built shared speculatively. Each started inside a single tool and
  was pulled out the moment a second tool needed the same behavior, after
  a real bug (a drag handler that hijacked text selection) had to be fixed
  twice in two near-identical copies.
- **A blank state must say why it's blank.** An effect tile that doesn't
  render, a filter that returns nothing, a directory grant with no
  `DATA.ini` — none of these fail silently. Each carries a
  presentation-level status explaining exactly what's true, so a developer
  never mistakes an unknown state for permission to overwrite something
  live.
- **Never invent a schema field.** The `item_db.yml` model is explicitly
  documented as best-effort, built from general rAthena knowledge rather
  than a read of the user's actual server repo. Every parsed entry carries
  an `unknownFields` bag so a real field the model doesn't know about
  survives a clone/edit round-trip instead of being silently dropped.
- **Layers stay layers.** rAthena's `item_db.yml` is split across
  `pre-re`/`re`/`import` with real override semantics. The tool reads and
  displays all three separately and surfaces every conflict rather than
  pre-resolving "the one that wins."
- **A hybrid editor beats a leaky abstraction.** The NPC Builder is a
  structured header form plus a raw, linted script-body editor with
  snippets — not a visual flow-graph builder. The server's real scripts
  use idioms no node-based tool could express; the honest move was to
  automate the genuinely structured part and assist, not replace, the
  rest.
- **Verification means real files, not just green checks.** Every change
  runs `tsc --noEmit`, a full Vitest pass, and an ESLint diff compared *by
  exact file and rule* against a clean checkout — comparing raw error
  counts once hid a real regression that a second, unrelated fix happened
  to cancel out in the total. Wherever possible, changes are also verified
  against the user's actual live client/server checkout, not just
  synthetic fixtures.
- **Ship status is a claim, not a milestone.** A tool moves from `wip` to
  `active` in the registry only on explicit confirmation after
  real-checkout use — not when the feature list is done. The NPC Builder
  is held at `wip` today specifically because its direct-write path hasn't
  yet been exercised on a live server reload, even though every other part
  of it is finished and tested.

---

## Technology & scope reference

**Application shell:** Next.js 16 (App Router) · React 19 / TypeScript ·
Tailwind CSS v4 · one shared `tools-registry.ts` driving nav + dashboard.

**Local data access:** File System Access API (client + server grants) ·
IndexedDB (index caches, versioned per shape) · Origin Private File
System (disk-backed write backups) · `localStorage` for favorites/drafts
(sync-readable, survives a rescan).

**Rendering:** custom shared-context WebGL2 engine (effects) · Canvas 2D
compositor (sprites) · software top-down map rasterizer (no GPU needed for
an orthographic grid) · `@tanstack/react-virtual` for every large grid.

**Parsers written from scratch:** GRF archive reader + DES decrypt (`pako`
for inflate) · `.str`/`.spr`/`.act` binary decoders · `.gat`/`.gnd` map
decoders · Lua table-literal tokenizer + recursive-descent parser ·
legacy-codepage text engine (UTF-8 → EUC-KR → Latin-1 fallback chain).

**Server-side authoring:** `js-yaml` for rAthena's `item_db.yml`/`quest_db.yml`
· line/indent-aware splice writers (never full-file regeneration) ·
layered pre-re/re/import model with conflict surfacing.

**Quality:** Vitest (530+ unit/integration tests) · Playwright (headless
smoke checks) · strict TypeScript, zero-tolerance ESLint diffing ·
real-checkout verification against a live client/server pair.

---

## Where this lives elsewhere

- **RO Dev Suite repo** (`ro-dev-suite`) — the actual source project this
  document describes; see its own `docs/PROGRESS.md` and per-tool progress
  docs for the full, unabridged history.
- **Claude Artifact case study** — a designed, single-page write-up of
  this same material (published privately; share link available on
  request).
- **This site** — `/projects/rds`, and the homepage's Featured Project slot.
