"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { moodDuration, pickMood } from "@/components/creatures/behavior";
import { patReaction } from "@/lib/ambient";
import { catalogById, companions, items } from "@/data/catalog";
import {
  demoDurationMs,
  loadoutForAction,
  moodFromDemo,
  skillFromDemo,
  wheelForCompanion,
  type ResolvedWheelItem,
} from "@/lib/demo-actions";
import { statsFromSeed } from "@/lib/personality";
import { markPresenceInteract } from "@/lib/state/presence";
import { useNest } from "@/lib/state/nest-context";
import type {
  BehaviourCounters,
  CatalogItem,
  CreatureMood,
  DemoActionId,
  EquipmentLoadout,
  PersonalitySeed,
  PersonalityStats,
  SkillId,
  SpeciesId,
} from "@/lib/types";

const GADGET_ACTION: Record<string, DemoActionId> = {
  "gadget-umbrella": "rain-walk",
  "gadget-camera": "photo-pose",
  "gadget-broom": "tidy",
  "gadget-balloon": "hover",
  "gadget-partyhat": "party",
  "gadget-headphones": "focus",
  "gadget-skateboard": "skate",
};

const BEHAVIOUR_FOR_MOOD: Partial<Record<CreatureMood, keyof BehaviourCounters>> = {
  nap: "napped",
  follow: "followedCursor",
  climb: "climbed",
  walk: "explored",
  hide: "hid",
};

const BEHAVIOUR_FOR_ACTION: Partial<Record<DemoActionId, keyof BehaviourCounters>> = {
  skate: "skated",
  "photo-pose": "photographed",
  climb: "climbed",
  nap: "napped",
  hide: "hid",
  dance: "played",
  moonwalk: "played",
  cartwheel: "played",
  juggle: "played",
  "balloon-bunch": "played",
  party: "played",
  tidy: "played",
  "rain-walk": "played",
  hover: "played",
  gift: "played",
  focus: "played",
};

const REPORT_GAP_MS = 4000;
const LOOPING_RUN_MS = 7000;

/** How long an action runs when the creature does it on its own. */
function oneShotMs(action: DemoActionId): number {
  const base = demoDurationMs(action);
  if (base > 0) return base;
  if (action === "nap") return 6500;
  if (action === "skate") return 4200;
  if (action === "rain-walk") return 4600;
  if (action === "hover" || action === "balloon-bunch") return 4200;
  if (action === "dance" || action === "party") return 4200;
  if (action === "tidy") return 4000;
  if (action === "focus") return 4600;
  if (action === "climb") return 3400;
  if (action === "hide") return 4200;
  return 4000;
}

/** What the creature might get up to on its own, using only what it has. */
function pickSpontaneous(
  skills: SkillId[] | undefined,
  equipped: EquipmentLoadout | undefined,
): { action: DemoActionId; item: CatalogItem | null; caption: string } | null {
  const candidates: Array<{ action: DemoActionId; item: CatalogItem | null; caption: string }> = [];

  for (const skillId of skills ?? []) {
    if (skillId === "chaos") continue;
    if (skillId === "skate" && equipped?.feet !== "gadget-skateboard") continue;
    const item = items.find((entry) => entry.skillId === skillId) ?? null;
    candidates.push({
      action: skillId as DemoActionId,
      item,
      caption: item?.behaviorNote ?? item?.tagline ?? "",
    });
  }

  for (const itemId of Object.values(equipped ?? {})) {
    if (!itemId) continue;
    const action = GADGET_ACTION[itemId];
    if (!action) continue;
    const item = catalogById.get(itemId) ?? null;
    if (item?.kind !== "gadget") continue;
    candidates.push({ action, item, caption: item.behaviorNote ?? item.tagline ?? "" });
  }

  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * The creature has a life between clicks. Moods come from its own hidden
 * personality; known tricks and carried gadgets happen on their own once in a
 * while. Nothing here punishes the visitor for not paying attention.
 */
export function usePlayableCompanion(input: {
  species: SpeciesId;
  equipped?: EquipmentLoadout;
  unlockedSkills?: SkillId[];
  /** This individual's hidden numbers. Falls back to the seed, then species defaults. */
  stats?: PersonalityStats;
  /** Called when the creature is observed doing something. Feeds discovery. */
  onBehaviour?: (kind: keyof BehaviourCounters) => void;
  instanceId?: string;
  seed?: PersonalitySeed;
  /** Save equipped looks back to the instance when the item is owned. */
  persistEquip?: boolean;
  /** An action held on by the caller (try-on rails, studio). */
  holdAction?: DemoActionId | null;
}) {
  const nest = useNest();
  const [open, setOpen] = useState(false);
  const [demo, setDemo] = useState<DemoActionId | null>(null);
  const [demoEquip, setDemoEquip] = useState<EquipmentLoadout>({});
  const [ambientMood, setAmbientMood] = useState<CreatureMood>("idle");
  const [caption, setCaption] = useState("");

  const instance = nest.instances.find((row) => row.id === input.instanceId) ?? nest.instances[0];
  const seed = input.seed ?? instance?.seed;
  const nestEquip = instance?.equipped;
  const overlay = input.equipped;
  const baseEquip = useMemo(() => {
    const saved = nestEquip ?? {};
    if (!overlay || Object.keys(overlay).length === 0) return saved;
    return { ...saved, ...overlay };
  }, [nestEquip, overlay]);
  const unlocked = input.unlockedSkills ?? instance?.unlockedSkills;

  const stats = useMemo(
    () =>
      input.stats ??
      (seed ? statsFromSeed(seed) : undefined) ??
      companions.find((entry) => entry.id === input.species)?.defaultStats ?? {
        chaos: 20,
        drama: 20,
        energy: 50,
        shy: 20,
        cling: 20,
        curiosity: 50,
      },
    [input.species, input.stats, seed],
  );

  const statsRef = useRef(stats);
  const skillsRef = useRef(unlocked);
  const equippedRef = useRef(baseEquip);
  const ambientMoodRef = useRef<CreatureMood>("idle");

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);
  useEffect(() => {
    skillsRef.current = unlocked;
  }, [unlocked]);
  useEffect(() => {
    equippedRef.current = baseEquip;
  }, [baseEquip]);
  useEffect(() => {
    ambientMoodRef.current = ambientMood;
  }, [ambientMood]);

  const onBehaviourRef = useRef(input.onBehaviour);
  useEffect(() => {
    onBehaviourRef.current = input.onBehaviour;
  }, [input.onBehaviour]);
  const lastReport = useRef(0);
  const report = useCallback((kind: keyof BehaviourCounters | undefined) => {
    if (!kind) return;
    const now = Date.now();
    if (now - lastReport.current < REPORT_GAP_MS) return;
    lastReport.current = now;
    onBehaviourRef.current?.(kind);
  }, []);

  const wheel = useMemo(
    () =>
      wheelForCompanion({
        species: input.species,
        ownedItemIds: nest.ownedItemIds,
        unlockedSkills: unlocked,
        equipped: baseEquip,
      }),
    [baseEquip, input.species, unlocked, nest.ownedItemIds],
  );

  const equipped = useMemo(
    () => ({ ...baseEquip, ...demoEquip }),
    [baseEquip, demoEquip],
  );

  const liveDemo = input.holdAction ?? demo;
  const mood: CreatureMood = liveDemo ? moodFromDemo(liveDemo) : ambientMood;
  const skill: SkillId | null = skillFromDemo(liveDemo);

  const poke = useCallback(() => {
    markPresenceInteract();
  }, []);

  const toggleWheel = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) track("action_wheel_opened", { species: input.species });
      return next;
    });
    poke();
  }, [input.species, poke]);

  const closeWheel = useCallback(() => setOpen(false), []);
  const demoTimer = useRef<number | null>(null);
  const untilRef = useRef(0);
  const moodSinceRef = useRef(0);
  const nextShowRef = useRef(0);

  const persistIfOwned = useCallback(
    (loadout: EquipmentLoadout) => {
      if (!input.persistEquip) return;
      if (!Object.values(loadout).some(Boolean)) return;
      nest.claimAndEquip(loadout, {
        instanceId: input.instanceId ?? instance?.id,
        species: input.species,
      });
    },
    [input.instanceId, input.persistEquip, input.species, instance?.id, nest],
  );

  const fireDemo = useCallback(
    (action: DemoActionId, item: CatalogItem | null, itemCaption: string, durationMs: number) => {
      setDemo(action);
      setDemoEquip(loadoutForAction(item, action));
      setCaption(itemCaption);
      report(BEHAVIOUR_FOR_ACTION[action]);
      if (demoTimer.current) window.clearTimeout(demoTimer.current);
      if (durationMs > 0) {
        demoTimer.current = window.setTimeout(() => {
          setDemo(null);
          setDemoEquip({});
          setCaption("");
        }, durationMs);
      }
    },
    [report],
  );

  const play = useCallback(
    (item: ResolvedWheelItem) => {
      poke();
      setOpen(false);
      const catalogItem = item.itemId.startsWith("presence-") ? null : catalogById.get(item.itemId) ?? null;
      const duration = item.loops ? LOOPING_RUN_MS : demoDurationMs(item.action);
      fireDemo(item.action, catalogItem, item.caption ?? item.label, duration);
      persistIfOwned(item.equip);
      track("demo_played", { action: item.action, itemId: item.itemId, preview: item.preview });
    },
    [fireDemo, persistIfOwned, poke],
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
      const gear = loadout ?? loadoutForAction(null, action);
      setDemoEquip(gear);
      setCaption("");
      persistIfOwned(gear);
      report(BEHAVIOUR_FOR_ACTION[action]);
      if (demoTimer.current) window.clearTimeout(demoTimer.current);
      const duration = demoDurationMs(action) > 0 ? demoDurationMs(action) : LOOPING_RUN_MS;
      demoTimer.current = window.setTimeout(() => {
        setDemo(null);
        setDemoEquip({});
      }, duration);
    },
    [persistIfOwned, play, poke, report, wheel],
  );

  const pat = useCallback(() => {
    poke();
    const reaction = patReaction(input.species);
    setDemo(reaction.action);
    setCaption("");
    setAmbientMood(reaction.mood);
    ambientMoodRef.current = reaction.mood;
    untilRef.current = Date.now() + reaction.ms;
    moodSinceRef.current = Date.now();
    if (demoTimer.current) window.clearTimeout(demoTimer.current);
    if (reaction.action) {
      demoTimer.current = window.setTimeout(() => {
        setDemo(null);
        setDemoEquip({});
      }, reaction.ms);
    }
  }, [input.species, poke]);

  // Ambient life: moods roll over on their own schedule; once in a while the
  // creature does a trick it knows or uses something it is carrying.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      const now = Date.now();
      if (liveDemo || open) {
        untilRef.current = now + 1200;
        return;
      }
      if (now > untilRef.current) {
        if (untilRef.current > 0 && now - moodSinceRef.current > 2600) {
          report(BEHAVIOUR_FOR_MOOD[ambientMoodRef.current]);
        }
        const next = pickMood(statsRef.current);
        setAmbientMood(next);
        ambientMoodRef.current = next;
        moodSinceRef.current = now;
        untilRef.current = now + moodDuration(next, statsRef.current);
      }
      if (nextShowRef.current === 0) {
        nextShowRef.current = now + 7000 + Math.random() * 9000;
      }
      if (now > nextShowRef.current) {
        const pick = pickSpontaneous(skillsRef.current, equippedRef.current);
        const showmanship = (statsRef.current.drama + statsRef.current.chaos) / 200;
        nextShowRef.current = now + 16000 + Math.random() * 26000 * (1 - showmanship * 0.4);
        if (pick) fireDemo(pick.action, pick.item, pick.caption, oneShotMs(pick.action));
      }
    }, 900);
    return () => window.clearInterval(timer);
  }, [liveDemo, fireDemo, open, report]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(
    () => () => {
      if (demoTimer.current) window.clearTimeout(demoTimer.current);
    },
    [],
  );

  return {
    wheel,
    open,
    demo: liveDemo,
    equipped,
    mood,
    skill,
    caption: caption || (liveDemo ? wheel.find((row) => row.action === liveDemo)?.caption ?? "" : ""),
    toggleWheel,
    closeWheel,
    play,
    applyExternal,
    pat,
    poke,
  };
}
