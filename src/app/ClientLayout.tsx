"use client";

import { ModeProvider } from "@/context/ModeContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <ModeProvider>{children}</ModeProvider>;
}
