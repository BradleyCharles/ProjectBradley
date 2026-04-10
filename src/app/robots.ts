import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
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
