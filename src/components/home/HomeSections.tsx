"use client";

import Link from "next/link";
import { LiveStage } from "@/components/stage/LiveStage";
import { companions } from "@/data/catalog";
import { applyTendencies, contrastLine, fullLabels, moodFromSeed, seedFromString } from "@/lib/personality";

/**
 * Same species, two individuals. The 3D stage stays cinematic; the seeds
 * decide which mood each Bloop settles into. No sliders, no numbers.
 */
export function TwinBloops() {
  const left = applyTendencies(seedFromString("twin-bloop-left"), companions[0].tendencies);
  const right = applyTendencies(seedFromString("twin-bloop-right"), companions[0].tendencies);
  const twins = [
    { name: "Bloop #1", seed: left },
    { name: "Bloop #2", seed: right },
  ];

  return (
    <section className="bg-void text-mist">
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.32em] text-mist/45">
          Same species. Different little weirdos.
        </p>
        <h2 className="mt-3 max-w-[18ch] font-display text-4xl text-paper md:text-6xl">
          Two Bloops. Completely different problems.
        </h2>
        <p className="mt-4 max-w-xl text-mist/70">
          Every companion gets a hidden personality seed when you adopt it. Same species, same store
          page, completely different creature.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {twins.map((twin) => (
            <article key={twin.name} className="overflow-hidden rounded-2xl border border-white/10">
              <div className="aspect-[4/5] bg-void">
                <LiveStage
                  species="bloop"
                  className="h-full w-full"
                  cameraZ={5.5}
                  mood={moodFromSeed(twin.seed)}
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-3xl text-paper">{twin.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {fullLabels(twin.seed).map((label) => (
                    <li
                      key={label}
                      className="rounded-full border border-white/15 px-3 py-1 text-sm text-mist/80"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 font-display text-2xl text-paper md:text-3xl">{contrastLine(left, right)}</p>
        <p className="mt-3 max-w-2xl text-mist/70">
          You cannot buy, set, or edit any of this. You find out by living with them.
        </p>
        <Link
          href="/companions/bloop"
          className="mt-8 inline-block rounded-full bg-paper px-6 py-3 text-sm text-void"
        >
          Meet Bloop
        </Link>
      </div>
    </section>
  );
}
