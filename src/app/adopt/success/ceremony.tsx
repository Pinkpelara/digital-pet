"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { companions, items } from "@/data/catalog";
import { LiveStage } from "@/components/stage/LiveStage";
import { WhereTheyLive } from "@/components/live/WhereTheyLive";
import { useNest } from "@/lib/state/nest-context";

export function AdoptCeremony() {
  const params = useSearchParams();
  const { grantItems, instances, renameCompanion, hydrated } = useNest();
  const itemKey = params.get("items") ?? "companion-bloop";
  const itemIds = useMemo(() => itemKey.split(",").filter(Boolean), [itemKey]);
  const [draftName, setDraftName] = useState<string | null>(null);
  const [named, setNamed] = useState(false);

  useEffect(() => {
    if (!hydrated || itemIds.length === 0) return;
    grantItems(itemIds, "purchase");
  }, [grantItems, hydrated, itemIds]);

  const companionItem = items.find((item) => itemIds.includes(item.id) && item.kind === "companion");
  const species = companionItem?.speciesId ?? "bloop";
  const speciesMeta = companions.find((entry) => entry.id === species);
  const instance =
    instances.find((row) => row.speciesId === species) ?? instances.at(-1) ?? null;
  const name = draftName ?? instance?.name ?? "";

  if (!hydrated) {
    return <div className="bg-void px-4 py-16 text-center text-mist/60">Untying the ribbon…</div>;
  }

  function saveName(event: React.FormEvent) {
    event.preventDefault();
    if (!instance) return;
    renameCompanion(instance.id, name.trim() || instance.name);
    setNamed(true);
  }

  return (
    <div className="bg-void text-mist">
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <LiveStage
            species={species}
            className="h-full min-h-[100svh] w-full"
            mood="happy"
            cameraZ={5.15}
            placement="stage-right"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,9,0.82)_0%,rgba(7,8,9,0.25)_42%,transparent_66%)]" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-10">
          <p className="text-[11px] uppercase tracking-[0.32em] text-mist/50">A parcel for you</p>
          {companionItem && instance ? (
            <form onSubmit={saveName} className="pointer-events-auto mt-6 max-w-md">
              <label htmlFor="companion-name" className="font-display text-5xl leading-[0.92] text-paper md:text-7xl">
                {speciesMeta?.name} crawled out.
              </label>
              <p className="mt-4 text-lg text-mist/70">What will you call them? Then pick a home — website, browser, or desktop later.</p>
              <input
                id="companion-name"
                name="name"
                value={name}
                onChange={(event) => setDraftName(event.target.value)}
                className="mt-6 w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-lg text-paper outline-none focus:border-mist"
                maxLength={24}
              />
              <button type="submit" className="mt-4 rounded-full bg-paper px-5 py-3 text-void">
                That&apos;s their name
              </button>
              {named && <p className="mt-3 text-sm text-mist/70">Written on the nest tag.</p>}
              {!named && (
                <button
                  type="button"
                  onClick={() => setNamed(true)}
                  className="mt-3 block text-sm text-mist/55 underline"
                >
                  Skip naming — pick a home
                </button>
              )}
            </form>
          ) : (
            <div className="pointer-events-auto mt-6 max-w-md">
              <h1 className="font-display text-5xl text-paper">Packed into your nest.</h1>
              <Link href="/inventory" className="mt-6 inline-block rounded-full bg-paper px-5 py-3 text-void">
                Open inventory
              </Link>
            </div>
          )}
        </div>
      </section>

      {(named || !companionItem) && (
        <div className="bg-paper px-4 py-16 text-ink md:px-10">
          <div className="mx-auto max-w-6xl">
            <WhereTheyLive instanceId={instance?.id} companionName={instance?.name ?? name} heading="h2" />
          </div>
        </div>
      )}
    </div>
  );
}
