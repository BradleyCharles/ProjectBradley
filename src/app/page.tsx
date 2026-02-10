"use client";

import Link from "next/link";
import styles from "./page.module.css";

const categories = [
  { label: "Software Development", href: "/projects#software" },
  { label: "Cybersecurity", href: "/projects#cybersecurity" },
  { label: "Project Management", href: "/projects#project-management" },
  { label: "Art", href: "/projects#art" },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Projects</p>
        <h1 className={styles.title}>Explore the Worlds I Build</h1>
        <p className={styles.subtitle}>
          Choose a category to dive into the work — software, security, strategy, or art.
        </p>
      </section>

      <section className={styles.bubbleSection} aria-label="Project categories">
        <div className={styles.bubbleGrid}>
          {categories.map((cat) => (
            <Link key={cat.label} href={cat.href} className={styles.bubbleCard}>
              <span className={styles.bubbleText}>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
