"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "../styles/navbar.css"; // Import your custom CSS file

const titles = [
  "Software Engineer",
  "Web Application Developer",
  "API & Backend Engineer",
  "React / React Native Developer",
  "Database-Driven Application Developer",
  "Automation & Tooling Developer",
  "Open-Source Contributor",
  "Cybersecurity Analyst",
  "Governance, Risk & Compliance (GRC) Practitioner",
  "Security Operations Assistant",
  "Identity & Access Management Administrator",
  "Threat Modeling & Risk Assessment Analyst",
  "Secure Systems Designer",
  "Information Security Advocate",
  "Technical Project Manager",
  "Machine Learning Practitioner",
  "RAG Systems Designer",
  "AI Systems Integrator",
  "Data Analysis Practitioner",
  "Model Evaluation & Fine-Tuning Researcher",
  "Product Liaison",
  "Development Team Lead",
  "Client & Stakeholder Liaison",
  "Scrum & Sprint Coordinator",
  "Program Support Manager",
  "Technical Documentation Lead",
  "Academic IT Support Specialist",
  "Student Technology Mentor",
  "User Support & Enablement Specialist",
  "Documentation & Knowledge Systems Builder",
  "Dungeon Master",
  "Narrative Systems Designer",
  "Worldbuilder",
  "Game Systems Designer",
  "Homebrew Content Creator",
  "3D Printing & Prop Designer",
  "Ceramics Artist",
  "Jewelry Maker",
  "Digital Fabrication Hobbyist",
];

const Navbar: React.FC = () => {
  const navLinks = [{ label: "Contact", href: "#contact" }];
  const projectOptions = [
    { label: "Opportunity Center Chatbot", value: "projects" },
    { label: "Security Access Control", value: "security-access" },
    { label: "Pegasus", value: "pegasus" },
    { label: "Belinda's Closet", value: "belindas-closet" },
    { label: "NSC Events", value: "nsc-events" },
  ];

  const shuffledTitles = useMemo(
    () => [...titles].sort(() => Math.random() - 0.5),
    [],
  );

  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % shuffledTitles.length);
    }, 2500);
    return () => clearInterval(id);
  }, [shuffledTitles.length]);

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sectionId = event.target.value;
    if (!sectionId) {
      return;
    }

    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${sectionId}`);
  };

  return (
    <nav className="navbar" aria-label="Primary">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-logo">Bradley Charles</div>
          <div className="navbar-roles" aria-live="polite">
            {shuffledTitles[titleIndex]}
          </div>
        </div>
        <ul className="navbar-links">
          <li>
            <label htmlFor="projects-nav" className="sr-only">
              Jump to a project section
            </label>
            <select
              id="projects-nav"
              defaultValue=""
              onChange={handleProjectChange}
              className="navbar-select"
              aria-label="Projects"
            >
              <option value="" disabled>
                Projects
              </option>
              {projectOptions.map((project) => (
                <option key={project.value} value={project.value}>
                  {project.label}
                </option>
              ))}
            </select>
          </li>
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
