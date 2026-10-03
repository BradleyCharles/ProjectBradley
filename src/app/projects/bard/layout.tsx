import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BARD | Bradley Charles",
  description:
    "BARD: a Godot 4 action RPG whose NPCs remember what you did, powered by an offline, pre-rendered LLM dialogue pipeline.",
};

export default function BardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
