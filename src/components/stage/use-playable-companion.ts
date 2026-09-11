"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { ambientPlaylist, patReaction } from "@/lib/ambient";
import {
  demoDurationMs,
  loadoutForAction,
  moodFromDemo,
  skillFromDemo,
  wheelForCompanion,
  type ResolvedWheelItem,
} from "@/lib/demo-actions";
import { grantBalloonBunch, markPresenceInteract } from "@/lib/state/presence";
import { useNest } from "@/lib/state/nest-context";
import type {
  CreatureMood,
  DemoActionId,
  EquipmentLoadout,
  PersonalitySeed,
  SkillId,
  SpeciesId,
} from "@/lib/types";

export function usePlayableCompanion(input: {
  species: SpeciesId;
  equipped?: EquipmentLoadout;
  unlockedSkills?: SkillId[];
  instanceId?: string;
  seed?: PersonalitySeed;
  persistEquip?: boolean;
  holdAction?: DemoActionId | null;
}) {
  const nest = useNest();
  const [open, setOpen] = useState(false);
  const [demo, setDemo] = useState<DemoActionId | null>(null);
  const [demoEquip, setDemoEquip] = useState<EquipmentLoadout>({});
  const [ambientIndex, setAmbientIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const lastAt = useRef(0);
  const demoTimer = useRef<number | null>(null);

  const instance = nest.instances.find((row) => row.id === input.instanceId) ?? nest.instances[0];
  const seed = input.seed ?? instance?.seed;
  const baseEquip = useMemo(
    () => input.equipped ?? instance?.equipped ?? {},
    [input.equipped, instance?.equipped],
  );

  const playlist = useMemo(
    () => ambientPlaylist(input.species, seed, baseEquip),
    [baseEquip, input.species, seed],
  );
  const beat = playlist[ambientIndex % playlist.length] ?? playlist[0];

  const wheel = useMemo(
    () =>
      wheelForCompanion({
        species: input.species,
        ownedItemIds: nest.ownedItemIds,
        unlockedSkills: input.unlockedSkills ?? instance?.unlockedSkills,
        equipped: baseEquip,
      }),
    [baseEquip, input.species, input.unlockedSkills, instance?.unlockedSkills, nest.ownedItemIds],
  );

  const equipped = useMemo(
    () => ({ ...baseEquip, ...demoEquip }),
    [baseEquip, demoEquip],
  );

  const userBusy = held || Boolean(input.holdAction) || Boolean(demo) || open;
  const liveAction = input.holdAction ?? demo ?? (userBusy ? null : beat?.action ?? null);
  const mood: CreatureMood = liveAction
    ? moodFromDemo(liveAction)
    : userBusy
      ? "happy"
      : (beat?.mood ?? "idle");
  const skill: SkillId | null = skillFromDemo(liveAction);

  const poke = useCallback(() => {
    lastAt.current = Date.now();
    markPresenceInteract();
  }, []);

  const persistIfOwned = useCallback(
    (loadout: EquipmentLoadout) => {
      if (!input.persistEquip) return;
      const target = input.instanceId ?? instance?.id;
      if (!target) return;
      const next = { ...baseEquip };
      for (const [slot, itemId] of Object.entries(loadout)) {
        if (!itemId) continue;
        if (nest.owns(itemId)) next[slot as keyof EquipmentLoadout] = itemId;
      }
      nest.saveOutfit(target, next);
    },
    [baseEquip, input.instanceId, input.persistEquip, instance?.id, nest],
  );

  const toggleWheel = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) track("action_wheel_opened", { species: input.species });
      return next;
    });
    poke();
  }, [input.species, poke]);

  const closeWheel = useCallback(() => setOpen(false), []);

  const play = useCallback(
    (item: ResolvedWheelItem) => {
      poke();
      setOpen(false);
      setHeld(true);
      setDemo(item.action);
      setDemoEquip(item.equip);
      persistIfOwned(item.equip);
      track("demo_played", { action: item.action, itemId: item.itemId, preview: item.preview });
      if (item.action === "party" || item.action === "balloon-bunch") grantBalloonBunch();
      if (demoTimer.current) window.clearTimeout(demoTimer.current);
      const duration = demoDurationMs(item.action) || 4200;
      demoTimer.current = window.setTimeout(() => {
        setDemo(null);
        setDemoEquip({});
        setHeld(false);
      }, duration);
    },
    [persistIfOwned, poke],
  );

  const applyExternal = useCallback(
    (action: DemoActionId, loadout?: EquipmentLoadout) => {
      const item = wheel.find((row) => row.action === action);
      if (item) {
        play(item);
        return;
      }
      poke();
      setHeld(true);
      setDemo(action);
      const gear = loadout ?? loadoutForAction(null, action);
      setDemoEquip(gear);
      persistIfOwned(gear);
      if (action === "party" || action === "balloon-bunch") grantBalloonBunch();
      if (demoTimer.current) window.clearTimeout(demoTimer.current);
      const duration = demoDurationMs(action) || 4200;
      demoTimer.current = window.setTimeout(() => {
        setDemo(null);
        setDemoEquip({});
        setHeld(false);
      }, duration);
    },
    [persistIfOwned, play, poke, wheel],
  );

  const pat = useCallback(() => {
    poke();
    setHeld(true);
    const reaction = patReaction(input.species);
    setDemo(reaction.action);
    if (demoTimer.current) window.clearTimeout(demoTimer.current);
    demoTimer.current = window.setTimeout(() => {
      setDemo(null);
      setHeld(false);
    }, reaction.ms);
  }, [input.species, poke]);

  useEffect(() => {
    if (userBusy || input.holdAction) return;
    const timer = window.setTimeout(() => {
      setAmbientIndex((current) => current + 1);
    }, beat?.ms ?? 10000);
    return () => window.clearTimeout(timer);
  }, [beat?.ms, input.holdAction, userBusy]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return {
    wheel,
    open,
    demo: liveAction,
    equipped,
    mood,
    skill,
    sulk: false,
    caption: liveAction ? (wheel.find((row) => row.action === liveAction)?.caption ?? "") : "",
    followPointer: mood === "follow" || mood === "idle" || mood === "happy",
    toggleWheel,
    closeWheel,
    play,
    applyExternal,
    poke,
    pat,
  };
}
