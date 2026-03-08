"use client";

import Link from "next/link";
import "../styles/navbar.css";
import { useMode } from "@/context/ModeContext";

const Navbar: React.FC = () => {
  const { mode, setMode } = useMode();

  return (
    <nav className="navbar" aria-label="Primary">
      <div className="navbar-container">

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
          <li>
            <Link href="#contact">Contact</Link>
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;
