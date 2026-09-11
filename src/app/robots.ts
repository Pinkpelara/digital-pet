import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://pinkpelara.github.io/digital-pet/sitemap.xml",
    host: "https://pinkpelara.github.io/digital-pet",
  };
}
