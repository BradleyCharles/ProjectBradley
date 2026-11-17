"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

export type Mode = "developer" | "artist";

const ModeContext = createContext<{
  mode: Mode;
  setMode: (m: Mode) => void;
}>({ mode: "developer", setMode: () => {} });

const readModeFromUrl = (): Mode =>
  new URLSearchParams(window.location.search).get("mode") === "artist" ? "artist" : "developer";

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("developer");

  // Deep link (/?mode=artist) on first load, and Back/Forward between modes.
  useEffect(() => {
    if (window.location.pathname === "/") setModeState(readModeFromUrl());
    const onPop = () => {
      if (window.location.pathname === "/") setModeState(readModeFromUrl());
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const setMode = useCallback((next: Mode) => {
    setModeState(next);
    if (window.location.pathname !== "/") return;
    const url = next === "artist" ? "/?mode=artist" : "/";
    if (window.location.pathname + window.location.search !== url) {
      window.history.pushState(null, "", url);
    }
  }, []);

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => useContext(ModeContext);
