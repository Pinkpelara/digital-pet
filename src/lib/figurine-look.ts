import type { SpeciesId } from "@/lib/types";

/** Soft toy colours — saturated enough to lead the page, not preschool neon. */
export const figurineLook: Record<
  SpeciesId,
  { body: string; belly: string; shade: string; gloss: string; extra: string }
> = {
  bloop: { body: "#3EC8BE", belly: "#E7FFFB", shade: "#2A9A92", gloss: "#B8FFF6", extra: "#7EEDE4" },
  mochi: { body: "#F0A3AC", belly: "#FFE8EA", shade: "#D47A84", gloss: "#FFF0F2", extra: "#FFC4CA" },
  sprout: { body: "#7FBF3A", belly: "#E8F6C8", shade: "#5A8A28", gloss: "#C8E878", extra: "#9AD44A" },
  niblet: { body: "#F0B03A", belly: "#FFF0C8", shade: "#C48420", gloss: "#FFE08A", extra: "#FFD060" },
};

/** Soft clay / toy plastic — more stage light, still a companion not chrome. */
export const clay = {
  roughness: 0.32,
  metalness: 0.04,
  clearcoat: 0.42,
  clearcoatRoughness: 0.36,
  sheen: 0.58,
  sheenRoughness: 0.62,
  sheenColor: "#f0e4ff",
} as const;
