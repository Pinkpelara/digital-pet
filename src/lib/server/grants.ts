import { companions, items } from "@/data/catalog";
import { newCompanionInstance } from "@/lib/state/grant-demo";
import type { CompanionInstance, Discovery, OwnershipRecord } from "@/lib/types";

type GrantInput = {
  userId: string;
  itemIds: string[];
  source: OwnershipRecord["source"];
  stripeEventId?: string;
};

type GrantResult = {
  alreadyGranted: boolean;
  ownership: OwnershipRecord[];
  instances: CompanionInstance[];
  discoveries: Discovery[];
};

type Store = {
  ownership: Map<string, OwnershipRecord>;
  instances: Map<string, CompanionInstance>;
  discoveries: Map<string, Discovery>;
  processedEvents: Set<string>;
};

const globalStore = globalThis as typeof globalThis & { __companionsGrants?: Store };

function store(): Store {
  if (!globalStore.__companionsGrants) {
    globalStore.__companionsGrants = {
      ownership: new Map(),
      instances: new Map(),
      discoveries: new Map(),
      processedEvents: new Set(),
    };
  }
  return globalStore.__companionsGrants;
}

const ownership = () => store().ownership;
const instances = () => store().instances;
const discoveries = () => store().discoveries;
const processedEvents = () => store().processedEvents;

function keyFor(userId: string, itemId: string): string {
  return `${userId}:${itemId}`;
}

export function listOwnership(userId: string): OwnershipRecord[] {
  return [...ownership().values()].filter((row) => row.userId === userId);
}

export function listInstances(userId: string): CompanionInstance[] {
  return [...instances().values()].filter((row) => row.userId === userId);
}

export function listDiscoveries(userId: string): Discovery[] {
  return [...discoveries().values()].filter((row) => row.userId === userId);
}

export function getInstance(id: string): CompanionInstance | undefined {
  return instances().get(id);
}

export function saveInstance(instance: CompanionInstance): CompanionInstance {
  instances().set(instance.id, instance);
  return instance;
}

export function grantOwnership(input: GrantInput): GrantResult {
  if (input.stripeEventId && processedEvents().has(input.stripeEventId)) {
    return {
      alreadyGranted: true,
      ownership: listOwnership(input.userId),
      instances: listInstances(input.userId),
      discoveries: listDiscoveries(input.userId),
    };
  }

  const granted: OwnershipRecord[] = [];
  const newDiscoveries: Discovery[] = [];

  for (const itemId of input.itemIds) {
    const item = items.find((entry) => entry.id === itemId);
    if (!item || !item.active) continue;

    const existing = ownership().get(keyFor(input.userId, itemId));
    if (existing) continue;

    const record: OwnershipRecord = {
      id: crypto.randomUUID(),
      userId: input.userId,
      itemId,
      source: input.source,
      stripeEventId: input.stripeEventId,
      grantedAt: new Date().toISOString(),
    };
    ownership().set(keyFor(input.userId, itemId), record);
    granted.push(record);

    if (item.kind === "companion" && item.speciesId) {
      const species = companions.find((entry) => entry.id === item.speciesId);
      if (species) {
        const instance = newCompanionInstance(species.id, record.id, input.userId);
        instances().set(instance.id, instance);
        const discovery: Discovery = {
          id: crypto.randomUUID(),
          userId: input.userId,
          instanceId: instance.id,
          kind: "arrived",
          note: `${species.name} climbed out of a parcel.`,
          createdAt: record.grantedAt,
        };
        discoveries().set(discovery.id, discovery);
        newDiscoveries.push(discovery);
      }
    }
  }

  // Skills are taught to every companion the user owns; nothing edits personality.
  const userInstances = listInstances(input.userId);
  for (const itemId of input.itemIds) {
    const item = items.find((entry) => entry.id === itemId);
    if (!item?.skillId) continue;
    for (const instance of userInstances) {
      if (!instance.unlockedSkills.includes(item.skillId)) {
        instance.unlockedSkills = [...instance.unlockedSkills, item.skillId];
        instances().set(instance.id, instance);
      }
    }
  }

  if (input.stripeEventId) processedEvents().add(input.stripeEventId);

  return {
    alreadyGranted: granted.length === 0 && Boolean(input.stripeEventId),
    ownership: listOwnership(input.userId),
    instances: listInstances(input.userId),
    discoveries: listDiscoveries(input.userId),
  };
}

export function replaceUserState(input: {
  userId: string;
  ownership: OwnershipRecord[];
  instances: CompanionInstance[];
}): void {
  for (const [key, row] of ownership()) {
    if (row.userId === input.userId) ownership().delete(key);
  }
  for (const [key, row] of instances()) {
    if (row.userId === input.userId) instances().delete(key);
  }
  for (const row of input.ownership) ownership().set(keyFor(row.userId, row.itemId), row);
  for (const row of input.instances) instances().set(row.id, row);
}
