"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Lightbox from "./Lightbox";
import TiltImage from "./TiltImage";
import ArtistPage from "./ArtistPage";
import RoleTicker from "./RoleTicker";
import { useMode } from "@/context/ModeContext";
import { devTitles } from "@/data/titles";
import styles from "./page.module.css";

type Project = {
  id: string;
  name: string;
  summary: string;
  impact: string[];
  roles: string[];
  stack: string[];
  href?: string;
  repo?: string;
  image?: string;
  image1?: string;
  image2?: string;
};

const projects: Project[] = [
  {
    id: "projects",
    name: "Opportunity Center Chatbot",
    summary:
      "Designed and shipped a multilingual support chatbot prototype for North Seattle College's Opportunity Center with a team of four.",
    impact: [
      "Built a Next.js frontend and Python API integration path for rapid iteration.",
      "Focused on accessibility and multilingual workflows for real campus users.",
      "Coordinated delivery milestones, demos, and technical documentation.",
    ],
    roles: ["Software Engineering", "AI Integration", "Project Leadership"],
    stack: ["Next.js", "Python", "Ollama", "Prompt Engineering"],
    repo: "https://github.com/SeattleColleges/belindas-closet-nextjs",
    image1: "/occb1.png",
    image2: "/occb2.png",
  },
  {
    id: "security-access",
    name: "Security Access Control",
    summary:
      "Created a campus security access portal that turns policy requirements into a practical checklist for students and faculty.",
    impact: [
      "Translated policy language into clear implementation guidance.",
      "Defined authentication and account-access guardrails.",
      "Centralized best practices to reduce onboarding and support friction.",
    ],
    roles: ["Cybersecurity", "Policy Translation", "Documentation"],
    stack: ["Security Controls", "Identity Access", "Knowledge Base"],
  },
  {
    id: "pegasus",
    name: "Pegasus: Artist Content and Music Catalog",
    summary:
      "Partnered with a cross-functional team to prototype a content and rights catalog platform for artists and creative teams.",
    impact: [
      "Mapped user journeys from release planning to catalog management.",
      "Produced wireframes and flow documentation aligned to client scope.",
      "Balanced usability goals with content governance requirements.",
    ],
    roles: ["Product Design", "Client Collaboration", "UX Documentation"],
    stack: ["UI/UX", "Wireframing", "Content Modeling"],
  },
  {
    id: "belindas-closet",
    name: "Belinda's Closet",
    summary:
      "Built a donation and inventory portal for students and staff while owning development, security oversight, and project coordination.",
    impact: [
      "Implemented inventory visibility flows for non-technical users.",
      "Set up security-minded practices for a student-facing platform.",
      "Maintained project direction across engineering and stakeholder input.",
    ],
    roles: ["Full-Stack Development", "Cybersecurity", "Project Management"],
    stack: ["React", "Next.js", "MongoDB"],
    href: "https://northseattle.edu/aco/belindas-closet",
    repo: "https://github.com/SeattleColleges/belindas-closet-nextjs",
    image: "/belindas-closet.png",
  },
  {
    id: "nsc-events",
    name: "NSC Events",
    summary:
      "Developed an events platform for North Seattle College to help teams create, publish, and track faculty and student events.",
    impact: [
      "Simplified event publishing and tracking workflows.",
      "Combined delivery planning with day-to-day implementation.",
      "Integrated a security-first mindset into platform decisions.",
    ],
    roles: ["Application Development", "Security Oversight", "Delivery Lead"],
    stack: ["React", "Next.js", "MongoDB"],
  },
];

type LightboxState = { images: string[]; index: number; projectName: string };

function getProjectImages(project: Project): string[] {
  if (project.image1 && project.image2) return [project.image1, project.image2];
  if (project.image) return [project.image];
  return [];
}

export default function Home() {
  const { mode } = useMode();
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const openLightbox = (project: Project, index: number) => {
    setLightbox({ images: getProjectImages(project), index, projectName: project.name });
  };

  return (
    <>
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
          I am a software engineer, cybersecurity analyst, project manager, and
          artist focused on building practical systems for real people. I value
          clear outcomes, strong collaboration, and continuous learning.
        </p>
      </section>

      <section className={`${styles.section} ${styles.projectsShowcase}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Project Portfolio</p>
          <h2>Case Studies Built for Real Users</h2>
          <p className={styles.sectionLead}>
            Each project below highlights the problem space, my role, and the
            measurable execution choices I made to deliver value.
          </p>
        </div>

        <div className={styles.projectList}>
          {projects.map((project, index) => (
            <article
              key={project.id}
              id={project.id}
              className={styles.projectPanel}
            >
              <div className={styles.projectContent}>
                <p className={styles.projectNumber}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className={styles.projectName}>{project.name}</h3>
                <p className={styles.projectSummary}>{project.summary}</p>

                <ul className={styles.impactList}>
                  {project.impact.map((item) => (
                    <li key={item} className={styles.impactItem}>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className={styles.pillRow}>
                  {project.roles.map((role) => (
                    <span key={role} className={styles.pill}>
                      {role}
                    </span>
                  ))}
                </div>

                <p className={styles.stackLine}>
                  <span>Stack:</span> {project.stack.join(" / ")}
                </p>

                <div className={styles.cardLinks}>
                  {project.href && (
                    <Link
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.cardLink}
                    >
                      Visit project
                    </Link>
                  )}
                  {project.repo && (
                    <Link
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.cardLink}
                    >
                      View repo
                    </Link>
                  )}
                </div>
              </div>

              {(project.image1 && project.image2) ? (
                <div className={styles.projectImages}>
                  <TiltImage>
                    <button className={styles.imageButton} onClick={() => openLightbox(project, 0)} aria-label={`${project.name} preview 1 — click to enlarge`}>
                      <div className={styles.projectImage}>
                        <Image
                          src={project.image1}
                          alt={`${project.name} preview 1`}
                          width={560}
                          height={320}
                          className={styles.image}
                          priority={index === 0}
                        />
                      </div>
                    </button>
                  </TiltImage>
                  <TiltImage>
                    <button className={styles.imageButton} onClick={() => openLightbox(project, 1)} aria-label={`${project.name} preview 2 — click to enlarge`}>
                      <div className={styles.projectImage}>
                        <Image
                          src={project.image2}
                          alt={`${project.name} preview 2`}
                          width={560}
                          height={320}
                          className={styles.image}
                        />
                      </div>
                    </button>
                  </TiltImage>
                </div>
              ) : project.image ? (
                <TiltImage>
                  <button className={styles.imageButton} onClick={() => openLightbox(project, 0)} aria-label={`${project.name} preview — click to enlarge`}>
                    <div className={styles.projectImage}>
                      <Image
                        src={project.image}
                        alt={`${project.name} preview`}
                        width={560}
                        height={320}
                        className={styles.image}
                        priority={index === 0}
                      />
                    </div>
                  </button>
                </TiltImage>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.contact}`} id="contact">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Contact</p>
          <h2>Let&apos;s Build Something Together</h2>
          <p className={styles.sectionLead}>
            Please reach out via email if you are interested in working with me.
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
        </div>
      </section>
    </main>
    )}
    </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          projectName={lightbox.projectName}
          onClose={() => setLightbox(null)}
          onNavigate={(i) => setLightbox((prev) => prev ? { ...prev, index: i } : null)}
        />
      )}
    </>
  );
}
