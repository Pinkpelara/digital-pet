"use client";

import { companions } from "@/data/catalog";
import { RoamingCreature } from "@/components/creatures/RoamingCreature";
import { useNest } from "@/lib/state/nest-context";
import { useReducedMotion } from "@/components/site/use-reduced-motion";

const roamers = [
  {
    species: "sprout" as const,
    start: { x: 72, y: 220 },
    size: 88,
    followPointer: true,
    equipped: { back: "gadget-balloon" },
  },
  {
    species: "mochi" as const,
    start: { x: 980, y: 120 },
    size: 100,
    followPointer: false,
    equipped: { body: "outfit-hoodie" },
  },
  {
    species: "niblet" as const,
    start: { x: 420, y: 540 },
    size: 86,
    followPointer: false,
    mishap: true,
    equipped: { face: "outfit-sunglasses" },
  },
];

export function WorldLayer({ enabled = true }: { enabled?: boolean }) {
  const { creaturesEnabled } = useNest();
  const reducedMotion = useReducedMotion();
  const paused = !creaturesEnabled || !enabled;

  if (reducedMotion && paused) return null;

  return (
    <div aria-hidden="true">
      {roamers.map((roamer) => {
        const species = companions.find((entry) => entry.id === roamer.species);
        if (!species) return null;
        return (
          <RoamingCreature
            key={roamer.species}
            species={roamer.species}
            stats={species.defaultStats}
            equipped={roamer.equipped}
            start={roamer.start}
            size={roamer.size}
            paused={paused}
            reducedMotion={reducedMotion}
            followPointer={roamer.followPointer}
            mishap={roamer.mishap}
          />
        );
      })}
    </div>
  );
}
