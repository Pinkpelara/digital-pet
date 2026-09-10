import type { SpeciesId } from "@/lib/types";

export const figurineLook: Record<
  SpeciesId,
  { body: string; belly: string; shade: string; gloss: string; extra: string }
> = {
  bloop: { body: "#5e8f8a", belly: "#c5d9d5", shade: "#3d6561", gloss: "#9ec4bf", extra: "#8fb8b2" },
  mochi: { body: "#b59a8c", belly: "#d9cfc6", shade: "#8a7368", gloss: "#e4dbd4", extra: "#c4b1a6" },
  sprout: { body: "#6d7a58", belly: "#c9d0b8", shade: "#4a533c", gloss: "#a3ad88", extra: "#7f8a62" },
  niblet: { body: "#c49a5c", belly: "#e6d3b0", shade: "#8f6d38", gloss: "#e8c98a", extra: "#d4b06e" },
};

export const vinyl = {
  roughness: 0.32,
  metalness: 0.04,
  clearcoat: 0.92,
  clearcoatRoughness: 0.18,
  sheen: 0.4,
  sheenRoughness: 0.62,
  sheenColor: "#eef1ee",
} as const;
