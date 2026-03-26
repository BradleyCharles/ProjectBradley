"use client";

import { ModeProvider } from "@/context/ModeContext";
import { useMode } from "@/context/ModeContext";
import { useEffect } from "react";

function BodyClassSync() {
  const { mode } = useMode();
  useEffect(() => {
    document.body.classList.toggle("artist-mode", mode === "artist");
  }, [mode]);
  return null;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModeProvider>
      <BodyClassSync />
      {children}
    </ModeProvider>
  );
}
