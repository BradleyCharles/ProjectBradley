import type { Metadata } from "next";
import { Almendra, Pixelify_Sans } from "next/font/google";

const pixelifySans = Pixelify_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-pixelify",
});

const almendra = Almendra({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-almendra",
});

export const metadata: Metadata = {
  title: "BARD | Bradley Charles",
  description:
    "BARD: a Godot 4 action RPG whose NPCs remember what you did, powered by an offline, pre-rendered LLM dialogue pipeline.",
};

export default function BardLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${pixelifySans.variable} ${almendra.variable}`}>{children}</div>;
}
