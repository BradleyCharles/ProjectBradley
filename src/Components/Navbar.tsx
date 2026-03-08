"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "../styles/navbar.css";
import { useMode } from "@/context/ModeContext";

const artistTitles = [
  "Ceramics Artist",
  "Jewelry Maker",
  "3D Printing & Prop Designer",
  "Digital Fabrication Hobbyist",
  "Dungeon Master",
  "Narrative Systems Designer",
  "Worldbuilder",
  "Game Systems Designer",
  "Homebrew Content Creator",
];

const allDevTitles = [
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
];

const Navbar: React.FC = () => {
  const { mode, setMode } = useMode();

  const navLinks = [{ label: "Contact", href: "#contact" }];

  const shuffledDev = useMemo(
    () => [...allDevTitles].sort(() => Math.random() - 0.5),
    [],
  );
  const shuffledArtist = useMemo(
    () => [...artistTitles].sort(() => Math.random() - 0.5),
    [],
  );

  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    setTitleIndex(0);
  }, [mode]);

  const activeTitles = mode === "artist" ? shuffledArtist : shuffledDev;

  useEffect(() => {
    const id = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % activeTitles.length);
    }, 2500);
    return () => clearInterval(id);
  }, [activeTitles.length]);

  return (
    <nav className="navbar" aria-label="Primary">
      <div className="navbar-container">

        <div className="navbar-brand">
          <div className="navbar-logo">Bradley Charles</div>
          <div className="navbar-roles" aria-live="polite">
            {activeTitles[titleIndex]}
          </div>
        </div>

        <div className="mode-toggle" role="group" aria-label="View mode">
          <button
            className={`toggle-btn${mode === "developer" ? " toggle-active" : ""}`}
            onClick={() => setMode("developer")}
            aria-pressed={mode === "developer"}
          >
            Developer
          </button>
          <button
            className={`toggle-btn${mode === "artist" ? " toggle-active" : ""}`}
            onClick={() => setMode("artist")}
            aria-pressed={mode === "artist"}
          >
            Artist
          </button>
        </div>

        <ul className="navbar-links">
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
