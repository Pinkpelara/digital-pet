import { items as seedItems, companions as seedCompanions } from "@/data/catalog";
import type { CatalogItem, CompanionSpecies } from "@/lib/types";

const overlay = new Map<string, CatalogItem>();
let created: CatalogItem[] = [];

export function getItems(): CatalogItem[] {
  const merged = seedItems.map((item) => overlay.get(item.id) ?? item);
  const extras = created.filter((item) => !seedItems.some((seed) => seed.id === item.id));
  return [...merged, ...extras].filter((item) => item.active !== undefined);
}

export function getActiveItems(): CatalogItem[] {
  return getItems().filter((item) => item.active);
}

export function getCompanions(): CompanionSpecies[] {
  return seedCompanions;
}

export function getItem(id: string): CatalogItem | undefined {
  return getItems().find((item) => item.id === id);
}

export function upsertItem(patch: Partial<CatalogItem> & { id: string }): CatalogItem {
  const current = getItem(patch.id);
  const next: CatalogItem = {
    id: patch.id,
    sku: patch.sku ?? current?.sku ?? `sku-${patch.id}`,
    slug: patch.slug ?? current?.slug ?? patch.id,
    kind: patch.kind ?? current?.kind ?? "outfit",
    name: patch.name ?? current?.name ?? "Untitled",
    tagline: patch.tagline ?? current?.tagline ?? "",
    description: patch.description ?? current?.description ?? "",
    priceCents: patch.priceCents ?? current?.priceCents ?? 99,
    currency: "usd",
    slot: patch.slot ?? current?.slot,
    skillId: patch.skillId ?? current?.skillId,
    personalityId: patch.personalityId ?? current?.personalityId,
    speciesId: patch.speciesId ?? current?.speciesId,
    limited: patch.limited ?? current?.limited,
    limitedNote: patch.limitedNote ?? current?.limitedNote,
    unlocksBehavior: patch.unlocksBehavior ?? current?.unlocksBehavior,
    looksGoodWith: patch.looksGoodWith ?? current?.looksGoodWith ?? [],
    compatibleSpecies: patch.compatibleSpecies ?? current?.compatibleSpecies,
    accent: patch.accent ?? current?.accent ?? "#3DB8B0",
    riveSrc: patch.riveSrc ?? current?.riveSrc,
    active: patch.active ?? current?.active ?? true,
  };

  if (seedItems.some((item) => item.id === next.id) || overlay.has(next.id)) {
    overlay.set(next.id, next);
  } else if (created.some((item) => item.id === next.id)) {
    created = created.map((item) => (item.id === next.id ? next : item));
  } else {
    created = [...created, next];
  }
  return next;
}

export function archiveItem(id: string): CatalogItem | undefined {
  const item = getItem(id);
  if (!item) return undefined;
  return upsertItem({ ...item, active: false });
}
