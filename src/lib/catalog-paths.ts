import { formatPrice } from "@/lib/format";
import { brand } from "@/lib/brand";
import type { CatalogItem } from "@/lib/types";

/** Featured homepage shop line. If you cannot see it in a second, it does not belong here. */
export const FEATURED_SHOP_IDS = [
  "outfit-raincoat",
  "gadget-umbrella",
  "gadget-skateboard",
  "skill-moonwalk",
] as const;

/** Names-only shop headline. Full sentence lives in brand.shopBody. */
export const SHOP_NOW_NAMES = "Raincoat. Umbrella. Skateboard. Moonwalk.";

/** Available-now first, featured SKUs at the front of their kind. */
export function orderForShop(items: CatalogItem[]): CatalogItem[] {
  const featuredIndex = new Map<string, number>(FEATURED_SHOP_IDS.map((id, index) => [id, index]));
  return [...items].sort((a, b) => {
    const aFeatured = featuredIndex.get(a.id) ?? 100;
    const bFeatured = featuredIndex.get(b.id) ?? 100;
    if (aFeatured !== bFeatured) return aFeatured - bFeatured;
    return Number(isShopSafe(b)) - Number(isShopSafe(a));
  });
}

/** Visible names on shop cards and PDPs. Radial / studio may still say Teach X. */
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

/** Unified PDP checkout label: Adopt / Add + name — price. */
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

export function categoryCopy(kind: CatalogItem["kind"]): { kicker: string; title: string; lede: string } {
  switch (kind) {
    case "companion":
      return {
        kicker: "Meet them",
        title: "Companions",
        lede: brand.meetBody,
      };
    case "outfit":
      return {
        kicker: "Looks",
        title: "The closet",
        lede: "Changes how your pet looks. Nothing else. They are still themselves.",
      };
    case "gadget":
      return {
        kicker: "Watch what they do",
        title: "Gadgets",
        lede: "Unlocks new behavior. A skateboard means they skate. A camera means they take photos.",
      };
    case "skill":
      return {
        kicker: "Things you can teach them",
        title: "Skills",
        lede: "Tricks you teach once. Your pet knows them forever and does them on their own.",
      };
    case "drop":
      return {
        kicker: "Limited runs",
        title: "Collections & drops",
        lede: "Seasonal sets in short windows. When a drop closes, it closes.",
      };
  }
}
