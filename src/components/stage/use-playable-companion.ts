"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import {
  demoDurationMs,
  loadoutForAction,
  moodFromDemo,
  wheelForCompanion,
  type ResolvedWheelItem,
} from "@/lib/demo-actions";
import { markPresenceInteract } from "@/lib/state/presence";
import { useNest } from "@/lib/state/nest-context";
import type { CreatureMood, DemoActionId, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

const SULK_AFTER_MS = 14000;

export function usePlayableCompanion(input: {
  species: SpeciesId;
  equipped?: EquipmentLoadout;
  unlockedSkills?: SkillId[];
}) {
  const nest = useNest();
  const [open, setOpen] = useState(false);
  const [demo, setDemo] = useState<DemoActionId | null>(null);
  const [demoEquip, setDemoEquip] = useState<EquipmentLoadout>({});
  const [sulk, setSulk] = useState(false);
  const [caption, setCaption] = useState("Tap them.");
  const lastAt = useRef(0);

  const wheel = useMemo(
    () =>
      wheelForCompanion({
        species: input.species,
        ownedItemIds: nest.ownedItemIds,
        unlockedSkills: input.unlockedSkills,
        equipped: input.equipped,
      }),
    [input.equipped, input.species, input.unlockedSkills, nest.ownedItemIds],
  );

  const equipped = useMemo(
    () => ({ ...input.equipped, ...demoEquip }),
    [demoEquip, input.equipped],
  );

  const mood: CreatureMood = sulk && !demo ? "idle" : moodFromDemo(demo);
  const skill: SkillId | null =
    demo === "moonwalk" ||
    demo === "cartwheel" ||
    demo === "climb" ||
    demo === "dance" ||
    demo === "hide" ||
    demo === "juggle" ||
    demo === "skate" ||
    demo === "nap"
      ? demo
      : null;

  const poke = useCallback(() => {
    lastAt.current = Date.now();
    markPresenceInteract();
    setSulk(false);
  }, []);

  const toggleWheel = useCallback(() => {
    poke();
    setOpen((prev) => {
      const next = !prev;
      if (next) track("action_wheel_opened", { species: input.species });
      return next;
    });
  }, [input.species, poke]);

  const closeWheel = useCallback(() => setOpen(false), []);
  const demoTimer = useRef<number | null>(null);

  const play = useCallback(
    (item: ResolvedWheelItem) => {
      poke();
      setOpen(false);
      setDemo(item.action);
      setDemoEquip(item.equip);
      setCaption(item.caption ?? item.label);
      track("demo_played", { action: item.action, itemId: item.itemId, preview: item.preview });
      if (demoTimer.current) window.clearTimeout(demoTimer.current);
      const duration = demoDurationMs(item.action);
      if (duration > 0) {
        demoTimer.current = window.setTimeout(() => {
          setDemo(null);
          setDemoEquip({});
        }, duration);
      }
    },
    [poke],
  );

  const applyExternal = useCallback(
    (action: DemoActionId, loadout?: EquipmentLoadout) => {
      const item = wheel.find((row) => row.action === action);
      if (item) {
        play(item);
        return;
      }
      poke();
      setDemo(action);
      setDemoEquip(loadout ?? loadoutForAction(null, action));
      if (demoTimer.current) window.clearTimeout(demoTimer.current);
      const duration = demoDurationMs(action);
      if (duration > 0) {
        demoTimer.current = window.setTimeout(() => {
          setDemo(null);
          setDemoEquip({});
        }, duration);
      }
    },
    [play, poke, wheel],
  );

  useEffect(() => {
    if (!lastAt.current) lastAt.current = Date.now();
    const timer = window.setInterval(() => {
      if (!lastAt.current) lastAt.current = Date.now();
      if (Date.now() - lastAt.current > SULK_AFTER_MS && !open) {
        setSulk(true);
        setCaption("They’re waiting.");
      }
    }, 1500);
    return () => window.clearInterval(timer);
  }, [open]);

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
    demo,
    equipped,
    mood,
    skill,
    sulk,
    caption,
    toggleWheel,
    closeWheel,
    play,
    applyExternal,
    poke,
  };
}
