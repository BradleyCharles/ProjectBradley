"use client";

import ArtistPage from "@/Components/ArtistPage";
import Certifications from "@/Components/Certifications";
import Contact from "@/Components/Contact";
import HeroCanvas from "@/Components/HeroCanvas";
import Projects from "@/Components/Projects";
import RoleTicker from "@/Components/RoleTicker";
import { useMode } from "@/context/ModeContext";
import { devTitles } from "@/data/titles";
import styles from "../styles/page.module.css";

export default function Home() {
  const { mode } = useMode();

  return (
    <div key={mode} className={styles.modeContent}>
      {mode === "artist" ? (
        <ArtistPage />
      ) : (
        <main className={styles.page}>
          <section className={`${styles.section} ${styles.hero}`} id="top" style={{ position: "relative" }}>
            <HeroCanvas />
            <p className={styles.heroKicker}>Full-Stack Portfolio</p>
            <h1 className={styles.heroName}>Bradley Charles</h1>
            <RoleTicker titles={devTitles} className={styles.heroTagline} />
            <div className={styles.heroRule} />
            <p className={styles.heroStatement}>
              I am a software engineer, cybersecurity analyst, project manager,
              and artist focused on building practical systems for real people.
              I believe the best way to learn is by doing. I love building things and learning.
            </p>
          </section>

          <Certifications />

          <Projects />

          <Contact />
        </main>
      )}
    </div>
  );
}
