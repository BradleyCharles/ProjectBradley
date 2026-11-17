import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colonization Hauling Tracker",
  description:
    "Elite Dangerous construction materials logistics: track colonization facility costs and commodities to haul.",
};

export default function EdctoolLayout({ children }: { children: React.ReactNode }) {
  return children;
}
