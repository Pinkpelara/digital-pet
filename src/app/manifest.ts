import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
import { publicBasePath } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const base = publicBasePath();
  return {
    name: brand.name,
    short_name: brand.name,
    description: brand.hero,
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    theme_color: "#0a0b0c",
    background_color: "#0a0b0c",
    icons: [
      {
        src: `${base}/icons/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${base}/icons/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${base}/icons/icon-maskable-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
