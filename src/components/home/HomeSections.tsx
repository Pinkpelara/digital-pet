"use client";

import { useState } from "react";
import Link from "next/link";
import { LivePen } from "@/components/creatures/LivePen";
import { companions } from "@/data/catalog";
import { applyTendencies, contrastLine, fullLabels, seedFromString } from "@/lib/personality";

/**
 * New product concept: species and individual are different things.
 * Two companion instances of the same species behave differently because each
 * carries its own hidden personality seed.
 */
export function TwinBloops() {
  const left = applyTendencies(seedFromString("twin-bloop-left"), companions[0].tendencies);
  const right = applyTendencies(seedFromString("twin-bloop-right"), companions[0].tendencies);
  const [now, setNow] = useState<Record<string, string>>({});

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
          {[
            { name: "Bloop #1", seed: left },
            { name: "Bloop #2", seed: right },
          ].map((twin) => (
            <article key={twin.name} className="overflow-hidden rounded-[2rem] border border-white/10">
              <LivePen
                className="h-64 w-full"
                tone="stage"
                label={`${twin.name} behaving in its own way`}
                onBehaviour={(kind, entry) =>
                  setNow((prev: Record<string, string>) =>
                    prev[entry.key] === kind ? prev : { ...prev, [entry.key]: kind },
                  )
                }
                actors={[
                  {
                    key: twin.name,
                    species: "bloop",
                    seed: twin.seed,
                    size: 140,
                    start: { x: 70, y: 100 },
                  },
                ]}
              />
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-3xl text-paper">{twin.name}</h3>
                  <p className="text-sm text-mist/60">Right now: {liveWord(now[twin.name])}</p>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {fullLabels(twin.seed).map((label) => (
                    <li key={label} className="rounded-full border border-white/15 px-3 py-1 text-sm text-mist/80">
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

function liveWord(kind?: string): string {
  switch (kind) {
    case "climbed":
      return "climbing something";
    case "napped":
      return "asleep";
    case "followedCursor":
      return "following your cursor";
    case "hid":
      return "hiding";
    case "explored":
      return "wandering off";
    case "skated":
      return "skating";
    case "played":
      return "playing";
    case "photographed":
      return "taking photos of nothing";
    default:
      return "thinking about it";
  }
}
