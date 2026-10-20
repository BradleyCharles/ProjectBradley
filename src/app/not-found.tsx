import type { Metadata } from "next";
import Link from "next/link";
import styles from "../styles/page.module.css";

export const metadata: Metadata = {
  title: "Page not found | Bradley Charles",
};

const featuredProjects = [
  { href: "/projects/rds", label: "RO Dev Suite" },
  { href: "/projects/bard", label: "BARD" },
  { href: "/projects/maki", label: "Project Maki" },
];

export default function NotFound() {
  return (
    <div className={styles.page}>
      <section className={`${styles.section} ${styles.hero}`}>
        <p className={styles.heroKicker}>Error 404</p>
        <h1 className={styles.heroName}>Page not found</h1>
        <div className={styles.heroRule} />
        <p className={styles.heroStatement}>
          This page doesn&apos;t exist or has moved. Try one of these instead.
        </p>
        <div className={styles.cardLinks} style={{ justifyContent: "center", marginTop: 28 }}>
          <Link href="/" className={styles.secondaryCTA}>
            Back to home
          </Link>
          <Link href="/resume" className={styles.secondaryCTA}>
            Resume
          </Link>
        </div>
        <nav aria-label="Featured projects" className={styles.cardLinks} style={{ justifyContent: "center", gap: 24 }}>
          {featuredProjects.map((project) => (
            <Link key={project.href} href={project.href} className={styles.cardLink}>
              {project.label} →
            </Link>
          ))}
        </nav>
      </section>
    </div>
  );
}
