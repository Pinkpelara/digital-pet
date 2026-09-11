"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CompanionStudio } from "@/components/studio/CompanionStudio";
import { ClientOnly } from "@/components/site/ClientOnly";
import { liveHref, profileHref } from "@/lib/catalog-paths";
import { useNest } from "@/lib/state/nest-context";

function StudioInner() {
  const params = useSearchParams();
  const { instances, hydrated } = useNest();
  const id = params.get("id");
  const instance = instances.find((row) => row.id === id) ?? instances[0];

  if (!hydrated) {
    return <p className="mt-4 text-ink-soft">Warming the studio lamp…</p>;
  }

  if (!instance) {
    return (
      <div className="mt-8">
        <p className="font-display text-3xl text-ink">Nobody to dress yet.</p>
        <Link href="/companions" className="mt-4 inline-block rounded-full bg-ink px-5 py-3 text-paper">
          Adopt one
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
        <Link href={liveHref(instance.id)} className="text-moss underline">
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
      <ClientOnly fallback={<p className="mt-4 text-ink-soft">Warming the studio lamp…</p>}>
        <StudioInner />
      </ClientOnly>
    </div>
  );
}
