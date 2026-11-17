import type { Metadata } from "next";
import { Oswald } from "next/font/google";

const oswald = Oswald({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "CP2077 Iconic Checklist",
  description:
    "An iconic weapons checklist for Cyberpunk 2077 and Phantom Liberty, patch 2.x reference.",
};

export default function Cp2077Layout({ children }: { children: React.ReactNode }) {
  return <div className={oswald.variable}>{children}</div>;
}
