"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { items } from "@/data/catalog";
import { track } from "@/lib/analytics";
import { emptyNest, readNest, writeNest, type PersistedNest } from "@/lib/state/storage";
import type {
  CompanionInstance,
  DemoUser,
  EquipSlot,
  OwnershipRecord,
  SkillId,
} from "@/lib/types";

type NestContextValue = PersistedNest & {
  hydrated: boolean;
  ownedItemIds: Set<string>;
  owns: (itemId: string) => boolean;
  signInDemo: (user?: Partial<DemoUser>) => DemoUser;
  signOut: () => void;
  applyGrant: (input: { user: DemoUser; ownership: OwnershipRecord[]; instances: CompanionInstance[] }) => void;
  saveOutfit: (instanceId: string, equipped: CompanionInstance["equipped"]) => void;
  renameCompanion: (instanceId: string, name: string) => void;
  setCreaturesEnabled: (enabled: boolean) => void;
  previewItem: (itemId: string) => { slot?: EquipSlot; skillId?: SkillId } | undefined;
};

const NestContext = createContext<NestContextValue | null>(null);

const demoUser = (): DemoUser => ({
  id: "demo-user",
  email: "you@sillkin.local",
  displayName: "Explorer",
  publicId: "sill-42",
  provider: "demo",
});

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", listener);
    }
  };
}

let snapshotCache: { raw: string; value: PersistedNest } | null = null;

function persist(next: PersistedNest) {
  writeNest(next);
  snapshotCache = { raw: JSON.stringify(next), value: next };
  emit();
}

function getSnapshot(): PersistedNest {
  const stored = readNest();
  const raw = JSON.stringify(stored);
  if (snapshotCache && snapshotCache.raw === raw) return snapshotCache.value;
  snapshotCache = { raw, value: stored };
  return stored;
}

export function NestProvider({ children }: { children: React.ReactNode }) {
  const nest = useSyncExternalStore(subscribe, getSnapshot, emptyNest);

  const update = useCallback((recipe: (prev: PersistedNest) => PersistedNest) => {
    persist(recipe(getSnapshot()));
  }, []);

  const ownedItemIds = useMemo(() => new Set(nest.ownership.map((row) => row.itemId)), [nest.ownership]);

  const signInDemo = useCallback((user?: Partial<DemoUser>) => {
    const next = { ...demoUser(), ...user };
    update((prev) => ({ ...prev, user: next }));
    track("auth_started", { provider: next.provider });
    return next;
  }, [update]);

  const signOut = useCallback(() => {
    update((prev) => ({ ...prev, user: null }));
  }, [update]);

  const applyGrant = useCallback(
    (input: { user: DemoUser; ownership: OwnershipRecord[]; instances: CompanionInstance[] }) => {
      update((prev) => {
        const ownershipByItem = new Map(prev.ownership.map((row) => [row.itemId, row]));
        for (const row of input.ownership) ownershipByItem.set(row.itemId, row);
        const instanceById = new Map(prev.instances.map((row) => [row.id, row]));
        for (const row of input.instances) instanceById.set(row.id, row);
        return {
          ...prev,
          user: input.user,
          ownership: [...ownershipByItem.values()],
          instances: [...instanceById.values()],
        };
      });
    },
    [update],
  );

  const saveOutfit = useCallback((instanceId: string, equipped: CompanionInstance["equipped"]) => {
    update((prev) => ({
      ...prev,
      instances: prev.instances.map((row) => (row.id === instanceId ? { ...row, equipped } : row)),
    }));
    track("outfit_saved", { instanceId });
  }, [update]);

  const renameCompanion = useCallback((instanceId: string, name: string) => {
    update((prev) => ({
      ...prev,
      instances: prev.instances.map((row) => (row.id === instanceId ? { ...row, name } : row)),
    }));
    track("companion_named", { instanceId });
  }, [update]);

  const setCreaturesEnabled = useCallback((enabled: boolean) => {
    update((prev) => ({ ...prev, creaturesEnabled: enabled }));
    track("creatures_paused", { enabled });
  }, [update]);

  const value = useMemo<NestContextValue>(
    () => ({
      ...nest,
      hydrated: true,
      ownedItemIds,
      owns: (itemId: string) => ownedItemIds.has(itemId),
      signInDemo,
      signOut,
      applyGrant,
      saveOutfit,
      renameCompanion,
      setCreaturesEnabled,
      previewItem: (itemId: string) => {
        const item = items.find((entry) => entry.id === itemId);
        if (!item) return undefined;
        return { slot: item.slot, skillId: item.skillId };
      },
    }),
    [applyGrant, nest, ownedItemIds, renameCompanion, saveOutfit, setCreaturesEnabled, signInDemo, signOut],
  );

  return <NestContext.Provider value={value}>{children}</NestContext.Provider>;
}

export function useNest(): NestContextValue {
  const value = useContext(NestContext);
  if (!value) throw new Error("useNest must be used within NestProvider");
  return value;
}
