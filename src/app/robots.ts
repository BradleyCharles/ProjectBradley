import { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: `${SITE_URL}/sitemap.xml`,
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // Block known data harvesting / SEO scraper bots
      {
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "DotBot",
          "MJ12bot",
          "BLEXBot",
          "DataForSeoBot",
          "PetalBot",
          "BrightBot",
          "serpstatbot",
          "Bytespider",
        ],
        disallow: "/",
      },
    ],
  };
}
