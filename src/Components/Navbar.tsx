"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../styles/navbar.css";
import { useMode } from "@/context/ModeContext";

function BrandLink() {
  const pathname = usePathname();

  if (pathname.startsWith("/maki")) {
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

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
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

        <ul className="navbar-links">
          <li ref={dropdownRef} className="dropdown">
            <button
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
                <Link href="/maki" onClick={() => setDropdownOpen(false)}>
                  Project Maki
                </Link>
              </li>
              <li>
                <Link href="/cp2077" onClick={() => setDropdownOpen(false)}>
                  CP2077 Iconic Checklist
                </Link>
              </li>
            </ul>
          </li>
          {isHome && (
            <li>
              <Link href="#contact">Contact</Link>
            </li>
          )}
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;
