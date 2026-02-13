"use client";

import Link from "next/link";
import styles from "./art.module.css";

const featuredPieces = [
  { title: "Glazed Orbit", medium: "Ceramics", year: "2025", status: "In-progress" },
  { title: "Resin Bloom", medium: "Mixed Media", year: "2024", status: "Completed" },
  { title: "Neon Lattice", medium: "Digital Illustration", year: "2024", status: "Completed" },
];

const pipelines = [
  { name: "Concept → Sketch → Color Keys → Final", focus: "Digital illustration" },
  { name: "Model → Print → Finish", focus: "3D printing / props" },
  { name: "Throw → Trim → Bisque → Glaze", focus: "Ceramics workflow" },
];

const tools = [
  "Procreate / Figma",
  "Blender / Fusion 360",
  "Ender 3 S1 Pro + Cura",
  "Mars 4 DLP Resin Printer",
  "Underglaze & Cone 6 Glazes",
  "UV Resin + Pigments",
  "iPad Pencil Workflow",
];

const series = [
  { title: "Iridescent Fauna", theme: "Neon creatures with ceramic finishes", mood: "Glows, gradients, organic curves" },
  { title: "City Glyphs", theme: "Vector murals inspired by transit diagrams", mood: "Bold lines, limited palettes" },
  { title: "Analog Bloom", theme: "Floral forms translated into 3D printed lattices", mood: "Airy, structural, kinetic" },
];

const palette = ["#22d3ee", "#a855f7", "#f472b6", "#0b0b15", "#dbeafe", "#9fb0ff"];

export default function ArtPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Art & Craft</p>
        <h1 className={styles.title}>Tactile worlds, vivid light, playful systems.</h1>
        <p className={styles.lede}>
          A rotating mix of ceramics, digital illustration, props, and experimental prints.
          Drop in to see what’s on the wheel, on the printer bed, or on the canvas this week.
        </p>
        <div className={styles.ctaRow}>
          <Link className={styles.ctaPrimary} href="/contact">Commission / Collaborate</Link>
          <Link className={styles.ctaGhost} href="/projects#art">Back to Projects</Link>
        </div>
      </section>

      <section className={styles.series}>
        <div className={styles.sectionHeader}>
          <h2>Series in Motion</h2>
          <p>Ongoing threads I’m exploring.</p>
        </div>
        <div className={styles.seriesGrid}>
          {series.map((item) => (
            <article key={item.title} className={styles.seriesCard}>
              <div className={styles.cardBadge}>Series</div>
              <h3>{item.title}</h3>
              <p className={styles.meta}>{item.theme}</p>
              <p className={styles.seriesMood}>{item.mood}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2>Featured Pieces</h2>
          <p>Recent works and works-in-progress.</p>
        </div>
        <div className={styles.cards}>
          {featuredPieces.map((piece) => (
            <article key={piece.title} className={styles.card}>
              <div className={styles.cardBadge}>{piece.medium}</div>
              <h3>{piece.title}</h3>
              <p className={styles.meta}>{piece.year} · {piece.status}</p>
              <p className={styles.placeholder}>Image coming soon.</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.pipeline}>
        <div className={styles.sectionHeader}>
          <h2>Processes</h2>
          <p>How I move from idea to finished piece.</p>
        </div>
        <ul className={styles.pipelineList}>
          {pipelines.map((step) => (
            <li key={step.name}>
              <span className={styles.dot} />
              <div>
                <p className={styles.pipelineTitle}>{step.name}</p>
                <p className={styles.pipelineFocus}>{step.focus}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.tools}>
        <div className={styles.sectionHeader}>
          <h2>Tools & Materials</h2>
          <p>What’s on the desk, bench, and wheel.</p>
        </div>
        <div className={styles.toolGrid}>
          {tools.map((tool) => (
            <div key={tool} className={styles.toolPill}>{tool}</div>
          ))}
        </div>
      </section>

      <section className={styles.palette}>
        <div className={styles.sectionHeader}>
          <h2>Current Palette</h2>
          <p>Colors I keep reaching for.</p>
        </div>
        <div className={styles.swatchRow}>
          {palette.map((color) => (
            <div key={color} className={styles.swatch} style={{ backgroundColor: color }}>
              <span>{color}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.gallery}>
        <div className={styles.sectionHeader}>
          <h2>Gallery Drop Zone</h2>
          <p>Add images later; layout is ready.</p>
        </div>
        <div className={styles.galleryGrid}>
          {[1, 2, 3, 4, 5, 6].map((slot) => (
            <div key={slot} className={styles.galleryCell}>
              <span>Placeholder #{slot}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
