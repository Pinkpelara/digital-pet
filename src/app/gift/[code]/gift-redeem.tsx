"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { companions, giftCodes, items } from "@/data/catalog";
import { Creature } from "@/components/creatures/Creature";
import { profileHref } from "@/lib/catalog-paths";
import { track } from "@/lib/analytics";
import { useNest } from "@/lib/state/nest-context";
import { useReducedMotion } from "@/components/site/use-reduced-motion";

type Stage = "intro" | "parcel" | "emerge" | "name" | "moved";

export function GiftRedeem({ code }: { code: string }) {
  const gift = giftCodes[code.toUpperCase()];
  const { signInDemo, grantItems, instances, renameCompanion, hydrated } = useNest();
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("intro");
  const [draftName, setDraftName] = useState("");
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const opened = useRef(false);

  const companionItem = gift
    ? items.find((item) => gift.itemIds.includes(item.id) && item.kind === "companion")
    : undefined;
  const species = companionItem?.speciesId ?? "bloop";
  const speciesMeta = companions.find((entry) => entry.id === species);

  useEffect(() => {
    if (stage === "intro") {
      const timer = window.setTimeout(() => setStage("parcel"), reducedMotion ? 0 : 1200);
      return () => window.clearTimeout(timer);
    }
    if (stage !== "parcel") return;
    const timer = window.setTimeout(() => setStage("emerge"), 2200);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, stage]);

  function openParcel() {
    if (!gift || opened.current) return;
    opened.current = true;
    signInDemo();
    track("gift_redeemed", { code });
    const next = grantItems(gift.itemIds, "gift");
    const created = next
      .filter((row) => row.speciesId === species)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    if (created) {
      setInstanceId(created.id);
      setDraftName(created.name);
    }
    setStage(companionItem ? "name" : "moved");
  }

  const instance = instances.find((row) => row.id === instanceId) ?? null;
  const name = instance?.name ?? draftName ?? speciesMeta?.name ?? "";

  if (!gift) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <p className="font-display text-4xl text-ink">No parcel with that code.</p>
        <p className="mt-3 text-ink-soft">Try WELCOME-BLOOP.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center px-5 py-16 text-center">
      {stage === "intro" || stage === "parcel" ? (
        <>
          <p className="kicker">A gift</p>
          <h1 className="mt-3 font-display text-5xl text-ink">Someone sent you a companion.</h1>
          <p className="mt-4 text-lg text-ink-soft">{gift.note}</p>
        </>
      ) : null}

      {(stage === "intro" || stage === "parcel") && (
        <div className={`parcel mt-10 ${stage === "parcel" ? "is-shaking" : ""}`} aria-hidden="true">
          <div className="parcel-box" />
          <div className="parcel-tape" />
          <div className="parcel-flap" />
        </div>
      )}

      {stage === "parcel" && (
        <button type="button" onClick={openParcel} className="btn btn-primary mt-8">
          Open it
        </button>
      )}

      {stage === "emerge" && (
        <div className="creature-crawl mt-10">
          <Creature species={species} size={200} mood="happy" decorative />
        </div>
      )}

      {stage === "name" && instance && (
        <>
          <div className="pop-in">
            <Creature species={instance.speciesId} size={200} mood="happy" decorative />
          </div>
          <h2 className="mt-4 font-display text-4xl text-ink">
            Something climbed out. What will you call them?
          </h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              renameCompanion(instance.id, draftName.trim() || instance.name);
              setStage("moved");
            }}
            className="mt-8 w-full max-w-md"
          >
            <label htmlFor="gift-name" className="sr-only">
              Name your companion
            </label>
            <input
              id="gift-name"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              className="w-full rounded-full border border-ink/15 bg-card px-5 py-4 text-center text-xl text-ink outline-none focus:border-moss"
              maxLength={24}
            />
            <button type="submit" className="btn btn-primary mt-4 w-full">
              That is their name
            </button>
          </form>
        </>
      )}

      {stage === "moved" && (
        <div className="pop-in">
          <Creature species={instance?.speciesId ?? species} size={210} mood="happy" decorative />
          <h2 className="mt-4 font-display text-5xl text-ink">{name} moved in.</h2>
          <p className="mt-3 text-ink-soft">
            Nobody picked their personality. You will meet it over the next few days.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {instance ? (
              <Link href={profileHref(instance.id)} className="btn btn-primary">
                Visit {name}
              </Link>
            ) : (
              <Link href="/my-companions" className="btn btn-primary">
                Your companions
              </Link>
            )}
            <Link href="/inventory" className="btn btn-ghost">
              Open inventory
            </Link>
          </div>
          {!hydrated && <p className="mt-4 text-sm text-ink-soft">Waking them up.</p>}
        </div>
      )}
    </div>
  );
}
