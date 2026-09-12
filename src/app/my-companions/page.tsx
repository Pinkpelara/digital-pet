"use client";

import Link from "next/link";
import { CompanionCard } from "@/components/companions/CompanionCard";
import { LiveStage } from "@/components/stage/LiveStage";
import { AwayNote } from "@/components/home/AwayNote";
import { PageHero } from "@/components/site/KineticTitle";
import { brand } from "@/lib/brand";
import { useNest } from "@/lib/state/nest-context";

export default function MyCompanionsPage() {
  const { instances, hydrated } = useNest();
  const speciesCount = new Set(instances.map((row) => row.speciesId)).size;

  if (!hydrated) {
    return <div className="mx-auto max-w-6xl px-4 py-12 text-ink-soft">Looking for them.</div>;
  }

  return (
    <div className="bg-paper pb-16">
      <PageHero
        kicker="Your companions"
        title="Who lives with you"
        lede="This is their home."
      >
        <p className="mt-4">
          <Link href="/live" className="text-sm text-moss underline">
            Where should they live?
          </Link>
        </p>
      </PageHero>

      <div className="mx-auto max-w-6xl px-5 md:px-10">
      <AwayNote />
      {instances.length === 0 ? (
        <article className="poster-card overflow-hidden rounded-[2rem]">
          <div className="min-h-[360px] bg-cream md:min-h-[460px]">
            <LiveStage
              species="bloop"
              mood="idle"
              className="h-full min-h-[360px] w-full md:min-h-[460px]"
              cameraZ={5.5}
              followPointer
              quality="medium"
            />
          </div>
          <div className="film-wash" aria-hidden />
          <div className="poster-copy">
            <p className="text-[11px] font-semibold tracking-[0.28em] text-moss">EMPTY NEST</p>
            <p className="mt-2 font-display text-4xl leading-none text-ink">Nobody lives here yet.</p>
            <p className="mt-3 max-w-md text-ink-soft">{brand.meetBody}</p>
            <Link href="/companions" className="mt-6 inline-block rounded-full bg-ink px-5 py-3 text-paper">
              Adopt one
            </Link>
          </div>
        </article>
      ) : (
        <>
          <p className="text-sm text-ink-soft">
            {instances.length} companion{instances.length === 1 ? "" : "s"} · {speciesCount} kind{speciesCount === 1 ? "" : "s"}
            {" · every one different"}
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {instances.map((instance) => (
              <CompanionCard key={instance.id} instance={instance} />
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  );
}
