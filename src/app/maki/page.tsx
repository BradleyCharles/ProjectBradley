"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../styles/maki.module.css";

type Theme = "maki" | "yuki";

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

/* ── Character image with fallback ─────────────────────── */
function CharacterImage({
  src, alt, className, width, height, priority,
}: {
  src: string; alt: string; className?: string;
  width: number; height: number; priority?: boolean;
}) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className={`${styles.charFallback} ${className ?? ""}`} aria-label={alt}>
        <span>{alt.charAt(0)}</span>
      </div>
    );
  }
  return (
    <Image
      src={src} alt={alt} width={width} height={height}
      className={className} priority={priority}
      onError={() => setErr(true)} draggable={false}
    />
  );
}

/* ── Animated particle canvas ───────────────────────────── */
function ParticleField({ theme }: { theme: Theme }) {
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

    const rgb = theme === "maki" ? "196,30,58" : "76,175,80";
    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; da: number };
    const pts: P[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r: Math.random() * 1.6 + 0.5,
      a: Math.random() * 0.5 + 0.15,
      da: (Math.random() > 0.5 ? 1 : -1) * 0.004,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.x = (p.x + p.vx + canvas.width) % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        p.a += p.da;
        if (p.a > 0.72 || p.a < 0.08) p.da *= -1;
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
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${rgb},${0.1 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [theme]);
  return <canvas ref={ref} className={styles.particleCanvas} />;
}

/* ── Theme toggle ───────────────────────────────────────── */
function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  return (
    <div className={styles.toggleBar} role="group" aria-label="Character theme">
      <div className={`${styles.toggle} ${theme === "yuki" ? styles.toggleRight : ""}`}>
        <div className={styles.toggleSlider} />
        <button
          className={`${styles.toggleOpt} ${theme === "maki" ? styles.toggleOptActive : ""}`}
          onClick={() => onChange("maki")}
          aria-pressed={theme === "maki"}
        >
          <span className={styles.makiDot} />
          Maki
        </button>
        <button
          className={`${styles.toggleOpt} ${theme === "yuki" ? styles.toggleOptActive : ""}`}
          onClick={() => onChange("yuki")}
          aria-pressed={theme === "yuki"}
        >
          <span className={styles.yukiDot} />
          Yuki
        </button>
      </div>
    </div>
  );
}

/* ── Scroll-reveal wrapper ──────────────────────────────── */
function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`${styles.reveal} ${visible ? styles.revealed : ""} ${className ?? ""}`}>
      {children}
    </div>
  );
}

/* ── Static data ────────────────────────────────────────── */

const STATS = [
  { value: "2", label: "Personas" },
  { value: "Local", label: "Inference only" },
  { value: "Per-user", label: "Persistent memory" },
  { value: "Self-correcting", label: "Responses" },
];

const STACK = [
  { name: "Node.js", version: "v22" },
  { name: "discord.js", version: "v14" },
  { name: "Ollama", version: "" },
  { name: "Gemma 4 E4B", version: "" },
  { name: "JSON Storage", version: "" },
  { name: "RTX 4060", version: "" },
];

const FAMILIARITY_TIERS = [
  { name: "New", range: "0–4", desc: "Polite but closed. Minimal self-disclosure." },
  { name: "Acquaintance", range: "5–14", desc: "Slightly warmer. Occasional dry observation." },
  { name: "Comfortable", range: "15–29", desc: "Real opinions surface. Subtle humor." },
  { name: "Genuine", range: "30–49", desc: "Guards come down. References shared history." },
  { name: "Close", range: "50+", desc: "Full character depth. Openly invested." },
];

const TIME_WINDOWS = [
  { range: "Before 6am", mood: "Tired, less filtered", icon: "🌙" },
  { range: "6–9am", mood: "Alert, slightly curt", icon: "🌅" },
  { range: "9am–5pm", mood: "Default tone", icon: "☀️" },
  { range: "5–8pm", mood: "Slightly relaxed", icon: "🌆" },
  { range: "8–10pm", mood: "More conversational", icon: "🌇" },
  { range: "After 10pm", mood: "Quiet, more honest", icon: "🌃" },
];

const TIMELINE = [
  {
    phase: "01", title: "Project Kickoff", period: "",
    bullets: [
      "discord.js v14 with Mistral 7B as the initial LLM",
      "Rolling conversation history with username injection into every prompt",
      "Basic slash commands: /clear, /reset, /status",
    ],
  },
  {
    phase: "02", title: "Personality Build", period: "",
    bullets: [
      "System prompt design with detailed speech style guide",
      "System prompt injection fix — persona now active on every message",
      "Initial character lore: Tokyo background, reserved demeanor",
    ],
  },
  {
    phase: "03", title: "Model Problems", period: "",
    bullets: [
      "Mistral 7B repeated itself and looped on long contexts",
      "Hallucinated user opinions and invented facts without prompting",
      "Researched candidate models: LLaMA 3, Qwen3, Phi-3",
    ],
  },
  {
    phase: "04", title: "Model Upgrade", period: "",
    bullets: [
      "Migrated to Qwen3 8B — significant quality improvement immediately",
      "Discovered think: mode for internal chain-of-thought reasoning",
      "Fixed non-Latin script bleed affecting Japanese text output",
    ],
  },
  {
    phase: "05", title: "Memory System", period: "",
    bullets: [
      "Per-user JSON files: rolling history, extracted facts, lastSeen, score",
      "Two background LLM extraction passes per reply — user facts + self-facts",
      "Fact weight tiers: core (stable), recent (30-day TTL), stale (expired)",
    ],
  },
  {
    phase: "06", title: "Familiarity System", period: "",
    bullets: [
      "Numeric score: +1 per exchange, +2 when new personal facts found",
      "Five relationship tiers that change how the persona behaves",
      "Scores persist across sessions and are manually editable",
    ],
  },
  {
    phase: "07", title: "Loop Detection", period: "",
    bullets: [
      "detectLoop() scans recent assistant turns for >80% similarity",
      "correctLoop() fires a second LLM pass — user never sees the repeated reply",
      "Added repeat_penalty parameter tuning to Ollama config",
    ],
  },
  {
    phase: "08", title: "Character Depth", period: "",
    bullets: [
      "Full backstory: brother Naota, Seattle transplant, infrastructure career",
      "Fixed continuity bug where Maki contradicted earlier self-disclosures",
      "Addressed prose flattening — response length variance improved",
    ],
  },
  {
    phase: "09", title: "Gemma 4 E4B + Yuki", period: "",
    bullets: [
      "Edge-optimised Gemma 4 E4B with internal reasoning layer",
      "Built Yuki as a fully independent persona with separate memory directory",
      "UI model switcher + per-channel persona routing via environment variables",
    ],
  },
];

const MEMORY_JSON = `{
  "userId": "182734...",
  "familiarity": 23,
  "lastSeen": "2025-11-14T22:47:00Z",
  "history": [ /* rolling 20-turn window */ ],
  "userFacts": [
    {
      "fact": "Works as a software engineer",
      "weight": "core",
      "addedAt": "2025-10-02"
    },
    {
      "fact": "Recently moved apartments",
      "weight": "recent",
      "ttl": "2025-12-14"
    },
    {
      "fact": "Mentioned a bad day at work",
      "weight": "stale",
      "expiredAt": "2025-10-18"
    }
  ],
  "selfFacts": [
    {
      "fact": "Mentioned disliking crowded spaces",
      "weight": "core"
    }
  ]
}`;

const LOOP_CODE = `// Detect near-identical recent replies (>80% similarity)
function detectLoop(history, threshold = 0.8) {
  const recent = history
    .filter(m => m.role === "assistant")
    .slice(-4);

  for (let i = 0; i < recent.length - 1; i++) {
    const sim = similarity(
      recent[i].content,
      recent[recent.length - 1].content
    );
    if (sim > threshold) return true;
  }
  return false;
}

// Fire a correction pass — user never sees the looped reply
async function correctLoop(history, persona) {
  const result = await ollama.chat({
    ...persona.options,
    messages: [
      ...history,
      {
        role: "user",
        content: "[INTERNAL] Your last reply was too similar " +
          "to a recent one. Please vary your response."
      }
    ]
  });
  return result.message.content;
}`;

/* ── Page ───────────────────────────────────────────────── */
export default function MakiPage() {
  const [theme, setTheme] = useState<Theme>("maki");

  return (
    <div className={styles.page} data-theme={theme}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className={styles.hero} id="top">
        <ParticleField theme={theme} />
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <ThemeToggle theme={theme} onChange={setTheme} />
            <p className={styles.heroKicker}>Discord Bot · Local AI · Persistent Memory</p>
            <h1 className={styles.heroTitle}>MAKI</h1>
            <p className={styles.heroSubtitle}>
              A local AI chatbot with persistent memory,<br />
              character depth, and a Discord home.
            </p>
            <div className={styles.heroCtas}>
              <a
                href="https://github.com/BradleyCharles/Maki"
                target="_blank" rel="noreferrer"
                className={styles.ctaPrimary}
              >
                View on GitHub ↗
              </a>
              <a href="#features" className={styles.ctaSecondary}>
                Jump to Features ↓
              </a>
            </div>
          </div>
          <div className={styles.heroCharWrap}>
            <CharacterImage
              src={theme === "maki" ? "/maki.png" : "/Yuki.png"}
              alt={theme === "maki" ? "Maki" : "Yuki"}
              width={420} height={560}
              className={styles.heroChar}
              priority
            />
          </div>
        </div>
        <div className={styles.heroFade} />
      </section>

      {/* ── What Is Maki? ─────────────────────────────────────── */}
      <section className={styles.sectionWrap} id="about">
        <Reveal>
          <div className={styles.sectionInner}>
            <p className={styles.kicker}>About the Project</p>
            <h2 className={styles.sectionTitle}>What Is Maki?</h2>
            <p className={styles.sectionLead}>
              Maki started as a learning project for local LLM inference via Ollama. What began
              as curiosity about running models without cloud dependencies evolved into a
              character-driven Discord bot with persistent per-user memory, a personality that
              genuinely develops over time, and two fully independent personas.
            </p>
            <div className={styles.statsRow}>
              {STATS.map((s) => (
                <div key={s.label} className={styles.statCard}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
            <div className={styles.stackRow}>
              {STACK.map((s) => (
                <span key={s.name} className={styles.stackBadge}>
                  {s.name}{s.version && <em> {s.version}</em>}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className={styles.sectionWrap} id="features">
        <Reveal className={styles.featuresHeader}>
          <p className={styles.kicker}>Core Systems</p>
          <h2 className={styles.sectionTitle}>How It Works</h2>
        </Reveal>

        {/* Memory System */}
        <Reveal className={styles.featureBlock}>
          <div className={styles.featureContent}>
            <div className={styles.featureIcon}>🧠</div>
            <h3 className={styles.featureTitle}>Memory System</h3>
            <p className={styles.featureBody}>
              Every user gets their own JSON file. After each reply, two background LLM passes
              silently extract structured facts — one for what the user revealed, one for what
              Maki disclosed about herself. Facts carry weight tiers:{" "}
              <strong>core</strong> facts persist indefinitely,{" "}
              <strong>recent</strong> facts have a 30-day TTL, and{" "}
              <strong>stale</strong> facts expire automatically without cluttering context.
            </p>
          </div>
          <div className={styles.featureVisual}>
            <pre className={styles.codeBlock}><code>{MEMORY_JSON}</code></pre>
          </div>
        </Reveal>

        {/* Familiarity System */}
        <Reveal className={`${styles.featureBlock} ${styles.featureReverse}`}>
          <div className={styles.featureContent}>
            <div className={styles.featureIcon}>📈</div>
            <h3 className={styles.featureTitle}>Familiarity System</h3>
            <p className={styles.featureBody}>
              A numeric score tracks relationship depth per user. Each exchange adds +1;
              discovering new personal facts adds +2. The score drives how Maki behaves across
              five tiers — from guarded and minimal at zero to genuinely open at 50+. Scores
              survive restarts and can be manually adjusted per user.
            </p>
          </div>
          <div className={styles.featureVisual}>
            <div className={styles.tierGrid}>
              {FAMILIARITY_TIERS.map((t, i) => (
                <div key={t.name} className={styles.tierCard} data-tier={i}>
                  <div className={styles.tierName}>{t.name}</div>
                  <div className={styles.tierRange}>{t.range}</div>
                  <div className={styles.tierDesc}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Time Context */}
        <Reveal className={styles.featureBlock}>
          <div className={styles.featureContent}>
            <div className={styles.featureIcon}>🕰️</div>
            <h3 className={styles.featureTitle}>Time Context</h3>
            <p className={styles.featureBody}>
              Every system prompt receives the current time of day and how long it has been
              since the user last spoke. Maki&apos;s tone shifts across six mood windows —
              more guarded before 6am, more honest after 10pm. Time-since-last-seen is injected
              in natural language: &ldquo;it&apos;s been about three weeks.&rdquo;
            </p>
          </div>
          <div className={styles.featureVisual}>
            <div className={styles.timeGrid}>
              {TIME_WINDOWS.map((w) => (
                <div key={w.range} className={styles.timeCard}>
                  <span className={styles.timeIcon}>{w.icon}</span>
                  <span className={styles.timeRange}>{w.range}</span>
                  <span className={styles.timeMood}>{w.mood}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Loop Detection */}
        <Reveal className={`${styles.featureBlock} ${styles.featureReverse}`}>
          <div className={styles.featureContent}>
            <div className={styles.featureIcon}>🔄</div>
            <h3 className={styles.featureTitle}>Loop Detection & Self-Correction</h3>
            <p className={styles.featureBody}>
              <code className={styles.inlineCode}>detectLoop()</code> scans the last several
              assistant turns and flags near-identical responses (&gt;80% similarity). When a
              loop is detected, <code className={styles.inlineCode}>correctLoop()</code> fires
              a second LLM pass with explicit context. The user never sees the repeated reply —
              only the clean, corrected response is committed to history.
            </p>
          </div>
          <div className={styles.featureVisual}>
            <pre className={styles.codeBlock}><code>{LOOP_CODE}</code></pre>
          </div>
        </Reveal>

        {/* Dual Persona Architecture */}
        <Reveal className={styles.featureBlock}>
          <div className={styles.featureContent}>
            <div className={styles.featureIcon}>👥</div>
            <h3 className={styles.featureTitle}>Dual Persona Architecture</h3>
            <p className={styles.featureBody}>
              Maki and Yuki are completely independent. Separate memory directories, separate
              fact stores, separate familiarity scores. Each persona lives in{" "}
              <code className={styles.inlineCode}>personalities/</code> with its own{" "}
              <code className={styles.inlineCode}>persona.js</code> config. Per-channel routing
              via environment variables lets each Discord channel be assigned a different
              character.
            </p>
          </div>
          <div className={styles.featureVisual}>
            <div className={styles.personaCompare}>
              <div className={styles.personaCard} data-persona="maki">
                <div className={styles.personaName}>Maki</div>
                <ul className={styles.personaTraits}>
                  <li>35, Tokyo → Seattle</li>
                  <li>Infrastructure engineer</li>
                  <li>Reserved, dry humor</li>
                  <li>Warms up slowly</li>
                  <li><code>maki/memory/</code></li>
                </ul>
              </div>
              <div className={styles.personaVs}>vs</div>
              <div className={styles.personaCard} data-persona="yuki">
                <div className={styles.personaName}>Yuki</div>
                <ul className={styles.personaTraits}>
                  <li>26, Osaka → Tokyo</li>
                  <li>Graphic designer</li>
                  <li>Openly excited</li>
                  <li>Warm from message one</li>
                  <li><code>yuki/memory/</code></li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Dev Timeline ──────────────────────────────────────── */}
      <section className={styles.sectionWrap} id="timeline">
        <Reveal className={styles.featuresHeader}>
          <p className={styles.kicker}>Development History</p>
          <h2 className={styles.sectionTitle}>Dev Timeline</h2>
          <p className={styles.sectionLead}>
            Nine phases from a Mistral 7B experiment to a production-grade character bot.
          </p>
        </Reveal>
        <div className={styles.timeline}>
          {TIMELINE.map((item, i) => (
            <Reveal key={item.phase} className={styles.timelineItem}>
              <div className={styles.timelineMarker}>
                <span className={styles.timelinePhase}>{item.phase}</span>
                {i < TIMELINE.length - 1 && <div className={styles.timelineLine} />}
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineHeader}>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <span className={styles.timelinePeriod}>{item.period}</span>
                </div>
                <ul className={styles.timelineBullets}>
                  {item.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Screenshots ───────────────────────────────────────── */}
      <section className={styles.sectionWrap} id="screenshots">
        <Reveal className={styles.featuresHeader}>
          <p className={styles.kicker}>Conversation Samples</p>
          <h2 className={styles.sectionTitle}>Screenshots</h2>
          <p className={styles.sectionLead}>Real conversation samples coming soon.</p>
        </Reveal>
        {/* TODO: Replace placeholder cards with real screenshot images */}
        <Reveal>
          <div className={styles.screenshotGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.screenshotCard}>
                <div className={styles.discordBar}>
                  <div className={styles.discordAvatar} />
                  <div className={styles.discordMeta}>
                    <span className={styles.discordUser}>
                      {i % 2 === 0 ? "Maki" : "Yuki"}
                    </span>
                    <span className={styles.discordTime}>Today at 11:42 PM</span>
                  </div>
                </div>
                <div className={styles.discordMsg}>
                  <div className={styles.discordLine} style={{ width: "82%" }} />
                  <div className={styles.discordLine} style={{ width: "64%" }} />
                  <div className={styles.discordLine} style={{ width: "73%" }} />
                </div>
                <span className={styles.screenshotLabel}>Screenshot coming soon</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────── */}
      <section className={styles.footerCta}>
        <Reveal>
          <div className={styles.footerCtaInner}>
            <h2 className={styles.footerCtaTitle}>Explore the Source</h2>
            <p className={styles.footerCtaBody}>
              Built with Node.js, discord.js v14, and Ollama on an RTX 4060.
            </p>
            <div className={styles.footerCtaBtns}>
              <a
                href="https://github.com/BradleyCharles/Maki"
                target="_blank" rel="noreferrer"
                className={styles.ctaPrimary}
              >
                GitHub Repository ↗
              </a>
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
