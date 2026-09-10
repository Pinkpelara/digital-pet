import type { CatalogItem } from "@/lib/types";

export function hrefForItem(item: CatalogItem): string {
  if (item.kind === "companion") return `/companions/${item.slug}`;
  return `/item/${item.slug}`;
}

export function studioHref(id: string): string {
  return `/my-companions/studio?id=${encodeURIComponent(id)}`;
}

export function liveHref(instanceId?: string): string {
  if (!instanceId) return "/live";
  return `/live?id=${encodeURIComponent(instanceId)}`;
}

export function adoptHref(itemIds: string[]): string {
  return `/adopt/success?items=${itemIds.join(",")}`;
}

export function categoryCopy(kind: CatalogItem["kind"]): { title: string; lede: string } {
  switch (kind) {
    case "companion":
      return {
        title: "Companions",
        lede: "Adopt a creature. They live in your account — not as a file, as a someone.",
      };
    case "outfit":
      return {
        title: "Closet",
        lede: "Raincoats, hoodies, sunglasses, seasonal knit. Equip it and they wear it.",
      };
    case "gadget":
      return {
        title: "Gadgets",
        lede: "Tools that unlock behaviours. An umbrella is not just an umbrella.",
      };
    case "skill":
      return {
        title: "Skills",
        lede: "Moonwalk, cartwheel, climb, hide. Teach a trick. Watch it stick.",
      };
    case "personality":
      return {
        title: "Personality packs",
        lede: "Shift the odds. Chaotic, sleepy, clingy — transparent prices, no loot boxes.",
      };
    case "drop":
      return {
        title: "Limited drops",
        lede: "Short windows. Fixed prices. When they leave the sill, they leave.",
      };
  }
}
