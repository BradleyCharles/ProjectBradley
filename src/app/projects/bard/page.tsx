"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "@/Components/Lightbox";
import styles from "../../../styles/bard.module.css";

/* ── Body-class mount/unmount ───────────────────────────── */
function useBardBodyClass() {
  useEffect(() => {
    document.body.classList.add("bard-page");
    return () => document.body.classList.remove("bard-page");
  }, []);
}

/* ── Pixel sprites ──────────────────────────────────────────
   Each sprite is a grid of palette keys; "." is transparent.
   Drawn as SVG rects so they stay crisp at any scale. */
type Palette = Record<string, string>;

function Sprite({ rows, palette, px = 4, className, label }: {
  rows: string[];
  palette: Palette;
  px?: number;
  className?: string;
  label?: string;
}) {
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg
      className={className}
      width={w * px}
      height={h * px}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {rows.flatMap((row, y) =>
        row.split("").map((c, x) =>
          c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette[c]} />
        )
      )}
    </svg>
  );
}

const TROPHY = [
  "..oooooooooo..",
  "oooyhyyyyysooo",
  "o.oyhyyyyyso.o",
  "o.oyhyyyyyso.o",
  ".ooyhyyyyysoo.",
  "..oyhyyyyyso..",
  "...ohyyyyso...",
  "....ohyyso....",
  ".....oyso.....",
  ".....oyso.....",
  "....ohyyso....",
  "...oooooooo...",
  "...obbbbbbo...",
  "..oooooooooo..",
];
const TROPHY_PAL = { o: "#2a1a08", y: "#f2c14e", h: "#fff2b0", s: "#b7791f", b: "#6b3d1f" };

const STAR = [
  ".....o.....",
  "....oyo....",
  "....oyo....",
  "ooooyhyoooo",
  ".oyyyhyyyo.",
  "..oyyyyyo..",
  "...oyyyo...",
  "..oyyoyyo..",
  ".oyo...oyo.",
  ".oo.....oo.",
];
const STAR_PAL = { o: "#2a1a08", y: "#f2c14e", h: "#fff2b0" };

const MOON = [
  "...mmmm...",
  ".mmmmmmmm.",
  "mmmcmmmmmm",
  "mmccmmmmcm",
  "mmmmmmmmmm",
  "mmmmmcmmmm",
  "mcmmmccmmm",
  "mmmmmmmmmm",
  ".mmmmmmmm.",
  "...mmmm...",
];
const MOON_PAL = { m: "#f5e6b8", c: "#d8c48a" };

/* ── Deterministic starfield (same on server and client) ── */
function useStars(count: number) {
  return useMemo(() => {
    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    return Array.from({ length: count }, () => ({
      x: Math.floor(rand() * 100),
      y: Math.floor(rand() * 70),
      big: rand() > 0.82,
      delay: Math.floor(rand() * 4),
    }));
  }, [count]);
}

/* Stepped hill silhouette, one rect per 8px column */
function Hills() {
  const cols = 160;
  const back: number[] = [];
  const front: number[] = [];
  for (let i = 0; i < cols; i++) {
    back.push(Math.round(18 + 9 * Math.sin(i / 11) + 4 * Math.sin(i / 3.7)));
    front.push(Math.round(8 + 6 * Math.sin(i / 7 + 2) + 3 * Math.cos(i / 2.3)));
  }
  return (
    <svg className={styles.hills} viewBox={`0 0 ${cols} 40`} preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden>
      {back.map((h, i) => <rect key={`b${i}`} x={i} y={40 - h} width={1} height={h} fill="#1c3a2e" />)}
      {front.map((h, i) => <rect key={`f${i}`} x={i} y={40 - h} width={1} height={h} fill="#10241c" />)}
    </svg>
  );
}

/* ── Typewriter ─────────────────────────────────────────── */
function useTypewriter(text: string, speed = 22) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(text.length); return; }
    setShown(0);
    const id = window.setInterval(() => {
      setShown((n) => {
        if (n >= text.length) { window.clearInterval(id); return n; }
        return n + 1;
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);
  const done = shown >= text.length;
  const skip = useCallback(() => setShown(text.length), [text]);
  return { visible: text.slice(0, shown), done, skip };
}

/* ── Amara's Day 1 dialogue tree ────────────────────────────
   Lifted from dialogue/amara_svor_day1.json, written by the
   pipeline. "I need a room." is the inn's hardcoded option. */
type Reply = { text: string; next: string; source: "llm" | "game" };
type DNode = { text: string; replies: Reply[] };

const AMARA: Record<string, DNode> = {
  greeting: {
    text: "Welcome to Thornwall. You look like you've seen the dust of the Ashfield today; it settles in the very bones, doesn't it? Come in, come in. You must be tired from your first foray out.",
    replies: [
      { text: "Just resting for now.", next: "settling_in", source: "llm" },
      { text: "I just need directions.", next: "directions_query", source: "llm" },
      { text: "Is there a drink to buy?", next: "bar_query", source: "llm" },
      { text: "I need a room.", next: "inn_menu", source: "game" },
    ],
  },
  settling_in: {
    text: "Take a moment, friend. The hearth is always welcome to weary travelers. You haven't had a bounty contract, I gather? The Ashfield can be deceptively quiet.",
    replies: [{ text: "Just keeping my senses sharp.", next: "show_interest", source: "llm" }],
  },
  directions_query: {
    text: "Directions? Thornwall is small enough that most people find what they need within earshot. Are you looking for the Guild, or perhaps a specific trade?",
    replies: [{ text: "The Guild, please.", next: "guild_info", source: "llm" }],
  },
  bar_query: {
    text: "We have plenty of ale, if that's what you mean. But I warn you, too much spirit makes a person forget that the edge of the Ashfield is always watching. Best to sip it slow.",
    replies: [{ text: "I'll take a small measure.", next: "show_interest", source: "llm" }],
  },
  guild_info: {
    text: "The Guild hall is just through the square, past the smithy. They are efficient folk; they keep the peace, even if their work is often tedious. Nothing exciting today, I hear.",
    replies: [{ text: "Thank you for your time.", next: "farewell", source: "llm" }],
  },
  show_interest: {
    text: "If you're seeking company, we have quiet corners perfect for stories, or perhaps just the sound of burning wood. Rest is always a kindness here, even after a calm day.",
    replies: [{ text: "I think I'll just settle in.", next: "farewell", source: "llm" }],
  },
  inn_menu: {
    text: "[ SLEEP ]  [ SHOP ]  — This menu belongs to the game, not the model. Sleeping here ends the day and starts the overnight pipeline.",
    replies: [{ text: "Back.", next: "greeting", source: "game" }],
  },
  farewell: {
    text: "Well, it was good to see a new face passing through. May the quiet paths be gentle to you.",
    replies: [],
  },
};

function DialogueDemo() {
  const [nodeId, setNodeId] = useState("greeting");
  const [cursor, setCursor] = useState(0);
  const node = AMARA[nodeId];
  const { visible, done, skip } = useTypewriter(node.text);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (next: string) => { setNodeId(next); setCursor(0); };
  const replies = node.replies.length ? node.replies : [{ text: "Talk again.", next: "greeting", source: "game" as const }];

  const onKey = (e: React.KeyboardEvent) => {
    if (!done) {
      if (e.key === "Enter" || e.key === " " || e.key === "z") { e.preventDefault(); skip(); }
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const d = e.key === "ArrowDown" ? 1 : -1;
      const n = (cursor + d + replies.length) % replies.length;
      setCursor(n);
      optionRefs.current[n]?.focus();
    }
  };

  return (
    <div className={styles.gameBox} onKeyDown={onKey} onClick={() => !done && skip()}>
      <p className={styles.gameBoxName}>Amara Svor <span>Innkeeper · Thornwall · Day 1</span></p>
      <p className={styles.gameBoxText} aria-hidden>
        {visible}
        {!done && <span className={styles.caret}>▌</span>}
      </p>
      <p className="sr-only" aria-live="polite">{node.text}</p>
      <ul className={styles.gameBoxReplies}>
        {replies.map((r, i) => (
          <li key={r.text}>
            <button
              ref={(el) => { optionRefs.current[i] = el; }}
              className={`${styles.gameReply} ${i === cursor ? styles.gameReplyActive : ""}`}
              disabled={!done}
              onMouseEnter={() => setCursor(i)}
              onFocus={() => setCursor(i)}
              onClick={(e) => { e.stopPropagation(); go(r.next); }}
            >
              <span className={styles.gameReplyText}>{r.text}</span>
              <span className={r.source === "llm" ? styles.tagLlm : styles.tagGame}>
                {r.source === "llm" ? "LLM" : "GAME"}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className={styles.gameBoxHint}>↑↓ Navigate · [Enter] Select · click to skip text</p>
    </div>
  );
}

/* ── Section window with a title tab ────────────────────── */
function Window({ title, children, className, id }: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`${styles.window} ${className ?? ""}`}>
      {title && <h2 className={styles.windowTitle}>{title}</h2>}
      {children}
    </section>
  );
}

/* ── Data ───────────────────────────────────────────────── */
const AILMENTS = [
  { name: "LAG", body: "Dialogue stalls while the model generates. Players feel every second." },
  { name: "CONFUSE", body: "The NPC invents quests, items or lore that were never in the game." },
  { name: "POISON", body: "Cloud APIs cost money per line and need a connection to work at all." },
  { name: "CURSE", body: "Output at the moment of play is unreviewed and can never be reproduced." },
];

const DAY_CYCLE = [
  {
    phase: "DAY", cls: "phaseDay",
    steps: [
      { t: "Hunt the field", d: "Kills, bounty progress and story flags are tracked as plain numbers and booleans." },
      { t: "Sleep at the inn", d: "end_day() snapshots the state and advances the calendar." },
    ],
  },
  {
    phase: "DUSK", cls: "phaseDusk",
    steps: [
      { t: "Write game_state.json", d: "Written before Python starts, so the pipeline always sees a finished day." },
      { t: "Launch the pipeline", d: "Godot starts a Python subprocess, shows a loading overlay and polls flag files every 3 s. It never blocks." },
    ],
  },
  {
    phase: "NIGHT", cls: "phaseNight",
    steps: [
      { t: "Write each NPC", d: "Build the prompt, call Gemma 4 E4B through Ollama, validate, repair or fall back, then save dialogue/{npc}_day{N}.json." },
      { t: "Remember", d: "A second small call asks the NPC for one subjective sentence about the hunter. It goes into memory." },
      { t: "Small talk", d: "A pool of two-line exchanges for the villagers wandering the square." },
    ],
  },
  {
    phase: "DAWN", cls: "phaseDawn",
    steps: [
      { t: "pipeline_ready.flag", d: "Godot sees the flag, reloads every NPC's dialogue and fades back into town." },
    ],
  },
];

const TRUST = [
  { tier: "VERIFIED", cls: "rarityGold", body: "Facts from the game. Treated as ground truth." },
  { tier: "RECOLLECTION", cls: "rarityBlue", body: "The NPC's own memory. Subjective, possibly incomplete." },
  { tier: "BACKGROUND", cls: "rarityGrey", body: "World and town lore. Possibly out of date." },
  { tier: "RUMOUR", cls: "rarityPurple", body: "Something heard in town. The NPC cannot confirm it." },
];

const CONTINUES = [
  ["Ollama isn't running", "Check the connection, then try to start it automatically"],
  ["Network error", "Three attempts with a delay"],
  ["Unparseable JSON", "Ask again"],
  ["Fails the schema", "One repair call to the model, then validate again"],
  ["Repair fails", "Reuse the most recent previous day's dialogue"],
  ["Missing variant, lore or names", "Hand-written fallback files or hardcoded defaults"],
  ["One NPC throws", "Skip that NPC and mark the run partial"],
  ["Anything unhandled", "Traceback to a crash flag; Godot shows an error overlay"],
];

const BOSSES = [
  {
    name: "THE SHOVE",
    hint: "Mobs pushed the player around the map.",
    win: "Put mobs and blocking NPCs on their own collision layer with a mask of 0 so they apply no force, removed that layer from the player's mask, and did blocking in script by cancelling any velocity pointed into a nearby mob.",
  },
  {
    name: "PHANTOM KNOCKBACK",
    hint: "Hits landed, but nothing flew backwards.",
    win: "The chase AI was overwriting velocity on the very next physics tick. A hurt-state early return in the AI loop let the impulse play out.",
  },
  {
    name: "THE GREAT FREEZE",
    hint: "One mob landed a hit and every mob on screen stopped.",
    win: "Contact logic checked the player's invincibility, which is global. Contact stopping now uses each mob's own distance.",
  },
  {
    name: "THE UNTOUCHABLE",
    hint: "Mobs chased you forever and never did damage.",
    win: "Separation code in _integrate_forces held them just outside hurt range. Removing it restored contact damage.",
  },
];

const EQUIPMENT = [
  ["ENGINE", "Godot 4.6 · GDScript"],
  ["ORACLE", "Gemma 4 E4B (Q4), swappable by env var"],
  ["SUMMONER", "Ollama, local GPU inference"],
  ["SPELLBOOK", "Python 3 + requests"],
  ["MESSENGER", "JSON + sentinel flag files"],
  ["ARTISAN", "Aseprite · AsepriteWizard"],
  ["SCRIBE", "Almendra / Almendra SC"],
  ["FORGE", "RTX 4060 class, 8 GB VRAM"],
];

const CRAFTPIX_CREDITS = [
  { name: "Slime Mobs", url: "https://craftpix.net/freebies/free-slime-mobs-pixel-art-top-down-sprite-pack/" },
  { name: "Orc Game Character", url: "https://craftpix.net/freebies/free-top-down-orc-game-character-pixel-art/" },
  { name: "Predator Plant Mobs", url: "https://craftpix.net/freebies/free-predator-plant-mobs-pixel-art-pack/" },
  { name: "Vampire Sprite Pack", url: "https://craftpix.net/freebies/free-vampire-4-direction-pixel-character-sprite-pack/" },
  { name: "Swordsman 1-3 Level Sprite Character", url: "https://craftpix.net/freebies/free-swordsman-1-3-level-pixel-top-down-sprite-character-pack/" },
  { name: "Glassblower's Workshop", url: "https://craftpix.net/freebies/free-glassblowers-workshop-top-down-pixel-art-asset/" },
  { name: "Guild Hall Asset Pack", url: "https://craftpix.net/freebies/free-top-down-pixel-art-guild-hall-asset-pack/" },
  { name: "Dungeon Objects", url: "https://craftpix.net/freebies/free-pixel-art-dungeon-objects-asset-pack/" },
  { name: "Crystals", url: "https://craftpix.net/freebies/top-down-crystals-pixel-art/" },
  { name: "Bushes", url: "https://craftpix.net/freebies/free-top-down-bushes-pixel-art/" },
  { name: "Plants for Farm", url: "https://craftpix.net/freebies/free-pixel-art-plants-for-farm/" },
  { name: "Forest Objects", url: "https://craftpix.net/freebies/free-forest-objects-top-down-pixel-art/" },
  { name: "Trees", url: "https://craftpix.net/freebies/free-top-down-trees-pixel-art/" },
  { name: "Slash Sprite Cartoon Effects", url: "https://craftpix.net/freebies/free-slash-sprite-cartoon-effects/" },
];

const MUSIC_CREDITS = [
  {
    name: "16-Bit Fantasy & Adventure Music",
    url: "https://xdeviruchi.itch.io/16-bit-fantasy-adventure-music-pack",
    by: "Marllon Silva (xDeviruchi)",
  },
];

const SFX_CREDITS = [
  {
    name: "Swords & Blades Sound Pack",
    url: "https://thesoundrack.itch.io/swords-blades-sound-pack",
    by: "Leonardo Calvo",
    note: "CC BY 4.0",
  },
  {
    name: "Free Footsteps Pack",
    url: "https://mayragandra.itch.io/free-footsteps-sound-effects",
    by: "Mayra",
  },
  {
    name: "Impact Gore Sfx",
    url: "https://nvthicprod.itch.io/impact-sfx",
    by: "Nvthic Sounds",
  },
];

const FONT_TOOL_CREDITS = [
  { name: "Xolonium", by: "Severin Meyer", note: "SIL Open Font License" },
  { name: "Almendra", by: "Ana Sanfelippo", note: "SIL Open Font License" },
  {
    name: "AsepriteWizard",
    url: "https://github.com/viniciusgerevini/godot-aseprite-wizard",
    by: "Vinicius Gerevini",
    note: "MIT License",
  },
];

const SHOTS = [
  { src: "/bard2.png", w: 1280, h: 720, cap: "Elara Vance, an innkeeper, greeting the hunter on Day 2 with dialogue written overnight." },
  { src: "/bard3.png", w: 1280, h: 720, cap: "The Bounty Board: contracts across four zones. Quantities stay hidden from the player and the model." },
  { src: "/bard4.png", w: 1280, h: 647, cap: "In the field with the axe, a plant creature mid-swing and the minimap in the corner." },
  { src: "/bard5.png", w: 1280, h: 647, cap: "Lysandra Grove: the guild hall, the inn and the bounty board." },
];
const GALLERY = ["/bard1.png", ...SHOTS.map((s) => s.src)];

/* ── Page ───────────────────────────────────────────────── */
export default function BardPage() {
  useBardBodyClass();
  const stars = useStars(70);
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      {/* ── Title screen ── */}
      <header className={styles.title}>
        <div className={styles.sky} aria-hidden>
          {stars.map((s, i) => (
            <span
              key={i}
              className={`${styles.star} ${s.big ? styles.starBig : ""}`}
              style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.delay}s` }}
            />
          ))}
          <Sprite rows={MOON} palette={MOON_PAL} px={6} className={styles.moon} />
        </div>
        <Hills />

        <div className={styles.titleInner}>
          <p className={styles.titleOver}>A Capstone by Bradley Charles</p>
          <h1 className={styles.logo}>BARD</h1>
          <p className={styles.logoSub}>Batched Asynchronous Response Delivery</p>
          <p className={styles.titleLead}>
            A Godot 4 action RPG where the NPCs remember what you did yesterday.
            Every night a local LLM rewrites their dialogue, and by morning the game
            is back to reading plain JSON.
          </p>
          <a href="#start" className={styles.pressStart}>
            <span className={styles.blink}>▶</span> PRESS START
          </a>
        </div>
      </header>

      <main className={styles.body} id="start">
        {/* ── Achievement ── */}
        <div className={styles.achievement}>
          <Sprite rows={TROPHY} palette={TROPHY_PAL} px={5} label="Trophy" />
          <div>
            <p className={styles.achievementKicker}>Achievement unlocked</p>
            <p className={styles.achievementName}>1st Place · Hands-on Demo</p>
            <p className={styles.achievementBody}>
              Capstone demo day, North Seattle College. The winner was voted for by the audience.
            </p>
          </div>
          <Sprite rows={STAR} palette={STAR_PAL} px={4} className={styles.achievementStar} />
        </div>

        {/* ── Talk to the innkeeper ── */}
        <Window title="TALK TO THE INNKEEPER" id="talk">
          <p className={styles.p}>
            Everything Amara says below was written by the pipeline the night before Day 1,
            taken as-is from <code>amara_svor_day1.json</code>. The one option tagged
            <span className={styles.tagGameInline}>GAME</span> is hardcoded. That&apos;s the rule
            that makes the whole thing safe: the model writes the conversation, the game owns
            anything that matters.
          </p>
          <div className={styles.scene}>
            <DialogueDemo />
          </div>
        </Window>

        {/* ── Quest log ── */}
        <Window title="QUEST LOG">
          <p className={styles.questTitle}>Make NPCs react to what the player actually did.</p>
          <p className={styles.p}>
            The usual approach calls a model live, mid-conversation. That inflicts the
            same four status effects every time:
          </p>
          <ul className={styles.ailments}>
            {AILMENTS.map((a) => (
              <li key={a.name} className={styles.ailment}>
                <span className={styles.ailmentName}>{a.name}</span>
                <span>{a.body}</span>
              </li>
            ))}
          </ul>
          <p className={styles.p}>
            BARD&apos;s cure is to move generation out of the real-time loop. The game writes
            down what happened. When the day ends, a batch job turns that record into a full
            dialogue tree for every NPC, checks it and saves it to disk. During play the game
            only reads files. The LLM is a content generator, never a runtime dependency, so
            the game stays fast, offline and deterministic.
          </p>
          <p className={styles.p}>
            Solo project for the BASc in Application Development at North Seattle College.
            I did the design, game code, AI pipeline, tooling, docs and the poster.
          </p>
        </Window>

        {/* ── Day / night cycle ── */}
        <Window title="ONE DAY IN TOWN" className={styles.windowWide}>
          <p className={styles.p}>
            Godot owns numbers, flags and rules. Python owns prose. They only talk through
            files: JSON in, JSON out, plus little flag files that say
            <code>connected</code>, <code>ready</code>, <code>failed</code> or <code>crashed</code>.
          </p>
          <ol className={styles.cycle}>
            {DAY_CYCLE.map((p) => (
              <li key={p.phase} className={`${styles.phase} ${styles[p.cls]}`}>
                <p className={styles.phaseName}>{p.phase}</p>
                <ol className={styles.phaseSteps}>
                  {p.steps.map((s) => (
                    <li key={s.t} className={styles.step}>
                      <p className={styles.stepTitle}>{s.t}</p>
                      <p className={styles.stepBody}>{s.d}</p>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
          <p className={styles.small}>
            A progress file drives the loading bar NPC by NPC, and a watchdog treats a pipeline
            that never connects as crashed.
          </p>
        </Window>

        {/* ── What the model sees ── */}
        <div className={styles.split}>
          <Window title="WHAT GODOT WRITES">
            <pre className={styles.code}>{`"meta": { "day": 2 },
"world_state": {
  "monsters_killed_today": {
    "slime1": 3
  }
},
"flags": {
  "met_amara_svor": true
}`}</pre>
          </Window>
          <Window title="WHAT THE MODEL READS">
            <p className={styles.fieldReport}>
              &ldquo;Light slime activity today -- only a handful encountered.&rdquo;
            </p>
            <p className={styles.p}>
              The model never sees a raw number. <code>nl_descriptors.py</code> turns counts
              into tiered phrases, each with several wordings picked at random so NPCs don&apos;t
              repeat themselves. Bounty quantities are left out entirely, so there&apos;s nothing
              to misquote.
            </p>
          </Window>
        </div>

        <Window title="ITEM RARITY: HOW MUCH TO TRUST IT">
          <p className={styles.p}>
            Every bit of context in the prompt is labelled by how sure the NPC should be of it.
            A fact&apos;s weight (core, recent, stale) is worked out from its age when the prompt
            is built, not stored and edited.
          </p>
          <ul className={styles.rarity}>
            {TRUST.map((t) => (
              <li key={t.tier} className={`${styles.rarityItem} ${styles[t.cls]}`}>
                <span className={styles.rarityTier}>{t.tier}</span>
                <span>{t.body}</span>
              </li>
            ))}
          </ul>
        </Window>

        {/* ── Memory ── */}
        <Window title="AMARA'S JOURNAL">
          <p className={styles.p}>
            After writing each NPC&apos;s dialogue, a second call asks for one sentence about the
            hunter, from that NPC&apos;s point of view. These are real entries from her memory:
          </p>
          <div className={styles.journal}>
            <p><span>Day 1</span>The hunter seemed more like a wanderer today than a warrior, moving through the Ashfield with an unnerving stillness.</p>
            <p><span>Day 2</span>The quiet that settled around the hunter today felt less like peace and more like the careful holding of a breath, waiting for a single moment to break.</p>
          </div>
          <p className={styles.p}>
            Same town, different voice. Demetrius Volkov, the guild commander, opened Day 2 with:
          </p>
          <blockquote className={styles.quote}>
            Another day logged. The records suggest a remarkable lack of incident. State your
            operational summary, and keep it concise.
          </blockquote>
          <p className={styles.p}>
            Once a week, <code>chronicle.py</code> sums up your deeds and turns them into rumours.
            Some name you, some don&apos;t. They age out over time and reach later prompts as
            things the NPC has heard but can&apos;t confirm.
          </p>
        </Window>

        {/* ── Fallback chain ── */}
        <Window title="CONTINUE?">
          <p className={styles.p}>
            A bad model run should make the game a bit duller, never break it. Every stage has
            a fallback, and each NPC&apos;s root menu (sleep, shop, bounty board, turn-in) is
            hardcoded, so even total failure leaves a working shopkeeper.
          </p>
          <ol className={styles.continues}>
            {CONTINUES.map(([fail, fix]) => (
              <li key={fail}>
                <span className={styles.contFail}>{fail}</span>
                <span className={styles.contArrow} aria-hidden>▶</span>
                <span className={styles.contFix}>{fix}</span>
              </li>
            ))}
          </ol>
          <p className={styles.small}>
            The validator checks that every node exists, greeting and farewell are present,
            every reply points somewhere real, and every path can reach an exit.
          </p>
        </Window>

        {/* ── Bestiary ── */}
        <Window title="BESTIARY">
          <p className={styles.p}>
            The enemies share one base class for health, damage and signals. Each one gets its
            own personality on top:
          </p>
          <ul className={styles.bestiary}>
            <li>
              <span className={`${styles.slimeSprite} ${styles.slime1}`} role="img" aria-label="Slime I idle animation" />
              <p className={styles.beastName}>SLIME I</p>
              <p className={styles.beastBody}>Pack hunter. Runs when alone, chases when friends are near, and spreads aggro through the group.</p>
            </li>
            <li>
              <span className={`${styles.slimeSprite} ${styles.slime2}`} role="img" aria-label="Slime II idle animation" />
              <p className={styles.beastName}>SLIME II</p>
              <p className={styles.beastBody}>Minds its own business until you hit it. Then it calls in every slime nearby.</p>
            </li>
            <li>
              <span className={`${styles.slimeSprite} ${styles.slime3}`} role="img" aria-label="Slime III idle animation" />
              <p className={styles.beastName}>SLIME III</p>
              <p className={styles.beastBody}>Doesn&apos;t need help. Comes straight at you.</p>
            </li>
          </ul>
          <p className={styles.p}>
            Orcs, plants and vampires each come in three tiers. Bosses spawn once you&apos;ve hit
            a kill threshold, with a telegraphed area attack (an expanding red circle), a cooldown
            and a boss health bar.
          </p>
        </Window>

        {/* ── Boss fights ── */}
        <Window title="BOSS FIGHTS" className={styles.windowWide}>
          <p className={styles.p}>The bugs that took the longest, and how each one went down.</p>
          <ul className={styles.bosses}>
            {BOSSES.map((b) => (
              <li key={b.name} className={styles.boss}>
                <div className={styles.bossHead}>
                  <p className={styles.bossName}>{b.name}</p>
                  <p className={styles.bossDefeated}>DEFEATED</p>
                </div>
                <div className={styles.hpBar} aria-hidden><span /></div>
                <p className={styles.bossHint}>{b.hint}</p>
                <p className={styles.bossWin}>{b.win}</p>
              </li>
            ))}
          </ul>
        </Window>

        {/* ── Equipment ── */}
        <Window title="EQUIPMENT">
          <dl className={styles.equip}>
            {EQUIPMENT.map(([slot, item]) => (
              <div key={slot} className={styles.equipRow}>
                <dt>{slot}</dt>
                <dd>{item}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.small}>
            GDScript over C# on purpose: the bottleneck is LLM inference, not the game runtime.
            Progression is gear-only with no levels or stat trees, which keeps the focus on the pipeline.
          </p>
        </Window>

        {/* ── Gallery ── */}
        <Window title="SCREENSHOTS" className={styles.windowWide}>
          <figure className={styles.poster}>
            <button className={styles.shotButton} onClick={() => setLightbox(0)} aria-label="Open the capstone poster">
              <Image src="/bard1.png" alt="BARD capstone poster" width={1280} height={720} className={styles.shot} />
            </button>
            <figcaption>The poster I designed for demo day.</figcaption>
          </figure>
          <ul className={styles.shots}>
            {SHOTS.map((s, i) => (
              <li key={s.src}>
                <figure>
                  <button className={styles.shotButton} onClick={() => setLightbox(i + 1)} aria-label={`Enlarge: ${s.cap}`}>
                    <Image src={s.src} alt={s.cap} width={s.w} height={s.h} className={styles.shot} />
                  </button>
                  <figcaption>{s.cap}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Window>

        {/* ── Asset credits ── */}
        <Window title="ASSET CREDITS" className={styles.windowWide}>
          <p className={styles.p}>
            BARD is built on original code and design, but leans on free third-party art, music and
            sound packs. Full credit to the artists below.
          </p>

          <p className={styles.creditGroup}>Art &amp; tilesets — craftpix.net</p>
          <ul className={styles.creditInline}>
            {CRAFTPIX_CREDITS.map((c) => (
              <li key={c.url}>
                <a href={c.url} target="_blank" rel="noreferrer">{c.name}</a>
              </li>
            ))}
          </ul>

          <p className={styles.creditGroup}>Music</p>
          <ul className={styles.creditList}>
            {MUSIC_CREDITS.map((c) => (
              <li key={c.name}>
                <a href={c.url} target="_blank" rel="noreferrer">{c.name}</a>
                <span className={styles.creditMeta}> — {c.by}</span>
              </li>
            ))}
          </ul>

          <p className={styles.creditGroup}>Sound effects</p>
          <ul className={styles.creditList}>
            {SFX_CREDITS.map((c) => (
              <li key={c.name}>
                <a href={c.url} target="_blank" rel="noreferrer">{c.name}</a>
                <span className={styles.creditMeta}> — {c.by}{c.note ? `, ${c.note}` : ""}</span>
              </li>
            ))}
          </ul>

          <p className={styles.creditGroup}>Fonts &amp; tools</p>
          <ul className={styles.creditList}>
            {FONT_TOOL_CREDITS.map((c) => (
              <li key={c.name}>
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noreferrer">{c.name}</a>
                ) : (
                  <span className={styles.creditName}>{c.name}</span>
                )}
                <span className={styles.creditMeta}> — {c.by}{c.note ? `, ${c.note}` : ""}</span>
              </li>
            ))}
          </ul>
        </Window>

        <div className={styles.ctaRow}>
          <a href="https://github.com/BradleyCharles/BARD" target="_blank" rel="noreferrer" className={styles.btn}>
            ▶ VIEW SOURCE
          </a>
          <Link href="/#bard" className={`${styles.btn} ${styles.btnAlt}`}>
            ◀ RETURN TO PORTFOLIO
          </Link>
        </div>

        <p className={styles.credits}>
          BARD · Academic Capstone 2026
        </p>
      </main>

      {lightbox !== null && (
        <Lightbox
          images={GALLERY}
          index={lightbox}
          projectName="BARD"
          onClose={() => setLightbox(null)}
          onNavigate={(i) => setLightbox(i)}
        />
      )}
    </div>
  );
}
