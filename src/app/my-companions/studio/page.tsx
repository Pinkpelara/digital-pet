"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CompanionStudio } from "@/components/studio/CompanionStudio";
import { liveHref } from "@/lib/catalog-paths";
import { useNest } from "@/lib/state/nest-context";

function StudioInner() {
  const params = useSearchParams();
  const id = params.get("id");
  const { instances, hydrated } = useNest();
  const instance = instances.find((row) => row.id === id) ?? instances[0] ?? null;

  if (!hydrated) {
    return <p className="text-ink-soft">Warming the studio lamp…</p>;
  }

  if (!instance) {
    return (
      <div className="rounded-[2rem] bg-paper p-8 ring-1 ring-ink/8">
        <p className="text-lg text-ink">Nobody is on this perch yet.</p>
        <Link href="/companions" className="mt-4 inline-block rounded-full bg-ink px-5 py-3 text-paper">
          Adopt someone
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="mt-2 font-display text-5xl text-ink">{instance.name}</h1>
      <p className="mt-2 text-ink-soft">LOOK · GADGET · SKILLS · PERSONALITY</p>
      <p className="mt-3">
        <Link href={liveHref(instance.id)} className="text-sm text-moss underline">
          Where does {instance.name} live?
        </Link>
      </p>
      <div className="mt-8">
        <CompanionStudio instance={instance} />
      </div>
    </>
  );
}

export default function CompanionStudioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Studio</p>
      <Suspense fallback={<p className="mt-4 text-ink-soft">Warming the studio lamp…</p>}>
        <StudioInner />
      </Suspense>
    </div>
  );
}
