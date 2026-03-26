"use client";

import ArtistPage from "@/Components/ArtistPage";
import Certifications from "@/Components/Certifications";
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
          <section className={`${styles.section} ${styles.hero}`} id="top">
            <p className={styles.heroKicker}>Full-Stack Portfolio</p>
            <h1 className={styles.heroName}>Bradley Charles</h1>
            <RoleTicker titles={devTitles} className={styles.heroTagline} />
            <div className={styles.heroRule} />
            <p className={styles.heroStatement}>
              I am a software engineer, cybersecurity analyst, project manager,
              and artist focused on building practical systems for real people. I
              value clear outcomes, strong collaboration, and continuous
              learning.
            </p>
          </section>

          <Projects />

          <Certifications />

          <section
            className={`${styles.section} ${styles.contact}`}
            id="contact"
          >
            <div className={styles.sectionHeader}>
              <p className={styles.kicker}>Contact</p>
              <h2>Let&apos;s Build Something Together</h2>
              <p className={styles.sectionLead}>
                Please reach out via email if you are interested in working with
                me.
              </p>
            </div>
            <div className={styles.contactPanel}>
              <div>
                <p className={styles.contactLine}>
                  Email:{" "}
                  <a href="mailto:bradgcharles@gmail.com">
                    bradgcharles@gmail.com
                  </a>
                </p>
                <p className={styles.contactLine}>
                  GitHub:{" "}
                  <a
                    href="https://github.com/bradgcharles"
                    target="_blank"
                    rel="noreferrer"
                  >
                    github.com/bradgcharles
                  </a>
                </p>
                <p className={styles.contactLine}>
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
          </section>
        </main>
      )}
    </div>
  );
}
