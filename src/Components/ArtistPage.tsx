"use client";

import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import ObfuscatedEmail from "./ObfuscatedEmail";
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
  previewLayout?: "2x2" | "4x2";
  pdfLink?: { href: string; label: string };
};

const disciplines: Discipline[] = [
  {
    id: "printing",
    name: "Screenprinting",
    description:
      "Ink pressed through hand-cut stencils onto paper, fabric, and other surfaces. Working in linoleum, copper, and mixed media to build layered prints with texture, depth, and intentional mark-making. To me, the carving of the block is a way to physically interact with my art and the imperfections of the process are part of the beauty.",
    tags: ["Linoleum", "Copper", "Mixed Media"],
    gradient:
      "radial-gradient(ellipse 65% 50% at 50% 35%, #2e5f7a 0%, #122535 55%, #060e18 100%)",
    accent: "#6ab8e0",
    images: [
      { src: "/art/sp0.webp", alt: "Screenprint" },
      { src: "/art/sp1.webp", alt: "Screenprint" },
      { src: "/art/sp2.webp", alt: "Screenprint" },
      { src: "/art/sp3.webp", alt: "Screenprint" },
      { src: "/art/sp4.webp", alt: "Screenprint" },
      { src: "/art/sp5.webp", alt: "Screenprint" },
      { src: "/art/sp6.webp", alt: "Screenprint" },
      { src: "/art/sp7.webp", alt: "Screenprint" },
      { src: "/art/sp8.webp", alt: "Screenprint" },
      { src: "/art/sp9.webp", alt: "Screenprint" },
      { src: "/art/sp10.webp", alt: "Screenprint" },
      { src: "/art/sp11.webp", alt: "Screenprint" },
      { src: "/art/sp12.webp", alt: "Screenprint" },
      { src: "/art/sp13.webp", alt: "Screenprint" },
    ],
    previewLayout: "4x2",
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
      { src: "/art/jw0.webp", alt: "Jewelry piece" },
      { src: "/art/jw1.webp", alt: "Jewelry piece" },
      { src: "/art/jw2.webp", alt: "Jewelry piece" },
    ],
  },
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
      { src: "/art/ce0.webp", alt: "Ceramics piece" },
      { src: "/art/ce1.webp", alt: "Ceramics piece" },
      { src: "/art/ce2.webp", alt: "Ceramics piece" },
      { src: "/art/ce3.webp", alt: "Ceramics piece" },
      { src: "/art/ce4.webp", alt: "Ceramics piece" },
      { src: "/art/ce5.webp", alt: "Ceramics piece" },
      { src: "/art/ce6.webp", alt: "Ceramics piece" },
      { src: "/art/ce7.webp", alt: "Ceramics piece" },
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
      { src: "/art/wb0.webp", alt: "Worldbuilding" },
      { src: "/art/wb1.png", alt: "Worldbuilding" },
      { src: "/art/wb2.png", alt: "Worldbuilding" },
      { src: "/art/wb3.png", alt: "Worldbuilding" },
      { src: "/art/wb4.png", alt: "Worldbuilding" },
    ],
    pdfLink: { href: "/Holiday Heist.pdf", label: "Holiday Heist" },
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
                  previewLayout={d.previewLayout}
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
                {d.pdfLink && (
                  <div className={styles.pdfRow}>
                    <a
                      href={d.pdfLink.href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.pdfPreview}
                      style={{ borderColor: `${d.accent}40`, color: d.accent }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      {d.pdfLink.label}
                    </a>
                    <a
                      href={d.pdfLink.href}
                      download
                      className={styles.pdfDownload}
                      style={{ borderColor: `${d.accent}40`, color: d.accent }}
                      aria-label={`Download ${d.pdfLink.label}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download
                    </a>
                  </div>
                )}
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
                <ObfuscatedEmail />
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
          <div style={{ position: "relative", display: "inline-block" }}>
            <Image
              src="/brad_henry.webp"
              alt="Bradley Charles"
              width={220}
              height={220}
              className={styles.contactAvatar}
              draggable={false}
              style={{ pointerEvents: "none", userSelect: "none" }}
            />
            <div
              style={{ position: "absolute", inset: 0, borderRadius: "50%", cursor: "default" }}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
