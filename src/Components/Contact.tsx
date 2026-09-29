"use client";

import Image from "next/image";
import ObfuscatedEmail from "./ObfuscatedEmail";
import styles from "../styles/page.module.css";

export default function Contact() {
  return (
    <section className={`${styles.section} ${styles.contact}`} id="contact">
      <div className={styles.contactInner}>
        <div className={styles.contactLeft}>
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Contact</p>
            <h2>Let&apos;s Build Something Together</h2>
            <p className={styles.sectionLead}>
              Please reach out via email if you are interested in working
              with me.
            </p>
          </div>
          <div>
            <p className={styles.contactLine}>
              Email:{" "}
              <ObfuscatedEmail />
            </p>
            <p className={styles.contactLine}>
              GitHub:{" "}
              <a
                href="https://github.com/BradleyCharles"
                target="_blank"
                rel="noreferrer"
              >
                github.com/BradleyCharles
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
        <div style={{ position: "relative", display: "inline-block" }}>
          <Image
            src="/brad_water.webp"
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
  );
}
