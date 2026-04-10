"use client";

import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import ArtistCanvas from "./ArtistCanvas";
import RoleTicker from "./RoleTicker";
import DisciplineGallery, { GalleryImage } from "./DisciplineGallery";
import { artistTitles } from "@/data/titles";
import styles from "../styles/ArtistPage.module.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

type Discipline = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  gradient: string;
  accent: string;
  images: GalleryImage[];
};

const disciplines: Discipline[] = [
  {
    id: "ceramics",
    name: "Ceramics",
    description:
      "Hand-thrown and sculpted forms that explore the conversation between earth and intention. Each piece begins as a lump of clay and becomes a vessel for function or feeling.",
    tags: ["Wheel Throwing", "Hand Building", "Glazing"],
    gradient:
      "radial-gradient(ellipse 70% 60% at 55% 35%, #9b6540 0%, #4e2610 50%, #1c0c05 100%)",
    accent: "#d4916a",
    images: [
      { src: "/art/ceramics-1.svg", alt: "Ceramics piece — thrown vessel" },
      { src: "/art/ceramics-2.svg", alt: "Ceramics piece — stacked bowls" },
      { src: "/art/ceramics-3.svg", alt: "Ceramics piece — slab work" },
      { src: "/art/ceramics-4.svg", alt: "Ceramics piece — tall form" },
    ],
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
    images: [
      { src: "/art/jewelry-1.svg", alt: "Jewelry piece — ring" },
      { src: "/art/jewelry-2.svg", alt: "Jewelry piece — necklace" },
      { src: "/art/jewelry-3.svg", alt: "Jewelry piece — pendant" },
      { src: "/art/jewelry-4.svg", alt: "Jewelry piece — brooch" },
    ],
  },
  {
    id: "printing",
    name: "Screenprinting",
    description:
      "Ink pressed through hand-cut stencils onto paper, fabric, and surface. Working in linoleum, copper, and mixed media to build layered prints with texture, depth, and intentional mark-making.",
    tags: ["Linoleum", "Copper", "Mixed Media"],
    gradient:
      "radial-gradient(ellipse 65% 50% at 50% 35%, #2e5f7a 0%, #122535 55%, #060e18 100%)",
    accent: "#6ab8e0",
    images: [
      { src: "/art/screen-1.svg", alt: "Screenprint — linoleum block print" },
      {
        src: "/art/screen-2.svg",
        alt: "Screenprint — mixed media composition",
      },
      { src: "/art/screen-3.svg", alt: "Screenprint — copper etching" },
      { src: "/art/screen-4.svg", alt: "Screenprint — layered print" },
    ],
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
    images: [
      { src: "/art/world-1.webp", alt: "Worldbuilding — campaign map" },
      { src: "/art/world-2.svg", alt: "Worldbuilding — arcane symbol" },
      { src: "/art/world-3.svg", alt: "Worldbuilding — d20 motif" },
      { src: "/art/world-4.svg", alt: "Worldbuilding — constellation map" },
    ],
  },
];

export default function ArtistPage() {
  return (
    <div className={`${styles.artistPage} ${playfair.className}`}>
      {/* ── Hero ── */}
      <section className={styles.hero} style={{ position: "relative" }}>
        <ArtistCanvas />
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
              className={`${styles.disciplineCard} ${
                styles[d.id as keyof typeof styles]
              }`}
            >
              <div className={styles.disciplineImage}>
                <DisciplineGallery
                  images={d.images}
                  name={d.name}
                  accent={d.accent}
                  gradient={d.gradient}
                />
              </div>
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
                      style={{
                        borderColor: `${d.accent}40`,
                        color: `${d.accent}cc`,
                      }}
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
          color, and story.
        </blockquote>
        <div className={styles.statementRule} />
      </section>

      {/* ── Contact ── */}
      <section className={styles.contact} id="contact">
        <div className={styles.contactInner}>
          <div className={styles.contactLeft}>
            <p className={styles.kicker}>Get in Touch</p>
            <h2 className={styles.contactTitle}>Let&apos;s Make Something</h2>

            <div className={styles.contactLinks}>
              <p>
                Email:{" "}
                <a href="mailto:bradgcharles@gmail.com">
                  bradgcharles@gmail.com
                </a>
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
            src="/brad_henry.webp"
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
