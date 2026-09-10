"use client";

import Link from "next/link";
import { LiveStage } from "@/components/stage/LiveStage";
import { studioHref, liveHref } from "@/lib/catalog-paths";
import { useNest } from "@/lib/state/nest-context";

export default function MyCompanionsPage() {
  const { instances, hydrated } = useNest();

  if (!hydrated) {
    return <div className="mx-auto max-w-6xl px-4 py-12 text-ink-soft">Looking in the nest…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">My companions</p>
      <h1 className="mt-2 font-display text-5xl text-ink">Your nest</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Customization lives here. They already belong to you on the website — you can also pin them in a browser or wait
        for an optional desktop app.
      </p>
      <p className="mt-3">
        <Link href="/live" className="text-sm text-moss underline">
          Where should they live?
        </Link>
      </p>
      {instances.length === 0 ? (
        <div className="mt-10 rounded-[2rem] bg-paper p-8 ring-1 ring-ink/8">
          <p className="text-lg text-ink">The sill is empty — in a hopeful way.</p>
          <Link href="/companions" className="mt-4 inline-block rounded-full bg-ink px-5 py-3 text-paper">
            Adopt someone
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {instances.map((instance) => (
            <article key={instance.id} className="rounded-[1.6rem] bg-paper p-6 ring-1 ring-ink/8">
              <Link href={studioHref(instance.id)} className="block">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-void">
                  <LiveStage
                    species={instance.speciesId}
                    equipped={instance.equipped}
                    className="h-full w-full"
                    cameraZ={3.7}
                  />
                </div>
                <h2 className="mt-3 font-display text-3xl">{instance.name}</h2>
                <p className="text-sm text-ink-soft">Open the studio</p>
              </Link>
              <Link href={liveHref(instance.id)} className="mt-4 inline-block text-sm text-moss underline">
                Where does {instance.name} live?
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
