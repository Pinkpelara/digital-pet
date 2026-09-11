"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { companions, items } from "@/data/catalog";
import { LiveStage } from "@/components/stage/LiveStage";
import { profileHref } from "@/lib/catalog-paths";
import { useNest } from "@/lib/state/nest-context";
import { useReducedMotion } from "@/components/site/use-reduced-motion";

type Stage = "parcel" | "emerge" | "name" | "yours";

export function AdoptCeremony() {
  const params = useSearchParams();
  const { grantItems, instances, renameCompanion, hydrated } = useNest();
  const reducedMotion = useReducedMotion();
  const itemKey = params.get("items") ?? "companion-bloop";
  const itemIds = useMemo(() => itemKey.split(",").filter(Boolean), [itemKey]);

  const [stage, setStage] = useState<Stage>("parcel");
  const [draftName, setDraftName] = useState("");
  const named = useRef(false);
  const granted = useRef(false);

  const companionItem = items.find((item) => itemIds.includes(item.id) && item.kind === "companion");
  const species = companionItem?.speciesId ?? "bloop";
  const speciesMeta = companions.find((entry) => entry.id === species);

  const instance = useMemo(
    () =>
      instances
        .filter((row) => row.speciesId === species)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? instances.at(-1) ?? null,
    [instances, species],
  );
  const name = draftName.trim() || instance?.name || speciesMeta?.name || "";

  useEffect(() => {
    if (named.current || !instance) return;
    named.current = true;
    setDraftName(instance.name);
  }, [instance]);

  useEffect(() => {
    if (!hydrated || granted.current || itemIds.length === 0) return;
    granted.current = true;
    grantItems(itemIds, "purchase");
  }, [grantItems, hydrated, itemIds]);

  useEffect(() => {
    if (reducedMotion) {
      const timer = window.setTimeout(() => setStage(companionItem ? "name" : "yours"), 0);
      return () => window.clearTimeout(timer);
    }
    const toEmerge = window.setTimeout(() => setStage("emerge"), 2100);
    const toName = window.setTimeout(() => setStage(companionItem ? "name" : "yours"), 3600);
    return () => {
      window.clearTimeout(toEmerge);
      window.clearTimeout(toName);
    };
  }, [companionItem, reducedMotion]);

  if (!hydrated) {
    return <div className="px-4 py-20 text-center text-ink-soft">A box…</div>;
  }

  function saveName(event: React.FormEvent) {
    event.preventDefault();
    if (!instance) return;
    renameCompanion(instance.id, draftName.trim() || instance.name);
    setStage("yours");
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center px-4 py-14 text-center">
      {stage === "parcel" || stage === "emerge" ? (
        <>
          <div
            className={`parcel mt-10 ${stage === "parcel" ? "is-shaking" : "is-open"}`}
            aria-hidden="true"
          >
            <div className="parcel-box" />
            <div className="parcel-flap" />
          </div>
          <p className="mt-6 font-display text-3xl text-ink">
            {stage === "parcel" ? "It is moving." : "Hi."}
          </p>
        </>
      ) : null}

      {stage === "emerge" && (
        <div className="creature-crawl mt-4 h-72 w-full max-w-md overflow-hidden rounded-2xl bg-cream">
          <LiveStage
            species={species}
            equipped={instance?.equipped}
            className="h-full w-full"
            mood="happy"
            cameraZ={5.5}
          />
        </div>
      )}

      {stage === "name" && companionItem && instance && (
        <>
          <div className="h-72 w-full max-w-md overflow-hidden rounded-2xl bg-cream">
            <LiveStage
              species={instance.speciesId}
              equipped={instance.equipped}
              className="h-full w-full"
              mood="happy"
              cameraZ={5.5}
            />
          </div>
          <h1 className="mt-6 font-display text-4xl text-ink md:text-5xl">What will you call them?</h1>
          <form onSubmit={saveName} className="mt-8 w-full max-w-md">
            <label htmlFor="companion-name" className="sr-only">
              Name your companion
            </label>
            <input
              id="companion-name"
              name="name"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              className="w-full rounded-full border border-ink/15 bg-paper px-5 py-4 text-center text-lg text-ink outline-none focus:border-moss"
              maxLength={24}
              placeholder="Kevin"
            />
            <button type="submit" className="mt-4 w-full rounded-full bg-ink px-5 py-3 text-paper">
              That’s their name
            </button>
          </form>
        </>
      )}

      {stage === "yours" && (
        <div className="w-full">
          <div className="mx-auto h-72 w-full max-w-md overflow-hidden rounded-2xl bg-cream">
            <LiveStage
              species={instance?.speciesId ?? species}
              equipped={instance?.equipped}
              className="h-full w-full"
              mood="happy"
              followPointer
              cameraZ={5.5}
            />
          </div>
          <h1 className="mt-6 font-display text-5xl text-ink md:text-6xl">{name} is yours.</h1>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {instance ? (
              <Link href={profileHref(instance.id)} className="rounded-full bg-ink px-6 py-3 text-paper">
                Meet {name}
              </Link>
            ) : (
              <Link href="/my-companions" className="rounded-full bg-ink px-6 py-3 text-paper">
                Meet them
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
