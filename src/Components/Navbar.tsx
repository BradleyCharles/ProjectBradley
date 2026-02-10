"use client";

import React, { useState } from "react";
import Link from "next/link";
import "../styles/navbar.css"; // Import your custom CSS file

const Navbar: React.FC = () => {
  const [projectsOpen, setProjectsOpen] = useState(false);

  const toggleProjects = () => setProjectsOpen((prev) => !prev);
  const closeProjects = () => setProjectsOpen(false);

  return (
    <nav>
      <div className="navbar-container">
        <div className="navbar-logo">Bradley Charles</div>
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
              <span className={`chevron ${projectsOpen ? "open" : ""}`} aria-hidden="true">
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
                <Link href="/projects#project-management" onClick={closeProjects}>
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
