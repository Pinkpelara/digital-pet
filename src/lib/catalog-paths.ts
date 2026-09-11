import { formatPrice } from "@/lib/format";
import type { CatalogItem } from "@/lib/types";

/** Featured homepage shop line. If you cannot see it in a second, it does not belong here. */
export const FEATURED_SHOP_IDS = ["outfit-raincoat", "gadget-umbrella"] as const;

export function isShopSafe(item: CatalogItem): boolean {
  if (item.shopSafe === false) return false;
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
        lede: "New species to adopt. Every one arrives with a personality you did not pick.",
      };
    case "outfit":
      return {
        title: "Closet",
        lede: "Raincoats first. Clothing changes how they look, not who they are. Shop line: Yellow Raincoat · Pocket Umbrella.",
      };
    case "gadget":
      return {
        title: "Gadgets",
        lede: "Objects that change what they do. In the shop now: Pocket Umbrella. If you cannot see the trick in a second, we do not sell it yet.",
      };
    case "skill":
      return {
        title: "Skills",
        lede: "Teach them something. Skills stay in the catalog as previews until the motion is obvious in a second.",
      };
    case "drop":
      return {
        title: "Collections & drops",
        lede: "Coordinated sets and short seasonal windows. When a drop closes, it closes.",
      };
  }
}
