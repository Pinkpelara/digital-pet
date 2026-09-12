"use client";

import Link from "next/link";
import { useState } from "react";
import { FigurineMesh } from "@/components/stage/FigurineMesh";
import { StageCanvas } from "@/components/stage/StageCanvas";
import { StudioLights, StudioShadows, StudioSill } from "@/components/stage/StudioKit";
import { STAGE_BG, STAGE_FOG } from "@/lib/stage-theme";
import { companions } from "@/data/catalog";
import type { CreatureMood, SpeciesId } from "@/lib/types";

/** Each species doing the thing it is known for — not posed for a product shot. */
const moods: Record<SpeciesId, CreatureMood> = {
  bloop: "climb",
  mochi: "nap",
  sprout: "follow",
  niblet: "happy",
};

export function MeetLineup() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  return (
    <div className="stage-frame overflow-hidden rounded-[1.8rem]">
      <div className="relative h-[340px] md:h-[420px]">
        <StageCanvas
          className="h-full w-full"
          alpha={false}
          dprMax={1.25}
          camera={{ position: [0, 0.85, 8.6], fov: 28, far: 40 }}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setPointer({
              x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
              y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
            });
          }}
        >
          <color attach="background" args={[STAGE_BG]} />
          <fog attach="fog" args={[STAGE_FOG, 16, 32]} />
          <StudioLights intensity={1.05} />
          <StudioSill width={10} position={[0, -1.1, 0.2]} />
          {companions.map((companion, index) => (
            <group key={companion.id} position={[(index - 1.5) * 1.9, 0.06, 0]}>
              <FigurineMesh
                species={companion.id}
                quality="medium"
                mood={moods[companion.id]}
                followPointer={companion.id === "sprout"}
                pointer={pointer}
              />
            </group>
          ))}
          <StudioShadows position={[0, -0.96, 0]} scale={14} />
        </StageCanvas>
      </div>
      <ol className="grid gap-px bg-ink/10 md:grid-cols-4">
        {companions.map((companion) => (
          <li key={companion.id} className="bg-paper">
            <Link
              href={`/companions/${companion.slug}`}
              prefetch={false}
              className="group block h-full p-5 transition-colors hover:bg-cream"
            >
              <p className="text-[11px] font-semibold tracking-[0.28em] text-moss">{companion.alias}</p>
              <h3 className="mt-1 font-display text-3xl leading-none text-ink group-hover:text-moss">
                {companion.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{companion.title}</p>
              <p className="mt-3 text-sm text-moss underline underline-offset-4">Meet {companion.name}</p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
