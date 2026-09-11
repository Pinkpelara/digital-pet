import type {
  CreatureMood,
  DemoActionId,
  EquipmentLoadout,
  PersonalitySeed,
  SpeciesId,
} from "@/lib/types";

export type AmbientBeat = {
  mood: CreatureMood;
  action: DemoActionId | null;
  ms: number;
};

function stretch(ms: number, energy: number): number {
  const factor = 0.75 + (100 - energy) / 200;
  return Math.round(ms * factor);
}

/**
 * Desktop Mate / Eilik: they keep living if you leave them alone.
 * Species sets the habit; seed (when present) makes this individual drift.
 * Owned gear gets used in their world — not as a one-shot catalog clip.
 */
export function ambientPlaylist(
  species: SpeciesId,
  seed?: PersonalitySeed,
  equipped: EquipmentLoadout = {},
): AmbientBeat[] {
  const v = seed?.values;
  const energy = v?.energy ?? (species === "mochi" ? 22 : species === "niblet" ? 82 : 56);
  const sleep = v?.sleepiness ?? (species === "mochi" ? 84 : 28);
  const mischief = v?.mischief ?? (species === "niblet" ? 86 : 48);
  const curiosity = v?.curiosity ?? (species === "sprout" ? 80 : 55);

  const core: AmbientBeat[] =
    species === "mochi"
      ? [
          { mood: "nap", action: null, ms: stretch(22000 + sleep * 80, energy) },
          { mood: "idle", action: null, ms: stretch(8000, energy) },
          { mood: "follow", action: null, ms: stretch(10000, energy) },
          { mood: "nap", action: null, ms: stretch(18000, energy) },
        ]
      : species === "sprout"
        ? [
            { mood: "follow", action: null, ms: stretch(14000 + curiosity * 40, energy) },
            { mood: "hide", action: null, ms: stretch(7000, energy) },
            { mood: "idle", action: null, ms: stretch(9000, energy) },
            { mood: "follow", action: null, ms: stretch(12000, energy) },
          ]
        : species === "niblet"
          ? [
              { mood: "happy", action: null, ms: stretch(8000 + mischief * 20, energy) },
              { mood: "idle", action: null, ms: stretch(6000, energy) },
              { mood: "happy", action: "dance", ms: stretch(7000, energy) },
              { mood: "follow", action: null, ms: stretch(9000, energy) },
            ]
          : [
              { mood: "follow", action: null, ms: stretch(10000 + curiosity * 30, energy) },
              { mood: "climb", action: null, ms: stretch(9000, energy) },
              { mood: "idle", action: null, ms: stretch(8000, energy) },
              { mood: "climb", action: null, ms: stretch(7000, energy) },
              { mood: "nap", action: null, ms: stretch(6000 + (100 - energy) * 20, energy) },
            ];

  const extras: AmbientBeat[] = [];
  if (equipped.hand === "gadget-camera") {
    extras.push({ mood: "skill", action: "photo-pose", ms: stretch(4500, energy) });
  }
  if (equipped.feet === "gadget-skateboard") {
    extras.push({ mood: "happy", action: "skate", ms: stretch(7000, energy) });
  }
  if (equipped.hand === "gadget-umbrella") {
    extras.push({ mood: "idle", action: "rain-walk", ms: stretch(8000, energy) });
  }
  if (equipped.head === "gadget-headphones") {
    extras.push({ mood: "follow", action: "focus", ms: stretch(9000, energy) });
  }
  if (equipped.body === "outfit-raincoat" && !equipped.hand) {
    extras.push({ mood: "idle", action: "twirl", ms: stretch(4000, energy) });
  }

  if (extras.length === 0) return core;

  const insertAt = Math.min(core.length - 1, 1 + (mischief > 60 ? 1 : 0));
  return [...core.slice(0, insertAt), extras[0], ...core.slice(insertAt), ...extras.slice(1)];
}

export function patReaction(species: SpeciesId): AmbientBeat {
  if (species === "mochi") return { mood: "happy", action: null, ms: 2200 };
  if (species === "niblet") return { mood: "happy", action: "dance", ms: 2400 };
  if (species === "sprout") return { mood: "follow", action: null, ms: 2000 };
  return { mood: "happy", action: null, ms: 2000 };
}
