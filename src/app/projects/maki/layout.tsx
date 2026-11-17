import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Maki",
  description:
    "Project Maki: a local AI chatbot with persistent memory, character depth and a Discord home.",
};

export default function MakiLayout({ children }: { children: React.ReactNode }) {
  return <div className={geistMono.variable}>{children}</div>;
}
