import type { CatalogItem } from "@/lib/types";

export function hrefForItem(item: CatalogItem): string {
  if (item.kind === "companion") return `/companions/${item.slug}`;
  return `/item/${item.slug}`;
}

export function studioHref(id: string): string {
  return `/my-companions/studio?id=${encodeURIComponent(id)}`;
}

export function profileHref(id: string): string {
  return `/my-companions/profile?id=${encodeURIComponent(id)}`;
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
        lede: "New species to adopt. Every one arrives with a personality you did not pick.",
      };
    case "outfit":
      return {
        title: "Closet",
        lede: "Raincoats, hoodies, sunglasses. Clothing changes how they look, not who they are.",
      };
    case "gadget":
      return {
        title: "Gadgets",
        lede: "Objects that change what they do. A skateboard makes a skater. An umbrella makes a rain-walker.",
      };
    case "skill":
      return {
        title: "Skills",
        lede: "Teach them something. Teach moonwalk. Teach cartwheel. Teach climb. Fixed prices, yours permanently.",
      };
    case "drop":
      return {
        title: "Collections & drops",
        lede: "Coordinated sets and short seasonal windows. When a drop closes, it closes.",
      };
  }
}
