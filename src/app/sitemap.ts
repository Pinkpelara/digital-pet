import type { MetadataRoute } from "next";
import { companions, items } from "@/data/catalog";

const site = "https://pinkpelara.github.io/digital-pet";

function loc(path: string): string {
  if (path === "/") return `${site}/`;
  return `${site}${path.endsWith("/") ? path : `${path}/`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/companions",
    "/closet",
    "/gadgets",
    "/skills",
    "/drops",
    "/about",
    "/live",
    "/browser",
    "/desktop",
    "/my-companions",
    "/support",
    "/privacy",
    "/terms",
  ];
  const companionPages = companions.map((companion) => `/companions/${companion.slug}`);
  const itemPages = items.filter((item) => item.kind !== "companion" && item.active).map((item) => `/item/${item.slug}`);
  return [...pages, ...companionPages, ...itemPages].map((path) => ({
    url: loc(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
