"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { CompanionStudio } from "@/components/studio/CompanionStudio";
import { useNest } from "@/lib/state/nest-context";

export default function CompanionStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { instances, hydrated } = useNest();
  const instance = useMemo(() => instances.find((row) => row.id === id), [id, instances]);

  if (!hydrated) return <div className="px-4 py-16 text-ink-soft">Finding them…</div>;
  if (!instance) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="font-display text-4xl">They are not in this nest.</h1>
        <Link href="/my-companions" className="mt-4 inline-block text-moss underline">
          Back to companions
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Studio</p>
      <h1 className="mt-2 font-display text-5xl text-ink">{instance.name}</h1>
      <p className="mt-2 text-ink-soft">LOOK · GADGET · SKILLS · PERSONALITY</p>
      <div className="mt-8">
        <CompanionStudio instance={instance} />
      </div>
    </div>
  );
}
