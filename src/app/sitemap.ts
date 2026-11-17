import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

const routes = [
  "",
  "/resume",
  "/projects/rds",
  "/projects/bard",
  "/projects/maki",
  "/cp2077",
  "/edctool",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
