"use client";

import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import RoleTicker from "./RoleTicker";
import { artistTitles } from "@/data/titles";
import styles from "../styles/ArtistPage.module.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const disciplines = [
  {
    id: "ceramics",
    name: "Ceramics",
    description:
      "Hand-thrown and sculpted forms that explore the conversation between earth and intention. Each piece begins as a lump of clay and becomes a vessel for function or feeling.",
    tags: ["Wheel Throwing", "Hand Building", "Glazing"],
    gradient:
      "radial-gradient(ellipse 70% 60% at 55% 35%, #9b6540 0%, #4e2610 50%, #1c0c05 100%)",
    accent: "#d4916a",
  },
  {
    id: "jewelry",
    name: "Jewelry",
    description:
      "Wearable sculpture that bridges craft and personal expression. Working in metal and mixed materials to create pieces that carry meaning beyond decoration.",
    tags: ["Metalwork", "Mixed Media", "Wearable Art"],
    gradient:
      "radial-gradient(ellipse 60% 55% at 40% 55%, #c9a84c 0%, #7a5818 50%, #1c1205 100%)",
    accent: "#e0bc5a",
  },
  {
    id: "printing",
    name: "3D Printing & Props",
    description:
      "Where digital design becomes physical reality. Concept, model, print, finish — creating props, miniatures, and functional objects for tabletop and beyond.",
    tags: ["FDM Printing", "Prop Design", "Miniatures"],
    gradient:
      "radial-gradient(ellipse 65% 50% at 50% 35%, #2e5f7a 0%, #122535 55%, #060e18 100%)",
    accent: "#6ab8e0",
  },
  {
    id: "worldbuilding",
    name: "Worldbuilding & Narrative",
    description:
      "As a Dungeon Master and narrative designer, I build living worlds with history, culture, and consequence. Every campaign is a collaborative story where choices matter and legend grows.",
    tags: ["D&D", "Narrative Design", "Homebrew Systems"],
    gradient:
      "radial-gradient(ellipse 60% 55% at 35% 45%, #503575 0%, #221040 55%, #0a0516 100%)",
    accent: "#b07fec",
  },
];

export default function ArtistPage() {
  return (
    <div className={`${styles.artistPage} ${playfair.className}`}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <p className={styles.heroKicker}>Portfolio of Making</p>
        <h1 className={styles.heroName}>Bradley Charles</h1>
        <RoleTicker titles={artistTitles} className={styles.heroTagline} />
        <div className={styles.heroRule} />
        <p className={styles.heroStatement}>
          I create with my hands and with my imagination — shaping clay, casting
          metal, printing forms, and building worlds. Art is the practice of
          making the invisible visible.
        </p>
      </section>

      {/* ── Disciplines ── */}
      <section className={styles.disciplines}>
        <div className={styles.disciplinesHeader}>
          <p className={styles.kicker}>Disciplines</p>
          <h2 className={styles.disciplinesTitle}>The Work</h2>
        </div>

        <div className={styles.disciplineGrid}>
          {disciplines.map((d) => (
            <article
              key={d.id}
              className={`${styles.disciplineCard} ${styles[d.id as keyof typeof styles]}`}
            >
              <div
                className={styles.disciplineImage}
                style={{ background: d.gradient }}
                aria-hidden="true"
              />
              <div className={styles.disciplineBody}>
                <h3
                  className={styles.disciplineName}
                  style={{ color: d.accent }}
                >
                  {d.name}
                </h3>
                <p className={styles.disciplineDesc}>{d.description}</p>
                <div className={styles.tagRow}>
                  {d.tags.map((tag) => (
                    <span
                      key={tag}
                      className={styles.tag}
                      style={{ borderColor: `${d.accent}40`, color: `${d.accent}cc` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Statement ── */}
      <section className={styles.statement}>
        <div className={styles.statementRule} />
        <blockquote className={styles.quote}>
          Every medium is a language. I&apos;m learning to speak in clay, metal,
          light, and story.
        </blockquote>
        <div className={styles.statementRule} />
      </section>

      {/* ── Contact ── */}
      <section className={styles.contact} id="contact">
        <div className={styles.contactInner}>
          <div className={styles.contactLeft}>
            <p className={styles.kicker}>Get in Touch</p>
            <h2 className={styles.contactTitle}>Let&apos;s Make Something</h2>
            <p className={styles.contactLead}>
              Whether you&apos;re interested in commissioning a piece,
              collaborating on a project, or sitting down at the table — reach
              out.
            </p>
            <div className={styles.contactLinks}>
              <p>
                Email:{" "}
                <a href="mailto:bradgcharles@gmail.com">bradgcharles@gmail.com</a>
              </p>
              <p>
                GitHub:{" "}
                <a
                  href="https://github.com/bradgcharles"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/bradgcharles
                </a>
              </p>
              <p>
                LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/bradgcharles/"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/bradgcharles
                </a>
              </p>
            </div>
          </div>
          <Image
            src="/brad_henry.png"
            alt="Bradley Charles"
            width={220}
            height={220}
            className={styles.contactAvatar}
          />
        </div>
      </section>

    </div>
  );
}
