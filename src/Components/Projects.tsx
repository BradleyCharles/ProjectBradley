"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Lightbox from "./Lightbox";
import TiltImage from "./TiltImage";
import styles from "../styles/page.module.css";

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
    id: "nsc-ai-tutor",
    name: "North Seattle College AI Tutor",
    summary:
      "Built an AI-powered tutoring chatbot using Claude Artifact that guides Application Development students through their homework assignments with personalized, step-by-step tutoring sessions.",
    impact: [
      "Students submit assignments and receive a curated tutoring experience tailored to their specific work.",
      "Breaks down complex programming concepts into guided, digestible steps to reinforce learning.",
      "Deployed as a shareable Claude Artifact — no installation required for students or instructors.",
    ],
    roles: ["AI Development", "Instructional Design", "Prompt Engineering"],
    stack: ["Claude Artifact", "Prompt Engineering", "AI Tutoring"],
    href: "https://claude.ai/public/artifacts/a9d2aeab-ae93-40d3-824b-f053a6d94a7c",
    image1: "/tutor1.png",
    image2: "/tutor2.png",
  },
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
    image1: "/occb1.webp",
    image2: "/occb2.webp",
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
    href: "https://salty-witness-2f5.notion.site/Security-Access-17ed514f21a080529df2d2631f99b096",
    image1: "/s1.webp",
    image2: "/s2.webp",
  },
  {
    id: "pegasus",
    name: "Pegasus Media Group: Artist Content and Music Catalog",
    summary:
      "Partnered with a cross-functional team to prototype a content and rights catalog platform for artists and creative teams.",
    impact: [
      "Mapped user journeys from release planning to catalog management.",
      "Produced wireframes and flow documentation aligned to client scope.",
      "Balanced usability goals with content governance requirements.",
    ],
    roles: ["Product Design", "Client Collaboration", "UX Documentation"],
    stack: ["UI/UX", "Wireframing", "Content Modeling"],
    href: "https://www.figma.com/files/team/1496314481480006498/project/371907678?fuid=1366183561238531162",
    image1: "/p1.webp",
    image2: "/p2.webp",
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
    repo: "https://github.com/SeattleColleges/belindas-closet-nextjs",
    image1: "/bc1.webp",
    image2: "/bc2.webp",
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

export default function Projects() {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const openLightbox = (project: Project, index: number) => {
    setLightbox({
      images: getProjectImages(project),
      index,
      projectName: project.name,
    });
  };

  return (
    <>
      <section className={`${styles.section} ${styles.projectsShowcase}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Project Portfolio</p>
          <h2>Projects built for real users</h2>
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

              {project.image1 && project.image2 ? (
                <div className={styles.projectImages}>
                  <TiltImage>
                    <button
                      className={styles.imageButton}
                      onClick={() => openLightbox(project, 0)}
                      aria-label={`${project.name} preview 1 — click to enlarge`}
                    >
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
                    <button
                      className={styles.imageButton}
                      onClick={() => openLightbox(project, 1)}
                      aria-label={`${project.name} preview 2 — click to enlarge`}
                    >
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
                  <button
                    className={styles.imageButton}
                    onClick={() => openLightbox(project, 0)}
                    aria-label={`${project.name} preview — click to enlarge`}
                  >
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

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          projectName={lightbox.projectName}
          onClose={() => setLightbox(null)}
          onNavigate={(i) =>
            setLightbox((prev) => (prev ? { ...prev, index: i } : null))
          }
        />
      )}
    </>
  );
}
