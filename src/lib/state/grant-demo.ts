import { companions, items } from "@/data/catalog";
import { applyTendencies, randomSeed, statsFromSeed } from "@/lib/personality";
import type {
  CompanionInstance,
  DemoUser,
  EquipmentLoadout,
  OwnershipRecord,
  SkillId,
  SpeciesId,
} from "@/lib/types";
import type { PersistedNest } from "@/lib/state/storage";

export const demoUser = (): DemoUser => ({
  id: "demo-user",
  email: "you@companions.local",
  displayName: "Explorer",
  publicId: "cmp-42",
  provider: "demo",
});

/**
 * A new individual. Species tendencies shape the seed; the seed stays hidden.
 * You find out who they are by living with them — the site does not label them on day one.
 */
export function newCompanionInstance(
  speciesId: CompanionInstance["speciesId"],
  ownershipId: string,
  userId: string,
  name?: string,
): CompanionInstance {
  const species = companions.find((entry) => entry.id === speciesId) ?? companions[0];
  const seed = applyTendencies(randomSeed(), species.tendencies);
  const at = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    userId,
    speciesId: species.id,
    ownershipId,
    name: name ?? species.name,
    publicId: `cmp-${Math.random().toString(36).slice(2, 7)}`,
    seed,
    stats: statsFromSeed(seed),
    equipped: {},
    unlockedSkills: [...species.nativeSkills],
    discovered: [],
    counters: {},
    secrets: [],
    favouriteSpot: null,
    bonds: [],
    createdAt: at,
  };
}

export type GrantOptions = {
  instanceId?: string;
  species?: SpeciesId;
};

function companionSku(species: SpeciesId): string | undefined {
  return items.find((entry) => entry.kind === "companion" && entry.speciesId === species && entry.active)?.id;
}

/**
 * Buying, gifting, or trying-on writes ownership AND puts the new slotted
 * things on a living companion. An empty nest gets Bloop so "it's theirs"
 * has someone to belong to. Existing outfits are merged, not replaced.
 */
export function grantItemsLocally(
  prev: PersistedNest,
  itemIds: string[],
  source: OwnershipRecord["source"] = "purchase",
  opts: GrantOptions = {},
): PersistedNest {
  const user = prev.user ?? demoUser();
  const ownershipByItem = new Map(prev.ownership.map((row) => [row.itemId, row]));
  const instanceById = new Map(prev.instances.map((row) => [row.id, row]));
  const createdIds: string[] = [];

  const adopt = (itemId: string, itemSource: OwnershipRecord["source"]) => {
    const item = items.find((entry) => entry.id === itemId && entry.active);
    if (!item) return;
    if (!ownershipByItem.has(itemId)) {
      ownershipByItem.set(itemId, {
        id: crypto.randomUUID(),
        userId: user.id,
        itemId,
        source: itemSource,
        grantedAt: new Date().toISOString(),
      });
    }
    if (item.kind === "companion" && item.speciesId) {
      // Every adoption is a new individual. Two Bloops are two different
      // creatures with different hidden personalities — that is the point.
      const ownership = ownershipByItem.get(itemId)!;
      const instance = newCompanionInstance(item.speciesId, ownership.id, user.id);
      instanceById.set(instance.id, instance);
      createdIds.push(instance.id);
    }
  };

  for (const itemId of itemIds) adopt(itemId, source);

  const gear: CompanionInstance["equipped"] = {};
  let needsResident = false;
  for (const itemId of itemIds) {
    const item = items.find((entry) => entry.id === itemId);
    if (item?.slot) {
      gear[item.slot] = item.id;
      needsResident = true;
    }
    if (item?.skillId) needsResident = true;
  }

  if (needsResident && instanceById.size === 0) {
    const sku = companionSku(opts.species ?? "bloop") ?? "companion-bloop";
    adopt(sku, "demo");
  }

  const raw = [...instanceById.values()].map((instance) => {
    let next = instance;
    for (const itemId of itemIds) {
      const item = items.find((entry) => entry.id === itemId);
      if (item?.skillId && !next.unlockedSkills.includes(item.skillId)) {
        next = { ...next, unlockedSkills: [...next.unlockedSkills, item.skillId as SkillId] };
      }
    }
    return next;
  });

  const target =
    (opts.instanceId ? raw.find((row) => row.id === opts.instanceId) : undefined) ??
    (createdIds[0] ? raw.find((row) => row.id === createdIds[0]) : undefined) ??
    raw[0];

  const hasGear = Object.keys(gear).length > 0;
  const instances = raw.map((instance) => {
    if (!hasGear || !target || instance.id !== target.id) return instance;
    return { ...instance, equipped: { ...instance.equipped, ...gear } };
  });

  return {
    ...prev,
    user,
    ownership: [...ownershipByItem.values()],
    instances,
  };
}

/** Try-on / wheel equip: grant the loadout and leave it on them. Empty loadout is a no-op. */
export function claimAndEquip(
  prev: PersistedNest,
  loadout: EquipmentLoadout,
  opts: GrantOptions & { source?: OwnershipRecord["source"] } = {},
): PersistedNest {
  const itemIds = Object.values(loadout).filter((id): id is string => Boolean(id));
  if (itemIds.length === 0) return prev;
  return grantItemsLocally(prev, itemIds, opts.source ?? "demo", opts);
}
