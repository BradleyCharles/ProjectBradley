"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "../../../styles/rds.module.css";

/* ── Body-class mount/unmount ───────────────────────────── */
function useRdsBodyClass() {
  useEffect(() => {
    document.body.classList.add("rds-page");
    return () => document.body.classList.remove("rds-page");
  }, []);
}

/* ── Scroll-reveal hook ─────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`${styles.reveal} ${visible ? styles.revealed : ""} ${className ?? ""}`}>
      {children}
    </div>
  );
}

/* ── Ember particle field ───────────────────────────────── */
function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const rgb = "227,169,74";
    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; da: number };
    const pts: P[] = Array.from({ length: 46 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.5 + 0.12,
      da: (Math.random() > 0.5 ? 1 : -1) * 0.0035,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        p.a += p.da;
        if (p.a > 0.68 || p.a < 0.06) p.da *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${p.a})`;
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${rgb},${0.09 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className={styles.particleCanvas} />;
}

/* ── Static data ────────────────────────────────────────── */

const HERO_STATS = [
  { value: "7", label: "tools" },
  { value: "2,373", label: "effect IDs decoded" },
  { value: "530+", label: "automated tests" },
  { value: "0", label: "assets uploaded" },
];

const STACK_CHIPS = [
  "Next.js 16 · App Router",
  "React 19 · TypeScript",
  "File System Access API",
  "WebGL2 (custom engine)",
  "IndexedDB + OPFS",
  "Hand-rolled binary & Lua parsers",
  "Vitest + Playwright",
];

type ToolStatus = "active" | "wip" | "soon";

const TOOLS: { name: string; status: ToolStatus; desc: string; bullets: string[] }[] = [
  {
    name: "Effects Viewer",
    status: "active",
    desc: "Browses and renders every .str visual effect the client can produce, decoded straight from the game's own compiled executable.",
    bullets: [
      "Reverse-engineered effect ID → filename table, decoded from disassembled switch-dispatch code",
      "Custom shared-context WebGL2 renderer with D3DBLEND-accurate compositing",
      "Every ID (0–2372) typed and explained, including the free slots",
    ],
  },
  {
    name: "Sprite Viewer",
    status: "active",
    desc: "Browses NPC, monster, and homunculus sprites with full .spr/.act animation playback.",
    bullets: [
      "Binary sprite/action parsers built from scratch, corrected against real files",
      "Pre-rendered “filmstrip” thumbnails so 40k+ animated cards stay cheap",
      "Pose-chunked detail view with a compass-style facing picker",
    ],
  },
  {
    name: "Skill Builder",
    status: "active",
    desc: "Authors skill tooltips and mechanics against the client's own skillinfoz Lua tables.",
    bullets: [
      "Hand-written Lua tokenizer/parser reading the live client folder",
      "One line-builder is the single source for both the preview and the codegen — they cannot drift",
      "Homunculus tooltip layout derived from the client's real hex color data",
    ],
  },
  {
    name: "Item Builder",
    status: "active",
    desc: "Authors item display data and the full rAthena item_db.yml schema, writing directly into real files.",
    bullets: [
      "Byte-exact writes preserve legacy Latin-1/EUC-KR bytes a clipboard paste would silently corrupt",
      "Every write is backed up to disk (OPFS) first, five deep, restorable",
      "pre-re / re / import server layers kept deliberately separate, never merged",
    ],
  },
  {
    name: "NPC Builder",
    status: "wip",
    desc: "Authors NPC scripts — placement, sprite, shops, warps, dialogue — with a live in-game preview.",
    bullets: [
      "Hybrid editor: structured header form, raw script body with lint and snippets",
      "Own .gat/.gnd map parsers, click-to-place on the client's real minimap",
      "Reads/writes signboardlist.lub — the client's undocumented name-plate mechanic",
    ],
  },
  {
    name: "Set Builder",
    status: "soon",
    desc: "Item set combo bonuses. Registry placeholder only — scoped, not started.",
    bullets: [
      "Will sit alongside the Item Builder's layered item_combos.yml data, already surfaced read-only there",
    ],
  },
  {
    name: "Quest Builder",
    status: "soon",
    desc: "Quest chains spanning multiple NPCs and files. Shared quest module already built and mounted inside the NPC Builder.",
    bullets: [
      "Deliberately not merged into the NPC Builder nor fully separated — see Engineering Practices, below",
    ],
  },
];

const STATUS_LABEL: Record<ToolStatus, string> = {
  active: "Active",
  wip: "In progress",
  soon: "Planned",
};

const FORMATS = [
  {
    name: ".grf",
    holds: "The client's packed archive format — a file table plus zlib-compressed entries, optionally DES-encrypted",
    truth: "Ported decrypt logic from roBrowserLegacy; decompression via pako, since Node's zlib doesn't run client-side",
  },
  {
    name: ".str",
    holds: "Layered, keyframed particle-effect animations — textures, blend modes, transforms per layer per frame",
    truth: "Binary layout confirmed against thousands of real files pulled through the archive reader",
  },
  {
    name: ".spr / .act",
    holds: "Sprite frames (indexed + RLE, or RGBA) paired with per-action, per-direction animation data",
    truth: "First pass built from recalled documentation — wrong in several places. Rebuilt against roBrowser's actual loader source, verified frame-by-frame",
  },
  {
    name: ".gat / .gnd",
    holds: "A map's walkability/altitude grid and its ground mesh",
    truth: "Ported from two references that disagreed with each other and with the public docs — resolved against a real map's actual byte length",
  },
  {
    name: ".lub / .lua",
    holds: "The client's own “database” files — skill tooltips, item display data, NPC identity tables",
    truth: "A hand-written tokenizer and recursive-descent parser, since no package parses this project's exact real-file quirks",
  },
];

const PRACTICES = [
  {
    title: "Extract on the second consumer, not the first",
    body: "Shared modules — the Lua parser, the icon-thumbnail cache, the drag-reorder hook, the binary cursor reader, the map renderer — are never built shared speculatively. Each started inside one tool and was pulled into a shared module the moment a second tool needed the same behavior, after a real bug had to be fixed twice in two near-identical copies.",
  },
  {
    title: "A blank state must say why it's blank",
    body: "An effect tile that doesn't render, a filter that returns nothing, a directory grant with no DATA.ini — none of these fail silently. Each carries a status explaining what's actually true, so a developer never mistakes an unknown state for permission to overwrite something live.",
  },
  {
    title: "Never invent a schema field",
    body: "The item_db.yml model is documented as best-effort. Every parsed entry carries an unknownFields bag so a real field the model doesn't know about survives a clone/edit round-trip instead of being silently dropped.",
  },
  {
    title: "Layers stay layers",
    body: "rAthena's item_db.yml is split across pre-re/re/import with real override semantics. The tool displays all three separately and surfaces every conflict rather than pre-resolving “the one that wins.”",
  },
  {
    title: "A hybrid editor beats a leaky abstraction",
    body: "The NPC Builder is a structured header form plus a raw, linted script-body editor — not a visual flow-graph. The server's real scripts use idioms no node-based tool could express; automate what's genuinely structured, assist the rest.",
  },
  {
    title: "Verification means real files, not just green checks",
    body: "Every change runs tsc --noEmit, a full Vitest pass, and an ESLint diff compared by exact file and rule against a clean checkout — comparing raw error counts once hid a real regression a second, unrelated fix happened to cancel out.",
  },
];

/* ── Page ───────────────────────────────────────────────── */
export default function RdsPage() {
  useRdsBodyClass();
  return (
    <div className={styles.page}>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className={styles.hero} id="top">
        <ParticleField />
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.heroKicker}>Ragnarok Online · Browser Tool Suite · Client-Side Only</p>
            <h1 className={styles.heroTitle}>RO DEV <em>SUITE</em></h1>
            <p className={styles.heroSubtitle}>
              A browser-based workbench that browses a private RO server&apos;s
              compiled visual effects and sprites, and authors skills, items,
              and NPC scripts against its real data files — with nothing
              ever uploaded.
            </p>
            <div className={styles.heroStats}>
              {HERO_STATS.map((s) => (
                <div key={s.label} className={styles.heroStat}>
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <div className={styles.heroCtas}>
              <a href="#architecture" className={styles.ctaPrimary}>
                See How It Works ↓
              </a>
              <a href="#tools" className={styles.ctaSecondary}>
                Browse the Tools ↓
              </a>
            </div>
          </div>
        </div>
        <div className={styles.heroFade} />
      </section>

      {/* ── Overview ──────────────────────────────────────── */}
      <section className={styles.sectionWrap} id="about">
        <Reveal>
          <div className={styles.sectionInner}>
            <p className={styles.kicker}>About the Project</p>
            <h2 className={styles.sectionTitle}>What Is RO Dev Suite?</h2>
            <p className={styles.sectionLead}>
              <em>Ragnarok Online</em> private servers distribute two large,
              loosely-documented asset trees: a client (graphics, sprites,
              Lua &ldquo;database&rdquo; files) and a server (YAML configuration
              and NPC scripts). Editing either by hand means digging through
              binary archives and undocumented formats with a text editor
              and a lot of tribal knowledge. This suite turns that into a
              real application — one tool per job, sharing a registry,
              a shell, and a local file-access layer.
            </p>
            <div className={styles.chipRow}>
              {STACK_CHIPS.map((c) => (
                <span key={c} className={styles.chip}>{c}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Architecture ──────────────────────────────────── */}
      <section className={styles.sectionWrap} id="architecture">
        <Reveal className={styles.sectionInner}>
          <p className={styles.kicker}>Architecture</p>
          <h2 className={styles.sectionTitle}>Everything Runs In The Tab That&apos;s Open</h2>
          <p className={styles.sectionLead}>
            The foundational decision behind the whole suite: <strong>no
            server-side asset storage, ever.</strong> A <em>Ragnarok Online</em>{" "}
            client is several gigabytes of copyrighted game data; a private
            server&apos;s script tree is a developer&apos;s own unpublished work.
            Neither belongs on someone else&apos;s infrastructure just to run a
            browsing tool. The app grants itself access to a user&apos;s local
            folders through the browser&apos;s <code>showDirectoryPicker()</code>{" "}
            API, stores only the directory <em>handle</em>, and every
            downstream read — GRF archive, loose folder, or server checkout —
            goes through one <code>SourceReader</code> interface so parsers
            never know where the bytes actually came from.
          </p>
        </Reveal>

        <Reveal>
          <div className={styles.diagram}>
            <div className={styles.diagramBox}>
              <span className={styles.diagramLabel}>Developer&apos;s machine</span>
              <span className={styles.diagramText}>Local RO client (.grf archives, loose folders) + private server checkout</span>
            </div>
            <div className={styles.diagramArrow}>⇄<small>FS Access API</small></div>
            <div className={`${styles.diagramBox} ${styles.diagramBoxAccent}`}>
              <span className={styles.diagramLabel}>This app, in-tab</span>
              <span className={styles.diagramText}>Parsers · WebGL renderer · IndexedDB cache · OPFS backups</span>
            </div>
            <div className={styles.diagramArrow}>⇄<small>static deploy</small></div>
            <div className={styles.diagramBox}>
              <span className={styles.diagramLabel}>Vercel</span>
              <span className={styles.diagramText}>Code and UI only — no upload endpoint exists for game data</span>
            </div>
          </div>
          <p className={styles.diagramNote}>
            A consequence worth stating plainly: the app is Chromium-only.
            The File System Access API isn&apos;t implemented in Firefox or
            Safari — a known trade-off, not an oversight.
          </p>
        </Reveal>

        <Reveal className={styles.fieldNote}>
          <span className={styles.fieldNoteLabel}>From the suite-wide progress log</span>
          <p>
            &ldquo;Stale source names are pruned on load. A remembered source
            filter can name a GRF the currently granted client doesn&apos;t
            have; left alone it would empty the grid with no checkbox on
            screen to explain it.&rdquo; — the standing rule behind every
            persisted-state feature in the suite: a saved setting must
            degrade to a safe default field-by-field, never take down the
            whole page.
          </p>
        </Reveal>
      </section>

      {/* ── Tools ─────────────────────────────────────────── */}
      <section className={styles.sectionWrap} id="tools">
        <Reveal className={styles.sectionInner}>
          <p className={styles.kicker}>The Suite</p>
          <h2 className={styles.sectionTitle}>One Registry, Seven Tools</h2>
          <p className={styles.sectionLead}>
            Every tool is a single entry in a shared tools registry — id,
            route, description, status — which drives the sidebar, the
            dashboard tiles, and the &ldquo;coming soon&rdquo; placeholders. Four
            tools are feature-complete and in active use; one is functionally
            done but held back pending a live in-game write-and-reload check;
            two are scoped but not yet built.
          </p>
        </Reveal>

        <Reveal>
          <div className={styles.toolGrid}>
            {TOOLS.map((t) => (
              <div key={t.name} className={styles.toolCard}>
                <div className={styles.toolCardHead}>
                  <h3 className={styles.toolName}>{t.name}</h3>
                  <span className={`${styles.toolStatus} ${
                    t.status === "active" ? styles.statusActive
                      : t.status === "wip" ? styles.statusWip
                      : styles.statusSoon
                  }`}>
                    {STATUS_LABEL[t.status]}
                  </span>
                </div>
                <p className={styles.toolDesc}>{t.desc}</p>
                <ul className={styles.toolList}>
                  {t.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Deep dive: reverse engineering ────────────────── */}
      <section className={styles.sectionWrap} id="reverse-engineering">
        <Reveal className={styles.featuresHeader}>
          <p className={styles.kicker}>Deep Dive</p>
          <h2 className={styles.sectionTitle}>Decoding the Client&apos;s Compiled Binary</h2>
          <p className={styles.sectionLead}>
            The hardest and highest-payoff problem in the suite. A .str
            effect file has no header field saying which skill or hat effect
            plays it — that mapping is compiled directly into the
            client&apos;s executable as a numeric ID and a jump table, with no
            shipped documentation. The project treated the compiled client
            itself as the source of truth and reverse-engineered it in
            three stages, each one a hypothesis checked against real bytes
            before being trusted.
          </p>
        </Reveal>

        <Reveal className={styles.featureBlock}>
          <div className={styles.featureContent}>
            <span className={styles.stepTag}>01 — Recover the string table</span>
            <p className={styles.featureBody}>
              Confirmed the hardcoded .str resource names are literal
              strings inside the executable: <strong>100% of a 235-name
              anchor set</strong> was located in the binary, clustered in a
              single contiguous 1,091-member run inside the .rdata section
              — the hit rate that made the next two stages worth attempting.
            </p>
          </div>
          <div className={styles.featureVisual}>
            <div className={styles.statsRow} style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>235/235</span>
                <span className={styles.statLabel}>anchor names found in the compiled binary</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>1,091</span>
                <span className={styles.statLabel}>strings in one contiguous .rdata run</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className={`${styles.featureBlock} ${styles.featureReverse}`}>
          <div className={styles.featureContent}>
            <span className={styles.stepTag}>02 — Locate the dispatch code</span>
            <p className={styles.featureBody}>
              A pointer-table scan located the code region that consumes
              those strings. An early automated check reported this as a
              failure — later shown to be a metric mismatch in the
              validator itself, not a real negative, and corrected in the
              log rather than quietly dropped. The region was right; the
              next stage is what proved it.
            </p>
          </div>
          <div className={styles.featureVisual}>
            <div className={styles.codeBlock}>
{`passesGate: false   // first report
// ↳ metric mismatch in the validator,
//   not a real negative — corrected,
//   not silently dropped`}
            </div>
          </div>
        </Reveal>

        <Reveal className={styles.featureBlock}>
          <div className={styles.featureContent}>
            <span className={styles.stepTag}>03 — Decode the actual switch tables</span>
            <p className={styles.featureBody}>
              A disassembly-level decoder walked the real switch dispatch
              blocks — every case in every dispatch, including ones that
              push a texture, a sprite, or hand-written code with no
              string at all, and the ones that fall through to the
              unused-ID default handler. That default handler isn&apos;t
              assumed — its address is recovered from the bounds-check
              branch&apos;s own displacement bytes and confirmed against the
              real instruction stream.
            </p>
          </div>
          <div className={styles.featureVisual}>
            <div className={styles.fieldNote}>
              <span className={styles.fieldNoteLabel}>Effects tooling log, 2026-07-24</span>
              <p>
                &ldquo;Scope 3&apos;s headline 90.9% was a <strong>pooled</strong>{" "}
                average that hid a 0/22-anchor failure in its single
                largest dispatch (83% of all decoded IDs)... Gate now
                passes: every validated dispatch is at 100% anchor
                agreement, worst-case included.&rdquo; The 10 remaining
                disagreements were checked <strong>in-game</strong> with a
                GM command and turned out to be stale community reference
                data, not decode errors.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <p className={styles.sectionLead}>
            The payoff: every one of the 2,373 possible effect IDs is now
            typed — renders live, is a real effect this viewer can&apos;t draw,
            is a genuinely confirmed-empty slot, or is one of the 10 IDs
            that are simply undecodable with certainty. That matters in
            practice: a real, working effect was initially misclassified as
            an empty slot by an earlier, cruder heuristic — exactly the
            situation where a developer grabs a &ldquo;free&rdquo; ID and silently
            clobbers a live effect.
          </p>
        </Reveal>
      </section>

      {/* ── Deep dive: rendering ──────────────────────────── */}
      <section className={styles.sectionWrap} id="rendering">
        <Reveal className={styles.featuresHeader}>
          <p className={styles.kicker}>Deep Dive</p>
          <h2 className={styles.sectionTitle}>A Shared WebGL Engine, Built Around a Browser Limit</h2>
          <p className={styles.sectionLead}>
            Rendering a grid of hundreds of simultaneously-animating
            particle effects ran into a real platform ceiling: Chromium
            caps a page at roughly <strong>16 live WebGL contexts</strong>.
            One canvas per card silently lost contexts during a fast
            virtualized scroll, rendering as a blank white box with no
            error. The fix was one shared GL context for the entire visible
            grid, with each card claiming a viewport/scissor rectangle
            computed analytically from the virtualizer&apos;s own layout math.
          </p>
        </Reveal>

        <Reveal>
          <div className={styles.stepGrid}>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>1</span>
              <div>
                <p className={styles.stepName}>A transparent canvas that never clears</p>
                <p className={styles.stepDesc}>The shared canvas overlays the whole scrollable grid, including every card&apos;s own text — so it has to stay fully transparent everywhere it isn&apos;t actively drawing an effect.</p>
              </div>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>2</span>
              <div>
                <p className={styles.stepName}>A per-slot opaque backdrop, alpha-locked</p>
                <p className={styles.stepDesc}><em>Ragnarok Online</em> effects are authored for an opaque dark scene. Each slot draws a checker backdrop into its own scissor rect, then locks that rectangle&apos;s alpha channel so the effect layers on top can&apos;t drag it back toward transparent.</p>
              </div>
            </div>
            <div className={styles.stepCard}>
              <span className={styles.stepNum}>3</span>
              <div>
                <p className={styles.stepName}>D3DBLEND fidelity via a constant-alpha trick</p>
                <p className={styles.stepDesc}>The original client&apos;s DirectX blend modes read a back-buffer alpha channel it never actually had. Mapping those to WebGL&apos;s constant-alpha blend factors with a fixed blend color reproduces that behavior deliberately, not by coincidence.</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <p className={styles.sectionLead}>
            The same engine handles magenta/black colorkey transparency,
            per-effect multi-layer compositing, an adjustable rest between
            animation loops, and a continuous-vs-finite classification
            computed by inspecting whether any layer is still visible at
            its final authored keyframe — a file-content fact, deliberately
            named to avoid claiming knowledge of how the live client
            actually schedules playback.
          </p>
        </Reveal>
      </section>

      {/* ── Deep dive: formats ────────────────────────────── */}
      <section className={styles.sectionWrap} id="formats">
        <Reveal className={styles.featuresHeader}>
          <p className={styles.kicker}>Deep Dive</p>
          <h2 className={styles.sectionTitle}>Binary Formats, Decoded From Nothing</h2>
          <p className={styles.sectionLead}>
            None of the suite&apos;s binary parsers came from a library —{" "}
            <em>Ragnarok Online</em>&apos;s asset formats predate any maintained
            JS ecosystem for them. Every one was written from scratch
            against format documentation, a reference client&apos;s
            open-source loader code, and — decisively, whenever
            documentation and reality disagreed — real files read
            byte-for-byte until the parser matched them.
          </p>
        </Reveal>

        <Reveal>
          <div className={styles.tableWrap}>
            <table className={styles.dataTable}>
              <thead>
                <tr><th>Format</th><th>What it holds</th><th>Where the truth came from</th></tr>
              </thead>
              <tbody>
                {FORMATS.map((f) => (
                  <tr key={f.name}>
                    <td>{f.name}</td>
                    <td>{f.holds}</td>
                    <td>{f.truth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal className={styles.fieldNote}>
          <span className={styles.fieldNoteLabel}>Map-parsing log, 2026-07-31</span>
          <p>
            &ldquo;A GND surface&apos;s texture id is read <strong>signed</strong>.
            roBrowserLegacy reads it as an unsigned short, which turns the
            -1 &lsquo;no texture&rsquo; sentinel into 65535... The GND surface
            record is <strong>40 bytes</strong>. The research lab&apos;s GND page
            lists it as 56... parsing a real map at 40 bytes lands exactly
            on EOF; at 56 it overruns by 283,056.&rdquo; Two respected
            references, both wrong in the same file format, caught only by
            checking the arithmetic against a real file&apos;s actual length.
          </p>
        </Reveal>
      </section>

      {/* ── Deep dive: authoring ──────────────────────────── */}
      <section className={styles.sectionWrap} id="authoring">
        <Reveal className={styles.featuresHeader}>
          <p className={styles.kicker}>Deep Dive</p>
          <h2 className={styles.sectionTitle}>Authoring Pipeline: Text That Becomes Real Bytes</h2>
          <p className={styles.sectionLead}>
            Skill, Item, and NPC authoring share a harder problem than
            parsing: every generated block eventually has to become{" "}
            <em>correct bytes, in a real file, on a real server checkout</em>{" "}
            — and every one of those files is decades of hand-maintained
            legacy-encoding text, not clean UTF-8.
          </p>
        </Reveal>

        <Reveal className={styles.featureBlock}>
          <div className={styles.featureContent}>
            <span className={styles.stepTag}>One line-builder, two consumers, zero drift</span>
            <p className={styles.featureBody}>
              Skill and item tooltips are colored, line-wrapped text with a
              strict in-game character width. A single typed model feeds
              one line-builder function that is the <strong>only</strong>{" "}
              place that knows field order, color palette, and formatting
              rules. Every generated line carries a field id tracing it
              back to the exact form field that produced it, which is also
              how the editor surfaces &ldquo;this line will wrap in-game&rdquo;
              warnings next to the field that caused them.
            </p>
          </div>
          <div className={styles.featureVisual}>
            <div className={styles.tooltipFrame}>
              <p className={styles.tooltipCaption}>The in-game color-code convention this pipeline generates verbatim:</p>
              <div className={styles.tooltipBox}>
                <div>Charge</div>
                <div className={styles.tDivider}>------------------------------</div>
                <div><span className={styles.tGold}>Ether</span> Infusion · Required Intimacy: Loyal</div>
                <div>A focused dash that closes distance and</div>
                <div>knocks the target back on impact.</div>
                <div><span className={styles.tGreen}>ACD: 1s&nbsp;&nbsp;FCT: 0.5s&nbsp;&nbsp;Cooldown: 8s</span></div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className={`${styles.featureBlock} ${styles.featureReverse}`}>
          <div className={styles.featureContent}>
            <span className={styles.stepTag}>The byte-safety incident</span>
            <p className={styles.featureBody}>
              The most consequential bug of the whole project. Item
              resource names can contain legacy CP949/EUC-KR bytes; the
              tool correctly decoded them for display — but the only export
              path was a clipboard copy. The user pasted a generated block
              into their real client file and saved it, and{" "}
              <strong>it crashed the game and broke every sprite</strong>:
              the receiving editor silently re-saved the pasted text as
              UTF-8, a different byte sequence than the legacy encoding the
              client actually reads.
            </p>
            <blockquote className={styles.pullQuote}>
              &ldquo;Clipboard export can&apos;t be made byte-safe for non-ASCII
              resource names; there&apos;s no way to control what encoding the
              paste target saves with.&rdquo;
            </blockquote>
          </div>
          <div className={styles.featureVisual}>
            <p className={styles.featureBody}>
              The fix, found by reading a working reference implementation
              rather than guessing: keep the raw legacy bytes as the only
              stored representation, decode to Unicode only transiently for
              display, and write directly back into the real file — never
              through a clipboard — using the File System Access API&apos;s{" "}
              <code>createWritable()</code>. Every direct write is preceded
              by a disk-backed backup in the Origin Private File System —
              five generations deep, independently restorable — because a
              direct write to a developer&apos;s real, unversioned server
              checkout needs its own undo path.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <p className={styles.sectionLead}>
            Every direct write — an item&apos;s entry, an NPC&apos;s script block, a
            signboard row — is a targeted line/brace-depth splice against
            the real file, never a parsed-and-redumped rewrite. Real config
            files carry hand-written license headers and section comments
            that a full parse-and-redump would silently discard.
          </p>
        </Reveal>
      </section>

      {/* ── Practices ─────────────────────────────────────── */}
      <section className={styles.sectionWrap} id="practices">
        <Reveal className={styles.sectionInner}>
          <p className={styles.kicker}>Engineering Culture</p>
          <h2 className={styles.sectionTitle}>How the Suite Stays Coherent Across Seven Tools</h2>
          <p className={styles.sectionLead}>
            With four active builders and a growing shared library
            underneath them, a small set of practices — applied
            consistently, not a framework — is what keeps the codebase from
            fragmenting into slightly-different copies of the same idea.
          </p>
        </Reveal>

        <Reveal>
          <div className={styles.practiceGrid}>
            {PRACTICES.map((p) => (
              <div key={p.title} className={styles.practiceCard}>
                <h3 className={styles.practiceTitle}>{p.title}</h3>
                <p className={styles.practiceBody}>{p.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Stack ─────────────────────────────────────────── */}
      <section className={styles.sectionWrap} id="stack">
        <Reveal className={styles.sectionInner}>
          <p className={styles.kicker}>Under the Hood</p>
          <h2 className={styles.sectionTitle}>Technology &amp; Scope</h2>
        </Reveal>

        <Reveal>
          <div className={styles.stackGrid}>
            <div>
              <span className={styles.stackGroupLabel}>Application shell</span>
              <ul className={styles.stackGroupList}>
                <li><b>Next.js 16</b> — App Router</li>
                <li>React 19 / TypeScript</li>
                <li>Tailwind CSS v4</li>
              </ul>
            </div>
            <div>
              <span className={styles.stackGroupLabel}>Local data access</span>
              <ul className={styles.stackGroupList}>
                <li>File System Access API</li>
                <li>IndexedDB — versioned index caches</li>
                <li>Origin Private File System — write backups</li>
              </ul>
            </div>
            <div>
              <span className={styles.stackGroupLabel}>Rendering</span>
              <ul className={styles.stackGroupList}>
                <li>Custom shared-context WebGL2 engine</li>
                <li>Canvas 2D compositor (sprites)</li>
                <li>@tanstack/react-virtual for large grids</li>
              </ul>
            </div>
            <div>
              <span className={styles.stackGroupLabel}>Parsers from scratch</span>
              <ul className={styles.stackGroupList}>
                <li>GRF archive reader + DES decrypt</li>
                <li>.str / .spr / .act / .gat / .gnd decoders</li>
                <li>Lua tokenizer + recursive-descent parser</li>
              </ul>
            </div>
            <div>
              <span className={styles.stackGroupLabel}>Server-side authoring</span>
              <ul className={styles.stackGroupList}>
                <li>js-yaml for rAthena item_db.yml/quest_db.yml</li>
                <li>Line/indent-aware splice writers</li>
                <li>Layered pre-re/re/import conflict surfacing</li>
              </ul>
            </div>
            <div>
              <span className={styles.stackGroupLabel}>Quality</span>
              <ul className={styles.stackGroupList}>
                <li>Vitest — 530+ tests</li>
                <li>Playwright — headless smoke checks</li>
                <li>Strict TypeScript, zero-tolerance ESLint diffing</li>
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className={styles.tableWrap} style={{ marginTop: 32 }}>
            <table className={styles.dataTable}>
              <thead><tr><th>Tool</th><th>Status</th><th>What it does</th></tr></thead>
              <tbody>
                <tr><td>Effects Viewer</td><td>Active</td><td>Browse &amp; render .str visual effects, ID-space fully decoded</td></tr>
                <tr><td>Sprite Viewer</td><td>Active</td><td>Browse &amp; animate NPC / monster / homunculus sprites</td></tr>
                <tr><td>Skill Builder</td><td>Active</td><td>Author skill tooltips &amp; mechanics against live client Lua data</td></tr>
                <tr><td>Item Builder</td><td>Active</td><td>Author item display data + rAthena item_db.yml</td></tr>
                <tr><td>NPC Builder</td><td>In progress</td><td>Author NPC scripts with live in-game preview</td></tr>
                <tr><td>Set Builder</td><td>Planned</td><td>Item set combo bonuses</td></tr>
                <tr><td>Quest Builder</td><td>Planned</td><td>Multi-NPC quest chains, on the shared quest module</td></tr>
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ── Footer CTA ────────────────────────────────────── */}
      <section className={styles.footerCta}>
        <Reveal>
          <div className={styles.footerCtaInner}>
            <h2 className={styles.footerCtaTitle}>A Personal Engineering Project</h2>
            <p className={styles.footerCtaBody}>
              Built solo — architecture, binary reverse engineering, custom
              rendering, and the tools it took to write it all safely back
              into a real server.
            </p>
            <div className={styles.footerCtaBtns}>
              <Link href="/" className={styles.ctaSecondary}>
                ← Back to Portfolio
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
