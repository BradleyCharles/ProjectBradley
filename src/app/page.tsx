"use client";

import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Explore the Worlds I Build</h1>
        <p className={styles.subtitle}>
          Use the navigation bar to jump into my work—software development,
          cybersecurity, project management, art—or reach out via the contact
          link.
        </p>
        {/* Contact me */}
        <h2>Contact Me</h2>
        <p>
          <a href="mailto:bradgcharles@gmail.com">bradgcharles@gmail.com</a>
        </p>
        <p>
          <a href="https://github.com/bradgcharles">github.com/bradgcharles</a>
        </p>
        <p>
          <a href="https://www.linkedin.com/in/bradgcharles/">
            linkedin.com/in/bradgcharles
          </a>
        </p>

        {/* Software Development */}
        <p>Belinda's Closet</p>
        <h3>
          <a href="https://northseattle.edu/aco/belindas-closet">
            Belinda’s Closet
          </a>
        </h3>
        <image
          src="/public/images/belindas-closet.png"
          alt="Belinda's Closet"
          width={600}
          height={400}
        />
        {/* Cybersecurity */}
        {/* Project Management */}
        {/* Art */}
      </section>
    </main>
  );
}
