"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlayableStage } from "@/components/stage/PlayableStage";
import { ShowreelCanvas } from "@/components/store/ShowreelCanvas";
import { PersonalityReveal } from "@/components/share/PersonalityReveal";
import { WhatDidTheyDo } from "@/components/share/WhatDidTheyDo";
import { liveHref, studioHref } from "@/lib/catalog-paths";
import {
  daysTogether,
  favouriteGadget,
  secretTotal,
  skillNames,
  speciesName,
  wearingNames,
} from "@/lib/companion-view";
import { useNest } from "@/lib/state/nest-context";
import type { BehaviourCounters } from "@/lib/types";

export function CompanionProfileView() {
  const params = useSearchParams();
  const id = params.get("id");
  const { instances, hydrated, recordBehaviour, noteBond } = useNest();
  const instance = instances.find((row) => row.id === id) ?? instances[0] ?? null;
  const [revealed, setRevealed] = useState<string | null>(null);
  const bonded = useRef<string | null>(null);

  const others = (instance ? instances.filter((row) => row.id !== instance.id) : []);

  // Living near another companion registers. Bonds deepen the longer they share the place.
  useEffect(() => {
    if (!instance || others.length === 0 || bonded.current === instance.id) return;
    bonded.current = instance.id;
    noteBond(instance.id, others[0].id);
  }, [instance, others, noteBond]);

  const onBehaviour = useCallback(
    (kind: keyof BehaviourCounters) => {
      if (!instance) return;
      const label = recordBehaviour(instance.id, kind);
      if (label) {
        setRevealed(label);
        window.setTimeout(() => setRevealed(null), 6000);
      }
    },
    [instance, recordBehaviour],
  );

  if (!hydrated) {
    return <div className="px-5 py-16 text-ink-soft">Finding them.</div>;
  }

  if (!instance) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <p className="font-display text-4xl text-ink">Nobody here yet.</p>
            <Link href="/companions" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-paper">
              Adopt one
            </Link>
      </div>
    );
  }

  const knows = skillNames(instance);
  const wearing = wearingNames(instance);
  const gadget = favouriteGadget(instance);
  const total = secretTotal(instance);

  return (
    <ShowreelCanvas>
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="aspect-[4/5] overflow-hidden rounded-[1.8rem] bg-cream stage-frame">
          <PlayableStage
            species={instance.speciesId}
            equipped={instance.equipped}
            unlockedSkills={instance.unlockedSkills}
            stats={instance.stats}
            onBehaviour={onBehaviour}
            companionName={instance.name}
            className="h-full w-full"
            cameraZ={5.5}
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-moss">{speciesName(instance)}</p>
          <h1 className="mt-2 font-display text-5xl text-ink md:text-6xl">{instance.name}</h1>
          <p className="mt-2 text-ink-soft">Together for {daysTogether(instance)} days</p>

          {revealed && (
            <p className="mt-4 rounded-2xl bg-moss/12 px-4 py-3 text-ink">
              You figured something out: {instance.name} is <strong>{revealed}</strong>.
            </p>
          )}

          <dl className="mt-6 space-y-4">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                Personality discovered
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {instance.discovered.length > 0 ? (
                  instance.discovered.map((entry) => (
                    <span
                      key={entry.label}
                      className="rounded-full border border-ink/15 px-3 py-1 text-sm text-ink"
                    >
                      {entry.label}
                    </span>
                  ))
                ) : (
                  <span className="text-ink-soft">Nothing obvious yet. Keep living together.</span>
                )}
              </dd>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Knows</dt>
                <dd className="mt-1 text-ink">{knows.length ? knows.join(" · ") : "Nothing yet"}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Wearing</dt>
                <dd className="mt-1 text-ink">{wearing.length ? wearing.join(", ") : "Nothing"}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                  Favourite gadget
                </dt>
                <dd className="mt-1 text-ink">{gadget ?? "None yet"}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Secrets</dt>
                <dd className="mt-1 text-ink">
                  {instance.secrets.length} / ??? {total ? `(of at least ${total})` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                  Favourite spot
                </dt>
                <dd className="mt-1 text-ink">{instance.favouriteSpot ?? "Unknown for now"}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                  Not alone
                </dt>
                <dd className="mt-1 text-ink">
                  {others.length === 0
                    ? "Only child. For now."
                    : others
                        .map((other) => {
                          const bond = instance.bonds.find(
                            (entry) => entry.otherInstanceId === other.id,
                          );
                          const status =
                            bond == null
                              ? "hasn't noticed them yet"
                              : bond.strength >= 5
                                ? "napping together"
                                : "still figuring each other out";
                          return `${other.name} · ${status}`;
                        })
                        .join("  ·  ")}
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={studioHref(instance.id)} className="rounded-full bg-ink px-6 py-3 text-paper">
              Customize {instance.name}
            </Link>
            <Link
              href={liveHref(instance.id)}
              className="rounded-full border border-ink/15 px-6 py-3 text-ink"
            >
              Where does {instance.name} live?
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6">
        <WhatDidTheyDo instance={instance} />
        <PersonalityReveal instance={instance} />
      </div>

      <p className="mt-10 text-sm text-ink-soft">
        Sharing goes outward to whatever apps you already use. There is no feed, no comments, and no
        follower count here on purpose.
      </p>
    </div>
    </ShowreelCanvas>
  );
}
