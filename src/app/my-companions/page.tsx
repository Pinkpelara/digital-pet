"use client";

import Link from "next/link";
import { CompanionCard } from "@/components/companions/CompanionCard";
import { CareChips } from "@/components/home/CareChips";
import { useNest } from "@/lib/state/nest-context";

export default function MyCompanionsPage() {
  const { instances, hydrated } = useNest();
  const speciesCount = new Set(instances.map((row) => row.speciesId)).size;

  if (!hydrated) {
    return <div className="mx-auto max-w-6xl px-4 py-12 text-ink-soft">Looking for them.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-medium text-moss">Your companions</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Who lives with you</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        This is their home. Tap a companion for Teach / Gadget / Outfit / Mood peek / Nap / Gift.
        Each one is an individual. Personality is not for sale.
      </p>
      <CareChips className="mt-5" />
      <p className="mt-3">
        <Link href="/live" className="text-sm text-moss underline">
          Where should they live?
        </Link>
      </p>

      {instances.length === 0 ? (
        <div className="mt-10 overflow-hidden rounded-[2rem] bg-paper ring-1 ring-ink/8">
          <div className="h-72 bg-cream">
            <div className="flex h-full items-center justify-center text-ink-soft">Nobody lives here yet.</div>
          </div>
          <div className="p-8">
            <p className="text-lg text-ink">Nobody lives here yet.</p>
            <Link href="/companions/bloop" className="mt-4 inline-block rounded-full bg-ink px-5 py-3 text-paper">
              Meet one individual
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-ink-soft">
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
  );
}
