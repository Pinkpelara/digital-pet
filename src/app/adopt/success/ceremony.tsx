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
    return <div className="px-4 py-16 text-center text-ink-soft">Untying the ribbon…</div>;
  }

  function saveName(event: React.FormEvent) {
    event.preventDefault();
    if (!instance) return;
    renameCompanion(instance.id, name.trim() || instance.name);
    setNamed(true);
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center px-4 py-16">
      <div className="flex w-full max-w-2xl flex-col items-center text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-moss">A parcel for you</p>
      <div className="relative mt-8 h-72 w-full max-w-md overflow-hidden rounded-2xl bg-void">
        <LiveStage
          species={species}
          className="h-full w-full"
          mood="happy"
          cameraZ={5.5}
        />
      </div>

      {companionItem && instance ? (
        <form onSubmit={saveName} className="mt-8 w-full max-w-md">
          <label htmlFor="companion-name" className="font-display text-3xl text-ink">
            {speciesMeta?.name} crawled out. What will you call them?
          </label>
          <input
            id="companion-name"
            name="name"
            value={name}
            onChange={(event) => setDraftName(event.target.value)}
            className="mt-4 w-full rounded-full border border-ink/15 bg-paper px-5 py-3 text-center text-lg text-ink outline-none focus:border-moss"
            maxLength={24}
          />
          <button type="submit" className="mt-4 rounded-full bg-ink px-5 py-3 text-paper">
            That&apos;s their name
          </button>
          {named && <p className="mt-3 text-sm text-moss">Written on the nest tag.</p>}
          {!named && (
            <button
              type="button"
              onClick={() => setNamed(true)}
              className="mt-3 block w-full text-sm text-ink-soft underline"
            >
              Skip naming — pick a home
            </button>
          )}
        </form>
      ) : (
        <div className="mt-8">
          <h1 className="font-display text-4xl text-ink">Packed into your nest.</h1>
          <Link href="/inventory" className="mt-6 inline-block rounded-full bg-ink px-5 py-3 text-paper">
            Open inventory
          </Link>
        </div>
      )}
      </div>

      {(named || !companionItem) && (
        <div className="mt-14 w-full border-t border-ink/8 pt-12">
          <WhereTheyLive instanceId={instance?.id} companionName={instance?.name ?? name} />
        </div>
      )}
    </div>
  );
}
