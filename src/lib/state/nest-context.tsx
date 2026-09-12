"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { items } from "@/data/catalog";
import { track } from "@/lib/analytics";
import { revealNextTrait } from "@/lib/personality";
import { claimAndEquip, demoUser, grantItemsLocally, type GrantOptions } from "@/lib/state/grant-demo";
import { emptyNest, readNest, writeNest, EMPTY_NEST, type PersistedNest } from "@/lib/state/storage";
import { useClientMounted } from "@/lib/state/use-client-mounted";
import type {
  BehaviourCounters,
  CompanionInstance,
  DemoUser,
  EquipmentLoadout,
  EquipSlot,
  OwnershipRecord,
  PersonalityLabel,
  SkillId,
} from "@/lib/types";

type NestContextValue = PersistedNest & {
  hydrated: boolean;
  ownedItemIds: Set<string>;
  owns: (itemId: string) => boolean;
  signInDemo: (user?: Partial<DemoUser>) => DemoUser;
  signOut: () => void;
  applyGrant: (input: { user: DemoUser; ownership: OwnershipRecord[]; instances: CompanionInstance[] }) => void;
  grantItems: (itemIds: string[], source?: OwnershipRecord["source"], opts?: GrantOptions) => CompanionInstance[];
  claimAndEquip: (loadout: EquipmentLoadout, opts?: GrantOptions & { source?: OwnershipRecord["source"] }) => CompanionInstance | null;
  saveOutfit: (instanceId: string, equipped: CompanionInstance["equipped"]) => void;
  renameCompanion: (instanceId: string, name: string) => void;
  /** Called when a behaviour is observed. May unlock a personality label. */
  recordBehaviour: (instanceId: string, kind: keyof BehaviourCounters) => PersonalityLabel | null;
  discoverSecret: (instanceId: string, secretId: string) => void;
  /** Notice another companion. Bonds strengthen from living together. */
  noteBond: (instanceId: string, otherId: string) => void;
  setFavouriteSpot: (instanceId: string, spot: string) => void;
  setCreaturesEnabled: (enabled: boolean) => void;
  previewItem: (itemId: string) => { slot?: EquipSlot; skillId?: SkillId } | undefined;
};

const NestContext = createContext<NestContextValue | null>(null);

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
  const wrote = writeNest(next);
  if (!wrote) {
    snapshotCache = null;
    emit();
    return;
  }
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
  const live = useSyncExternalStore(subscribe, getSnapshot, emptyNest);
  const hydrated = useClientMounted();
  const nest = hydrated ? live : EMPTY_NEST;

  const update = useCallback((recipe: (prev: PersistedNest) => PersistedNest) => {
    persist(recipe(getSnapshot()));
  }, []);

  const patchInstance = useCallback(
    (instanceId: string, recipe: (instance: CompanionInstance) => CompanionInstance) => {
      update((prev) => ({
        ...prev,
        instances: prev.instances.map((row) => (row.id === instanceId ? recipe(row) : row)),
      }));
    },
    [update],
  );

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

  const grantItems = useCallback(
    (itemIds: string[], source: OwnershipRecord["source"] = "purchase", opts?: GrantOptions) => {
      persist(grantItemsLocally(getSnapshot(), itemIds, source, opts));
      track("purchase_granted", { itemIds: itemIds.join(",") });
      return getSnapshot().instances;
    },
    [],
  );

  const claimGear = useCallback((loadout: EquipmentLoadout, opts?: GrantOptions & { source?: OwnershipRecord["source"] }) => {
    persist(claimAndEquip(getSnapshot(), loadout, opts));
    const live = getSnapshot();
    const id = opts?.instanceId;
    const resident = (id && live.instances.find((row) => row.id === id)) || live.instances[0] || null;
    if (resident) track("outfit_saved", { instanceId: resident.id });
    return resident;
  }, []);

  const saveOutfit = useCallback((instanceId: string, equipped: CompanionInstance["equipped"]) => {
    update((prev) => {
      if (!prev.instances.some((row) => row.id === instanceId)) return prev;
      return {
        ...prev,
        instances: prev.instances.map((row) => (row.id === instanceId ? { ...row, equipped } : row)),
      };
    });
    track("outfit_saved", { instanceId });
  }, [update]);

  const renameCompanion = useCallback((instanceId: string, name: string) => {
    update((prev) => ({
      ...prev,
      instances: prev.instances.map((row) => (row.id === instanceId ? { ...row, name } : row)),
    }));
    track("companion_named", { instanceId });
  }, [update]);

  const recordBehaviour = useCallback(
    (instanceId: string, kind: keyof BehaviourCounters) => {
      let revealed: PersonalityLabel | null = null;
      update((prev) => ({
        ...prev,
        instances: prev.instances.map((row) => {
          if (row.id !== instanceId) return row;
          const counters: BehaviourCounters = {
            ...row.counters,
            [kind]: (row.counters[kind] ?? 0) + 1,
          };
          const next = revealNextTrait(row.seed, row.discovered, counters);
          if (next) {
            revealed = next.label;
            track("personality_revealed", { instanceId, label: next.label });
            return { ...row, counters, discovered: [...row.discovered, next] };
          }
          return { ...row, counters };
        }),
      }));
      return revealed;
    },
    [update],
  );

  const discoverSecret = useCallback(
    (instanceId: string, secretId: string) => {
      patchInstance(instanceId, (row) =>
        row.secrets.some((entry) => entry.id === secretId)
          ? row
          : { ...row, secrets: [...row.secrets, { id: secretId, at: new Date().toISOString() }] },
      );
    },
    [patchInstance],
  );

  const setFavouriteSpot = useCallback(
    (instanceId: string, spot: string) => {
      patchInstance(instanceId, (row) => ({ ...row, favouriteSpot: spot }));
    },
    [patchInstance],
  );

  const noteBond = useCallback(
    (instanceId: string, otherId: string) => {
      if (instanceId === otherId) return;
      patchInstance(instanceId, (row) => {
        const existing = row.bonds.find((entry) => entry.otherInstanceId === otherId);
        if (!existing) {
          return {
            ...row,
            bonds: [...row.bonds, { otherInstanceId: otherId, kind: "curious-about", strength: 1 }],
          };
        }
        const strength = Math.min(10, existing.strength + 1);
        return {
          ...row,
          bonds: row.bonds.map((entry) =>
            entry.otherInstanceId === otherId
              ? { ...entry, strength, kind: strength >= 5 ? "napping-together" : entry.kind }
              : entry,
          ),
        };
      });
    },
    [patchInstance],
  );

  const setCreaturesEnabled = useCallback((enabled: boolean) => {
    update((prev) => ({ ...prev, creaturesEnabled: enabled }));
    track("creatures_paused", { enabled });
  }, [update]);

  const value = useMemo<NestContextValue>(
    () => ({
      ...nest,
      hydrated,
      ownedItemIds,
      owns: (itemId: string) => ownedItemIds.has(itemId),
      signInDemo,
      signOut,
      applyGrant,
      grantItems,
      claimAndEquip: claimGear,
      saveOutfit,
      renameCompanion,
      recordBehaviour,
      discoverSecret,
      setFavouriteSpot,
      noteBond,
      setCreaturesEnabled,
      previewItem: (itemId: string) => {
        const item = items.find((entry) => entry.id === itemId);
        if (!item) return undefined;
        return { slot: item.slot, skillId: item.skillId };
      },
    }),
    [
      applyGrant,
      claimGear,
      discoverSecret,
      grantItems,
      hydrated,
      nest,
      ownedItemIds,
      recordBehaviour,
      renameCompanion,
      saveOutfit,
      noteBond,
      setCreaturesEnabled,
      setFavouriteSpot,
      signInDemo,
      signOut,
    ],
  );

  return <NestContext.Provider value={value}>{children}</NestContext.Provider>;
}

export function useNest(): NestContextValue {
  const value = useContext(NestContext);
  if (!value) throw new Error("useNest must be used within NestProvider");
  return value;
}
