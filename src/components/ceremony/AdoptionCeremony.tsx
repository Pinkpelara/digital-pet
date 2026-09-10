"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { companions, items } from "@/data/catalog";
import { Creature } from "@/components/creatures/Creature";
import { track } from "@/lib/analytics";
import { bringToDesktopUrl } from "@/lib/deep-link";
import { useNest } from "@/lib/state/nest-context";
import type { CompanionInstance, DemoUser, OwnershipRecord } from "@/lib/types";

type Phase = "parcel" | "shake" | "emerge" | "name" | "choice";

export function AdoptionCeremony({
  itemIds,
  grantToken,
}: {
  itemIds: string[];
  grantToken: string;
}) {
  const router = useRouter();
  const { user, signInDemo, applyGrant, renameCompanion } = useNest();
  const [phase, setPhase] = useState<Phase>("parcel");
  const [name, setName] = useState("");
  const [instance, setInstance] = useState<CompanionInstance | null>(null);
  const [error, setError] = useState<string | null>(null);

  const companionItem = useMemo(
    () => items.find((item) => itemIds.includes(item.id) && item.kind === "companion"),
    [itemIds],
  );
  const species = companionItem?.speciesId ?? "bloop";
  const speciesMeta = companions.find((entry) => entry.id === species);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase("shake"), 700),
      window.setTimeout(() => setPhase("emerge"), 2200),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  useEffect(() => {
    if (phase !== "emerge") return;
    let cancelled = false;
    async function grant() {
      const sessionUser: DemoUser = user ?? signInDemo();
      const response = await fetch("/api/ownership/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: grantToken, userId: sessionUser.id }),
      });
      const data = (await response.json()) as {
        error?: string;
        instances?: CompanionInstance[];
        ownership?: OwnershipRecord[];
      };
      if (!response.ok) {
        setError(data.error ?? "The parcel refused to open.");
        return;
      }
      if (cancelled) return;
      applyGrant({
        user: sessionUser,
        ownership: data.ownership ?? [],
        instances: data.instances ?? [],
      });
      const born =
        (data.instances ?? []).find((row) => row.speciesId === species) ??
        data.instances?.[data.instances.length - 1] ??
        null;
      setInstance(born);
      setName(born?.name ?? speciesMeta?.name ?? "Friend");
      track("purchase_granted", { itemIds: itemIds.join(",") });
      window.setTimeout(() => setPhase(companionItem && born ? "name" : "choice"), 1400);
    }
    void grant();
    return () => {
      cancelled = true;
    };
  }, [applyGrant, companionItem, grantToken, itemIds, phase, signInDemo, species, speciesMeta?.name, user]);

  function keepName() {
    if (instance) {
      renameCompanion(instance.id, name.trim() || instance.name);
    }
    setPhase("choice");
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-moss">A parcel for you</p>
      <div className="relative mt-8 flex h-72 w-full items-end justify-center">
        {phase !== "choice" && (
          <div className={`parcel ${phase === "shake" ? "is-shaking" : ""} ${phase === "emerge" || phase === "name" ? "is-open" : ""}`}>
            <div className="parcel-box" />
            <div className="parcel-flap" />
          </div>
        )}
        {(phase === "emerge" || phase === "name" || phase === "choice") && (
          <div className={`absolute bottom-6 ${phase === "emerge" ? "creature-crawl" : ""}`}>
            <Creature species={species} size={phase === "choice" ? 220 : 160} mood="happy" name={name || speciesMeta?.name} />
          </div>
        )}
      </div>

      {error && <p className="mt-6 text-sm text-peach">{error}</p>}

      {phase === "parcel" || phase === "shake" ? (
        <h1 className="mt-8 font-display text-4xl text-ink">Something is fidgeting in the wrapping.</h1>
      ) : null}

      {phase === "emerge" && (
        <h1 className="mt-8 font-display text-4xl text-ink">
          {companionItem ? `${speciesMeta?.name ?? "A companion"} crawled out.` : "The wrapping gave way."}
        </h1>
      )}

      {phase === "name" && (
        <form
          className="mt-8 w-full max-w-md"
          onSubmit={(event) => {
            event.preventDefault();
            keepName();
          }}
        >
          <label htmlFor="companion-name" className="font-display text-3xl text-ink">
            What will you call them?
          </label>
          <input
            id="companion-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-4 w-full rounded-full border border-ink/15 bg-paper px-5 py-3 text-center text-lg text-ink outline-none focus:border-moss"
            maxLength={24}
          />
          <button type="submit" className="mt-4 rounded-full bg-ink px-5 py-3 text-paper">
            That&apos;s their name
          </button>
        </form>
      )}

      {phase === "choice" && (
        <div className="mt-8">
          <h1 className="font-display text-4xl text-ink">{instance ? `${name} is home.` : "Packed into your nest."}</h1>
          <p className="mt-3 text-ink-soft">
            {instance
              ? "Keep them on the sill, or open the desktop companion."
              : "Entitlements live in inventory — not as files."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {instance ? (
              <>
                <Link href={`/my-companions/${instance.id}`} className="rounded-full bg-ink px-5 py-3 text-paper">
                  Keep them here
                </Link>
                <a
                  href={bringToDesktopUrl(instance.id)}
                  onClick={() => track("desktop_deeplink_clicked", { instanceId: instance.id })}
                  className="rounded-full border border-ink/15 px-5 py-3 text-ink"
                >
                  Bring to computer
                </a>
              </>
            ) : (
              <Link href="/inventory" className="rounded-full bg-ink px-5 py-3 text-paper">
                Open inventory
              </Link>
            )}
          </div>
          <button type="button" className="mt-4 text-sm text-ink-soft" onClick={() => router.push("/inventory")}>
            See everything in the nest
          </button>
        </div>
      )}
    </div>
  );
}
