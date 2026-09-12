"use client";

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
      <div className="absolute inset-y-[12%] right-0 z-20 w-[58%] max-md:inset-x-0 max-md:top-[38%] max-md:h-[52%] max-md:w-auto">
        <button
          type="button"
          className="absolute inset-0 cursor-pointer bg-transparent"
          onClick={playable.pat}
          aria-label={`Say hi to ${name}`}
        />
        {playable.caption ? (
          <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/80 px-3 py-1.5 text-xs text-paper">
            {playable.caption}
          </p>
        ) : null}
      </div>
    </>
  );
}
