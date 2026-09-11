"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { companions, items } from "@/data/catalog";
import { LiveStage } from "@/components/stage/LiveStage";
import { profileHref, studioHref } from "@/lib/catalog-paths";
import { useNest } from "@/lib/state/nest-context";
import { useReducedMotion } from "@/components/site/use-reduced-motion";

type Stage = "parcel" | "emerge" | "name" | "moved" | "home";

export function AdoptCeremony() {
  const params = useSearchParams();
  const { grantItems, instances, renameCompanion, hydrated } = useNest();
  const reducedMotion = useReducedMotion();
  const itemKey = params.get("items") ?? "companion-bloop";
  const itemIds = useMemo(() => itemKey.split(",").filter(Boolean), [itemKey]);

  const [stage, setStage] = useState<Stage>("parcel");
  const [draftName, setDraftName] = useState("");
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
    if (!hydrated || granted.current || itemIds.length === 0) return;
    granted.current = true;
    grantItems(itemIds, "purchase");
  }, [grantItems, hydrated, itemIds]);

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

  if (!hydrated) {
    return <div className="px-4 py-20 text-center text-ink-soft">Untying the ribbon…</div>;
  }

  function saveName(event: React.FormEvent) {
    event.preventDefault();
    if (!instance) return;
    renameCompanion(instance.id, draftName.trim() || instance.name);
    setStage("moved");
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center px-4 py-14 text-center">
      {stage === "parcel" || stage === "emerge" ? (
        <>
          <p className="text-xs uppercase tracking-[0.22em] text-moss">A parcel for you</p>
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
            <label htmlFor="companion-name" className="sr-only">
              Name your companion
            </label>
            <input
              id="companion-name"
              name="name"
              value={draftName || instance.name}
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
            Their personality is already set. You will find out what it is over the next few days.
          </p>
          <button type="button" onClick={() => setStage("home")} className="mt-8 rounded-full bg-ink px-6 py-3 text-paper">
            Next: where should {name} live?
          </button>
        </div>
      )}

      {stage === "home" && (
        <div className="w-full">
          <h1 className="font-display text-4xl text-ink md:text-5xl">Where should {name} live?</h1>
          <p className="mt-3 text-ink-soft">
            {name} is already yours either way. This only decides where you see them.
          </p>
          <ul className="mt-8 grid gap-4 text-left">
            <li className="rounded-[1.6rem] bg-paper p-6 ring-1 ring-ink/8">
              <p className="font-display text-2xl text-ink">Keep them here</p>
              <p className="mt-1 text-sm text-ink-soft">
                Live on this website. Visit them any time, dress them, teach them things.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {instance ? (
                  <>
                    <Link href={profileHref(instance.id)} className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper">
                      Visit {name}
                    </Link>
                    <Link
                      href={studioHref(instance.id)}
                      className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink"
                    >
                      Customize
                    </Link>
                  </>
                ) : (
                  <Link href="/my-companions" className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper">
                    Your companions
                  </Link>
                )}
              </div>
            </li>
            <li className="rounded-[1.6rem] bg-paper p-6 ring-1 ring-ink/8">
              <p className="font-display text-2xl text-ink">Add to browser</p>
              <p className="mt-1 text-sm text-ink-soft">
                Install the web experience where your browser supports it. Handy on work computers.
              </p>
              <Link href="/browser" className="mt-4 inline-block rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink">
                Add to browser
              </Link>
            </li>
            <li className="rounded-[1.6rem] bg-paper p-6 ring-1 ring-ink/8">
              <div className="flex items-center gap-2">
                <p className="font-display text-2xl text-ink">Desktop app</p>
                <span className="rounded-full bg-cream px-2 py-0.5 text-xs uppercase tracking-wider text-ink-soft">
                  Coming soon
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                Let them roam your whole computer. This does not exist yet — we are not pretending it
                does.
              </p>
              <Link href="/desktop" className="mt-4 inline-block rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink">
                See the plan
              </Link>
            </li>
          </ul>
          <p className="mt-8 text-sm text-ink-soft">
            Everything you own stays in your account.{" "}
            <Link href="/inventory" className="underline">
              Open inventory
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
