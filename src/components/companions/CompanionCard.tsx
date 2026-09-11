"use client";

import Link from "next/link";
import { PlayableStage } from "@/components/stage/PlayableStage";
import { profileHref, studioHref } from "@/lib/catalog-paths";
import {
  daysTogether,
  favouriteGadget,
  latestBehaviour,
  secretTotal,
  skillNames,
  speciesName,
  wearingNames,
} from "@/lib/companion-view";
import type { CompanionInstance } from "@/lib/types";

export function CompanionCard({ instance }: { instance: CompanionInstance }) {
  const knows = skillNames(instance);
  const wearing = wearingNames(instance);
  const gadget = favouriteGadget(instance);
  const total = secretTotal(instance);

  return (
    <article className="poster-card rounded-[1.6rem] p-0">
      <div className="aspect-[4/5] overflow-hidden bg-cream">
        <PlayableStage
          species={instance.speciesId}
          equipped={instance.equipped}
          unlockedSkills={instance.unlockedSkills}
          companionName={instance.name}
          instanceId={instance.id}
          seed={instance.seed}
          persistEquip
          className="h-full w-full"
          cameraZ={5.5}
        />
      </div>

      <div className="p-6">
      <div className="mt-0 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-3xl text-ink">{instance.name}</h2>
        <p className="text-sm text-ink-soft">{speciesName(instance)}</p>
      </div>
      <p className="mt-1 text-sm text-ink-soft">Together for {daysTogether(instance)} days</p>

      <dl className="mt-5 space-y-3 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-ink-soft">Knows</dt>
          <dd className="mt-1 text-ink">{knows.length ? knows.join(" · ") : "Nothing yet"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-ink-soft">Wearing</dt>
          <dd className="mt-1 text-ink">{wearing.length ? wearing.join(", ") : "Nothing. Rude but fine."}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-ink-soft">Favourite gadget</dt>
          <dd className="mt-1 text-ink">{gadget ?? "None yet"}</dd>
        </div>
        <div className="flex gap-8">
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-ink-soft">Secrets</dt>
            <dd className="mt-1 text-ink">
              {instance.secrets.length} / ???{total ? "" : ""}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-ink-soft">Favourite spot</dt>
            <dd className="mt-1 text-ink">{instance.favouriteSpot ?? "Unknown for now"}</dd>
          </div>
        </div>
      </dl>

      <p className="mt-4 text-sm text-ink-soft">Last seen: {latestBehaviour(instance)}.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={profileHref(instance.id)} className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper">
          Open {instance.name}
        </Link>
        <Link href={studioHref(instance.id)} className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink">
          Customize
        </Link>
      </div>
      </div>
    </article>
  );
}
