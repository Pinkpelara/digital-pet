import { formatPrice } from "@/lib/format";
import { brand } from "@/lib/brand";
import type { CatalogItem } from "@/lib/types";

/** Featured homepage shop line. If you cannot see it in a second, it does not belong here. */
export const FEATURED_SHOP_IDS = ["outfit-raincoat", "gadget-umbrella"] as const;

/** Toy-first names on shop cards and PDPs. Radial / studio may still say Teach X. */
export function shopTitle(item: CatalogItem): string {
  return item.name;
}

/**
 * Adopt Me / Eilik rule: gadgets sell only when silhouette or motion changes in under a second.
 * Outfits and skills use their own flags. Explicit `shopSafe: false` always blocks checkout.
 */
export function isShopSafe(item: CatalogItem): boolean {
  if (item.shopSafe === false) return false;
  if (item.kind === "gadget") return item.shopSafe === true;
  return true;
}

/** Unified PDP checkout label: Adopt / Add + name — price. Shop stays toy-first. */
export function pdpCtaLabel(item: CatalogItem): string {
  const price = formatPrice(item.priceCents);
  if (item.kind === "companion") return `Adopt ${item.name} — ${price}`;
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
        lede: brand.meetBody,
      };
    case "outfit":
      return {
        title: "Closet",
        lede: "Raincoat. Visible in a second. Birthday and the day they notice you stay free — we sell the coat, not the cake.",
      };
    case "gadget":
      return {
        title: "Gadgets",
        lede: brand.shopBody,
      };
    case "skill":
      return {
        title: "Skills",
        lede: "Teach lives in the radial. Preview tricks until the motion is unmistakable. Shop what you can see: Raincoat · Pocket Umbrella.",
      };
    case "drop":
      return {
        title: "Collections & drops",
        lede: "Coordinated sets and short seasonal windows. When a drop closes, it closes.",
      };
  }
}
