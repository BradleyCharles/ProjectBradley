"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../styles/navbar.css";
import { useMode } from "@/context/ModeContext";

function BrandLink() {
  const pathname = usePathname();

  if (pathname.startsWith("/projects/maki")) {
    return (
      <Link href="/" className="navbar-brand navbar-brand-maki">
        Bradley Charles
      </Link>
    );
  }

  if (pathname.startsWith("/cp2077")) {
    return (
      <Link href="/" className="navbar-brand navbar-brand-cp2077">
        Bradley Charles
      </Link>
    );
  }

  if (pathname.startsWith("/projects/rds")) {
    return (
      <Link href="/" className="navbar-brand navbar-brand-rds">
        Bradley Charles
      </Link>
    );
  }

  if (pathname.startsWith("/projects/bard")) {
    return (
      <Link href="/" className="navbar-brand navbar-brand-bard">
        Bradley Charles
      </Link>
    );
  }

  if (pathname.startsWith("/edctool")) {
    return (
      <Link href="/" className="navbar-brand navbar-brand-edctool">
        Bradley Charles
      </Link>
    );
  }

  return (
    <Link href="/" className="navbar-brand navbar-brand-default">
      Bradley Charles
    </Link>
  );
}

const Navbar: React.FC = () => {
  const { mode, setMode } = useMode();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const hasContactSection = isHome || pathname === "/resume";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown and mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape closes the innermost open panel and returns focus to its button
  useEffect(() => {
    if (!dropdownOpen && !menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (dropdownOpen) {
        setDropdownOpen(false);
        dropdownTriggerRef.current?.focus();
      } else {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dropdownOpen, menuOpen]);

  // Close dropdown and mobile menu on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="navbar" aria-label="Primary">
      <div className="navbar-container">

        {isHome ? (
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
        ) : (
          <BrandLink />
        )}

        <button
          ref={menuButtonRef}
          className="navbar-button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="primary-nav-links"
        >
          <span className="navbar-button-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="sr-only">Menu</span>
        </button>

        <ul
          id="primary-nav-links"
          ref={menuRef}
          className={`navbar-links${menuOpen ? " open" : ""}`}
          onClick={(e) => {
            // Same-page links like #contact don't change the route, so close here
            if ((e.target as HTMLElement).closest("a")) setMenuOpen(false);
          }}
        >
          <li ref={dropdownRef} className="dropdown">
            <button
              ref={dropdownTriggerRef}
              className="dropdown-trigger"
              onClick={() => setDropdownOpen((o) => !o)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              Projects
              <span className={`chevron${dropdownOpen ? " open" : ""}`}>▾</span>
            </button>
            <ul className={`dropdown-menu${dropdownOpen ? " open" : ""}`}>
              <li>
                <Link href="/projects/rds" onClick={() => setDropdownOpen(false)}>
                  RO Dev Suite
                </Link>
              </li>
              <li>
                <Link href="/projects/bard" onClick={() => setDropdownOpen(false)}>
                  BARD
                </Link>
              </li>
              <li>
                <Link href="/projects/maki" onClick={() => setDropdownOpen(false)}>
                  Project Maki
                </Link>
              </li>
              <li>
                <Link href="/cp2077" onClick={() => setDropdownOpen(false)}>
                  CP2077 Iconic Checklist
                </Link>
              </li>
              <li>
                <Link href="/edctool" onClick={() => setDropdownOpen(false)}>
                  Elite Dangerous Colonization Tracker
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="/resume">Resume</Link>
          </li>
          {hasContactSection && (
            <li>
              <Link href={isHome ? "#contact" : "/resume#contact"}>Contact</Link>
            </li>
          )}
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;
