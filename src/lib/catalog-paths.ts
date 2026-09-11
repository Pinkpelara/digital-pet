import { formatPrice } from "@/lib/format";
import type { CatalogItem } from "@/lib/types";

/** Featured homepage shop line. If you cannot see it in a second, it does not belong here. */
export const FEATURED_SHOP_IDS = ["outfit-raincoat", "gadget-umbrella"] as const;

/**
 * Adopt Me / Eilik rule: gadgets sell only when silhouette or motion changes in under a second.
 * Outfits and Teach skills use their own flags. Explicit `shopSafe: false` always blocks checkout.
 */
export function isShopSafe(item: CatalogItem): boolean {
  if (item.shopSafe === false) return false;
  if (item.kind === "gadget") return item.shopSafe === true;
  return true;
}

/** Unified PDP checkout label: Adopt / Add / Teach + name — price. */
export function pdpCtaLabel(item: CatalogItem): string {
  const price = formatPrice(item.priceCents);
  if (item.kind === "companion") return `Adopt ${item.name} — ${price}`;
  if (item.kind === "skill") return `Teach ${item.name} — ${price}`;
  return `Add ${item.name} — ${price}`;
}

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
        lede: "Meet one individual. Every one arrives with a personality you did not pick — and cannot buy.",
      };
    case "outfit":
      return {
        title: "Closet",
        lede: "Outfits are permanent. Personality is not for sale. Birthday and habit magic stay free — we sell the coat they wear that day. Shop line: Yellow Raincoat · Pocket Umbrella.",
      };
    case "gadget":
      return {
        title: "Gadgets",
        lede: "If it does not change how they look or move in a second, it is not a gadget we sell. Watch the exaggerated demo. Shop now: Pocket Umbrella. Headphones and a party hat change the silhouette on contact.",
      };
    case "skill":
      return {
        title: "Skills",
        lede: "Teach moonwalk. Backward, smooth, slightly illegal. Teach skills stay yours. Personality is not for sale.",
      };
    case "drop":
      return {
        title: "Collections & drops",
        lede: "Coordinated sets and short seasonal windows. When a drop closes, it closes.",
      };
  }
}
