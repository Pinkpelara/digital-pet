"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { companions, giftCodes, items } from "@/data/catalog";
import { LiveStage } from "@/components/stage/LiveStage";
import { profileHref } from "@/lib/catalog-paths";
import { track } from "@/lib/analytics";
import { useNest } from "@/lib/state/nest-context";
import { useReducedMotion } from "@/components/site/use-reduced-motion";

type Stage = "parcel" | "emerge" | "name" | "moved";

export function GiftRedeem({ code }: { code: string }) {
  const gift = giftCodes[code.toUpperCase()];
  const { grantItems, instances, renameCompanion, hydrated, signInDemo } = useNest();
  const reducedMotion = useReducedMotion();

  const [stage, setStage] = useState<Stage>("parcel");
  const [draftName, setDraftName] = useState("");
  const named = useRef(false);
  const granted = useRef(false);

  const itemIds = useMemo(() => gift?.itemIds ?? [], [gift]);
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
    if (!hydrated || granted.current || itemIds.length === 0) return;
    granted.current = true;
    signInDemo();
    grantItems(itemIds, "gift");
    track("gift_redeemed", { code });
  }, [code, grantItems, hydrated, itemIds, signInDemo]);

  useEffect(() => {
    if (named.current || !instance) return;
    named.current = true;
    setDraftName(instance.name);
  }, [instance]);

  useEffect(() => {
    if (reducedMotion) {
      const timer = window.setTimeout(() => setStage(companionItem ? "name" : "moved"), 0);
      return () => window.clearTimeout(timer);
    }
    const toEmerge = window.setTimeout(() => setStage("emerge"), 2100);
    const toName = window.setTimeout(() => setStage(companionItem ? "name" : "moved"), 3600);
    return () => {
      window.clearTimeout(toEmerge);
      window.clearTimeout(toName);
    };
  }, [companionItem, reducedMotion]);

  if (!gift) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="kicker">A gift</p>
        <h1 className="mt-3 font-display text-5xl leading-[0.92] text-ink md:text-7xl">{code}</h1>
        <p className="mt-4 text-ink-soft">We could not find a parcel with that string. Try WELCOME-BLOOP.</p>
      </div>
    );
  }

  if (!hydrated) {
    return <div className="px-4 py-20 text-center text-ink-soft">Something is rattling…</div>;
  }

  function saveName(event: React.FormEvent) {
    event.preventDefault();
    if (!instance) return;
    renameCompanion(instance.id, draftName.trim() || instance.name);
    setStage("moved");
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center px-4 py-14 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-moss">Someone sent you a companion</p>
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
            {stage === "parcel" ? "It is moving." : "Something is climbing out."}
          </p>
          <p className="mt-3 max-w-md text-ink-soft">{gift.note}</p>
        </>
      ) : null}

      {stage === "emerge" && (
        <div className="creature-crawl mt-4 h-72 w-full max-w-md overflow-hidden rounded-2xl bg-cream">
          <LiveStage species={species} className="h-full w-full" mood="happy" cameraZ={5.5} />
        </div>
      )}

      {stage === "name" && companionItem && instance && (
        <>
          <div className="h-72 w-full max-w-md overflow-hidden rounded-2xl bg-cream">
            <LiveStage species={instance.speciesId} className="h-full w-full" mood="happy" cameraZ={5.5} />
          </div>
          <h1 className="mt-6 font-display text-4xl text-ink md:text-5xl">
            {speciesMeta?.name} climbed out. What will you call them?
          </h1>
          <form onSubmit={saveName} className="mt-8 w-full max-w-md">
            <label htmlFor="gift-name" className="sr-only">
              Name your companion
            </label>
            <input
              id="gift-name"
              name="name"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              className="w-full rounded-full border border-ink/15 bg-paper px-5 py-4 text-center text-lg text-ink outline-none focus:border-moss"
              maxLength={24}
              placeholder="Kevin"
            />
            <button type="submit" className="mt-4 w-full rounded-full bg-ink px-5 py-3 text-paper">
              That is their name
            </button>
          </form>
          <button
            type="button"
            onClick={() => setStage("moved")}
            className="mt-4 text-sm text-ink-soft underline"
          >
            Skip naming
          </button>
        </>
      )}

      {stage === "moved" && (
        <div className="w-full">
          <div className="mx-auto h-72 w-full max-w-md overflow-hidden rounded-2xl bg-cream">
            <LiveStage
              species={instance?.speciesId ?? species}
              className="h-full w-full"
              mood="happy"
              cameraZ={5.5}
            />
          </div>
          <h1 className="mt-6 font-display text-5xl text-ink md:text-6xl">{name} moved in.</h1>
          <p className="mt-3 text-lg text-ink-soft">
            Who they are is already decided. You will find out over the next few days.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            {instance ? (
              <Link
                href={profileHref(instance.id)}
                className="rounded-full bg-ink px-7 py-3.5 text-paper"
              >
                Go say hi to {name}
              </Link>
            ) : (
              <Link href="/my-companions" className="rounded-full bg-ink px-7 py-3.5 text-paper">
                Go say hi
              </Link>
            )}
            <Link href="/live" className="text-sm text-ink-soft underline underline-offset-4">
              Where can {name} live?
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
