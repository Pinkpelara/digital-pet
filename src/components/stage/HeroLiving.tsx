"use client";

import { ActionWheel } from "@/components/stage/ActionWheel";
import { HeroStage } from "@/components/stage/HeroStage";
import { StageFx } from "@/components/stage/StageFx";
import { usePlayableCompanion } from "@/components/stage/use-playable-companion";
import { useNest } from "@/lib/state/nest-context";

/** Living companion — loaded only after LCP (idle or first interaction). */
export function HeroLiving({ onReady }: { onReady?: () => void }) {
  const nest = useNest();
  const roommate = nest.hydrated ? nest.instances[0] : null;
  const species = roommate?.speciesId ?? "bloop";
  const playable = usePlayableCompanion({
    species,
    equipped: roommate?.equipped,
    unlockedSkills: roommate?.unlockedSkills,
    instanceId: roommate?.id,
    seed: roommate?.seed,
    persistEquip: nest.hydrated,
  });
  const name = roommate?.name ?? "Bloop";

  return (
    <>
      <HeroStage
        species={species}
        mood={playable.mood}
        skill={playable.skill}
        demo={playable.demo}
        equipped={playable.equipped}
        onReady={onReady}
      />
      <StageFx demo={playable.demo} />
      <div
        className={`absolute inset-y-[12%] right-0 w-[58%] max-md:inset-x-0 max-md:top-[38%] max-md:h-[52%] max-md:w-auto ${
          playable.open ? "z-40" : "z-20"
        }`}
      >
        <button
          type="button"
          className={`absolute inset-0 cursor-pointer bg-transparent ${playable.open ? "pointer-events-none" : ""}`}
          onClick={playable.pat}
          aria-label={`Pat ${name}`}
        />
        <button
          type="button"
          className="absolute bottom-6 right-6 z-30 rounded-full bg-ink/80 px-3 py-1.5 text-xs text-paper"
          onClick={playable.toggleWheel}
          aria-expanded={playable.open}
        >
          Tricks
        </button>
        <ActionWheel
          items={playable.wheel}
          open={playable.open}
          onSelect={playable.play}
          onClose={playable.closeWheel}
          name={name}
        />
      </div>
    </>
  );
}
