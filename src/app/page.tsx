"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const opportunityProjects = [
  {
    title: "Software Development",
    href: "https://northseattle.edu/aco/belindas-closet",
    repo: "https://github.com/SeattleColleges/belindas-closet-nextjs",
    blurb:
      "Developed a Next.js application with React frontend and FastAPI backend to prototype a multilingual chatbot for the Opportunity Center.",
    image: "/belindas-closet.png",
    meta: "Node.js · React · AI · Cross-Platform · Cloud Integration",
  },
  {
    title: "Artificial Intelligence",
    href: "https://northseattle.edu/aco/belindas-closet",
    repo: "https://github.com/SeattleColleges/belindas-closet-nextjs",
    blurb:
      "Implemented TinyLlama, a lightweight transformer optimized for edge deployment, keeping latency low while preserving response quality for campus users.",
    image: "/belindas-closet.png",
    meta: "AI · Model Optimization · Edge Deployment",
  },
  {
    title: "Project Management",
    href: "https://northseattle.edu/aco/belindas-closet",
    repo: "https://github.com/SeattleColleges/belindas-closet-nextjs",
    blurb:
      "Led a team of four to deliver the chatbot prototype, coordinating timelines, user testing, and accessibility requirements across stakeholders.",
    image: "/belindas-closet.png",
    meta: "Agile Delivery · Accessibility · Team Leadership",
  },
];

const securityAccessProjects = [
  {
    title: "Security Access Control",
    blurb:
      "Built a student and faculty security access portal outlining policy requirements, authentication standards, and best-practice checklists for campus systems.",
    meta: "Cybersecurity · AI · Documentation",
  },
];

const pegasusProjects = [
  {
    title: "Pegasus: Artist Content & Music Catalog",
    blurb:
      "Partnered with a four-person team to design and prototype a catalog platform that lets artists manage content, rights, and releases according to client specifications.",
    meta: "UI/UX Design · Wireframing · Documentation",
  },
];

const belindasClosetProjects = [
  {
    title: "Belinda's Closet",
    href: "https://northseattle.edu/aco/belindas-closet",
    repo: "https://github.com/SeattleColleges/belindas-closet-nextjs",
    blurb:
      "Student and staff portal to view inventory and track clothing donations; served as software developer, cybersecurity administrator, and project manager.",
    image: "/belindas-closet.png",
    meta: "React · Next.js · MongoDB",
  },
];

const nscEventsProjects = [
  {
    title: "NSC Events",
    blurb:
      "Campus events platform for North Seattle College to create and track student and faculty events; led development, security, and project delivery.",
    meta: "React · Next.js · MongoDB",
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={`${styles.section} ${styles.hero}`} id="top">
        <p className={styles.kicker}>Bradley Charles</p>
        {/*  <h1 className={styles.title}>
          Building helpful systems, tools, and stories
        </h1> */}
        <p className={styles.subtitle}>
          I’m a software engineer, cybersecurity analyst, project manager, and
          artist who loves building things and helping people. I have experience
          across the stack and a passion for learning new skills and domains.
          I’m currently focused on projects that blend software, security,
          operations, and art to create engaging and effective experiences.
        </p>
      </section>

      <section className={styles.section} id="projects">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Projects</p>
          <h2>Opportunity Center Chatbot</h2>
          <p className={styles.sectionLead}>
            Working with a small team of 4 we built a prototype chatbot for the
            Opportunity Center, located on the North Seattle Campus. It provides
            integrated educational, vocational, employment and supportive
            services through a partnership of multiple community-based agencies
            and community colleges. The chatbot helps users find relevant
            resources based on their needs and location with a focus on
            multilingual support and accessibility.
          </p>
        </div>
        <div className={styles.cardGrid}>
          {opportunityProjects.map((project) => (
            <article key={project.title} className={styles.card}>
              <div className={styles.cardBody}>
                <div>
                  <h3 className={styles.cardTitle}>
                    {project.href ? (
                      <Link
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {project.title}
                      </Link>
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p className={styles.cardMeta}>{project.meta}</p>
                  <p className={styles.cardText}>{project.blurb}</p>
                  <div className={styles.cardLinks}>
                    {project.href && (
                      <Link
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.cardLink}
                      >
                        Visit project →
                      </Link>
                    )}
                    {project.repo && (
                      <Link
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.cardLink}
                      >
                        View repo ↗
                      </Link>
                    )}
                  </div>
                </div>
                {project.image && (
                  <div className={styles.cardImage}>
                    <Image
                      src={project.image}
                      alt={`${project.title} preview`}
                      width={560}
                      height={320}
                      className={styles.image}
                      priority
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="security-access">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Projects</p>
          <h2>Security Access Control</h2>
          <p className={styles.sectionLead}>
            A campus security access page for students and faculty that
            consolidates policy requirements, authentication guidelines, and
            security best practices into a single, easy-to-follow checklist.
          </p>
        </div>
        <div className={styles.cardGrid}>
          {securityAccessProjects.map((project) => (
            <article key={project.title} className={styles.card}>
              <div className={styles.cardBody}>
                <div>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <p className={styles.cardMeta}>{project.meta}</p>
                  <p className={styles.cardText}>{project.blurb}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="pegasus">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Projects</p>
          <h2>Pegasus: Artist Content &amp; Music Catalog</h2>
          <p className={styles.sectionLead}>
            Partnered with a small team to prototype a platform where artists
            manage content, releases, and rights, aligning UI flows to client
            specifications.
          </p>
        </div>
        <div className={styles.cardGrid}>
          {pegasusProjects.map((project) => (
            <article key={project.title} className={styles.card}>
              <div className={styles.cardBody}>
                <div>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <p className={styles.cardMeta}>{project.meta}</p>
                  <p className={styles.cardText}>{project.blurb}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="belindas-closet">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Projects</p>
          <h2>Belinda&apos;s Closet</h2>
          <p className={styles.sectionLead}>
            A student and staff-facing site to view inventory and track clothing
            donations. Roles included software development, cybersecurity
            administration, and project management.
          </p>
        </div>
        <div className={styles.cardGrid}>
          {belindasClosetProjects.map((project) => (
            <article key={project.title} className={styles.card}>
              <div className={styles.cardBody}>
                <div>
                  <h3 className={styles.cardTitle}>
                    {project.href ? (
                      <Link
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {project.title}
                      </Link>
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p className={styles.cardMeta}>{project.meta}</p>
                  <p className={styles.cardText}>{project.blurb}</p>
                  <div className={styles.cardLinks}>
                    {project.href && (
                      <Link
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.cardLink}
                      >
                        Visit project →
                      </Link>
                    )}
                    {project.repo && (
                      <Link
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.cardLink}
                      >
                        View repo ↗
                      </Link>
                    )}
                  </div>
                </div>
                {project.image && (
                  <div className={styles.cardImage}>
                    <Image
                      src={project.image}
                      alt={`${project.title} preview`}
                      width={560}
                      height={320}
                      className={styles.image}
                      priority
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="nsc-events">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Projects</p>
          <h2>NSC Events</h2>
          <p className={styles.sectionLead}>
            Event management site for North Seattle College to create, publish,
            and track student and faculty events; combined development, security
            oversight, and project leadership.
          </p>
        </div>
        <div className={styles.cardGrid}>
          {nscEventsProjects.map((project) => (
            <article key={project.title} className={styles.card}>
              <div className={styles.cardBody}>
                <div>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <p className={styles.cardMeta}>{project.meta}</p>
                  <p className={styles.cardText}>{project.blurb}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.contact}`} id="contact">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Contact</p>
          <h2>Let’s build something together</h2>
          <p className={styles.sectionLead}>
            Please reach out to me via email if you are interested in working
            with me.
          </p>
        </div>
        <div className={styles.contactPanel}>
          <div>
            <p className={styles.contactLine}>
              Email:{" "}
              <a href="mailto:bradgcharles@gmail.com">bradgcharles@gmail.com</a>
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
          <Link href="#top" className={styles.secondaryCTA}>
            Back to top
          </Link>
        </div>
      </section>
    </main>
  );
}
