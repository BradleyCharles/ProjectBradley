"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "../styles/navbar.css"; // Import your custom CSS file

const Navbar: React.FC = () => {
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

  const shuffledTitles = useMemo(
    () => [...titles].sort(() => Math.random() - 0.5),
    []
  );

  const [projectsOpen, setProjectsOpen] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % shuffledTitles.length);
    }, 2500);
    return () => clearInterval(id);
  }, [shuffledTitles.length]);

  const toggleProjects = () => setProjectsOpen((prev) => !prev);
  const closeProjects = () => setProjectsOpen(false);

  return (
    <nav>
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-logo">Bradley Charles</div>
          <div className="navbar-roles" aria-live="polite">
            {shuffledTitles[titleIndex]}
          </div>
        </div>
        <ul className="navbar-links">
          <li className="dropdown">
            <button
              type="button"
              className="dropdown-trigger"
              onClick={toggleProjects}
              aria-expanded={projectsOpen}
              aria-controls="projects-menu"
            >
              Projects
              <span
                className={`chevron ${projectsOpen ? "open" : ""}`}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>
            <ul
              id="projects-menu"
              className={`dropdown-menu ${projectsOpen ? "open" : ""}`}
              role="menu"
            >
              <li role="menuitem">
                <Link href="/projects#software" onClick={closeProjects}>
                  Software Development
                </Link>
              </li>
              <li role="menuitem">
                <Link href="/projects#cybersecurity" onClick={closeProjects}>
                  Cybersecurity
                </Link>
              </li>
              <li role="menuitem">
                <Link
                  href="/projects#project-management"
                  onClick={closeProjects}
                >
                  Project management
                </Link>
              </li>
              <li role="menuitem">
                <Link href="/projects#art" onClick={closeProjects}>
                  Art
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
