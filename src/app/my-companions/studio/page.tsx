"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CompanionStudio } from "@/components/studio/CompanionStudio";
import { ClientOnly } from "@/components/site/ClientOnly";
import { liveHref, profileHref } from "@/lib/catalog-paths";
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
      <p className="mt-2 text-ink-soft">
        Equip what you own, teach what you have taught, and save the look.
      </p>
      <p className="mt-3 flex flex-wrap gap-4 text-sm">
        <Link href={profileHref(instance.id)} className="text-moss underline">
          {instance.name}&apos;s profile
        </Link>
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
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Customization studio</p>
      <ClientOnly fallback={<p className="text-ink-soft">Warming the studio lamp…</p>}>
        <StudioInner />
      </ClientOnly>
    </div>
  );
}
