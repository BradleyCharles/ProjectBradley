import type { Metadata } from "next";
import { Spectral } from "next/font/google";

const spectral = Spectral({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-spectral",
});

export const metadata: Metadata = {
  title: "RO Dev Suite",
  description:
    "RO Dev Suite: a set of developer tools that run entirely in the browser tab, with a single tool registry and no server round-trips.",
};

export default function RdsLayout({ children }: { children: React.ReactNode }) {
  return <div className={spectral.variable}>{children}</div>;
}
