import type { CompanionInstance, DemoUser, OwnershipRecord } from "@/lib/types";

const KEY = "sillkin.nest.v1";

export type PersistedNest = {
  user: DemoUser | null;
  ownership: OwnershipRecord[];
  instances: CompanionInstance[];
  creaturesEnabled: boolean;
};

export const emptyNest = (): PersistedNest => ({
  user: null,
  ownership: [],
  instances: [],
  creaturesEnabled: true,
});

export function readNest(): PersistedNest {
  if (typeof window === "undefined") return emptyNest();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyNest();
    const parsed = JSON.parse(raw) as PersistedNest;
    return {
      user: parsed.user ?? null,
      ownership: parsed.ownership ?? [],
      instances: parsed.instances ?? [],
      creaturesEnabled: parsed.creaturesEnabled ?? true,
    };
  } catch {
    return emptyNest();
  }
}

export function writeNest(nest: PersistedNest): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(nest));
}
