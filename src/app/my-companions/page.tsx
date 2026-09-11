"use client";

import Link from "next/link";
import { CompanionCard } from "@/components/companions/CompanionCard";
import { CareChips } from "@/components/home/CareChips";
import { PageHero } from "@/components/site/KineticTitle";
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
        lede="This is their home. Tap a companion for Teach / Gadget / Outfit / Mood peek / Nap / Gift. Each one is an individual. Personality is not for sale."
      >
        <CareChips className="mt-5" />
        <p className="mt-4">
          <Link href="/live" className="text-sm text-moss underline">
            Where should they live?
          </Link>
        </p>
      </PageHero>

      <div className="mx-auto max-w-6xl px-5 md:px-10">
      {instances.length === 0 ? (
        <div className="overflow-hidden rounded-[2rem] bg-mist ring-1 ring-ink/10">
          <div className="flex h-72 items-center justify-center bg-cream text-ink-soft">Nobody lives here yet.</div>
          <div className="p-8">
            <p className="font-display text-3xl text-ink">Nobody lives here yet.</p>
            <Link href="/companions" className="mt-4 inline-block rounded-full bg-ink px-5 py-3 text-paper">
              Adopt one
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink-soft">
            {instances.length} companion{instances.length === 1 ? "" : "s"} · {speciesCount} species
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
