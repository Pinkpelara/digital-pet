"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PlayableStage } from "@/components/stage/PlayableStage";
import { track } from "@/lib/analytics";
import { LooksGoodWith } from "@/components/store/LooksGoodWith";
import { adoptHref, isShopSafe, pdpCtaLabel, profileHref, shopTitle } from "@/lib/catalog-paths";
import { demoActionForItem } from "@/lib/demo-actions";
import { useNest } from "@/lib/state/nest-context";
import type { CatalogItem, DemoActionId, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

export function TryOnStage({
  species,
  product,
  suggestions,
  initialEquipped = {},
  initialSkill = null,
  oneLiner,
}: {
  species: SpeciesId;
  product: CatalogItem;
  suggestions: CatalogItem[];
  initialEquipped?: EquipmentLoadout;
  initialSkill?: SkillId | null;
  oneLiner?: string;
}) {
  const nest = useNest();
  const roommate = nest.instances[0] ?? null;
  const [equipped, setEquipped] = useState<EquipmentLoadout>(() =>
    Object.keys(initialEquipped).length
      ? initialEquipped
      : product.slot
        ? { ...(roommate?.equipped ?? {}), [product.slot]: product.id }
        : { ...(roommate?.equipped ?? {}) },
  );
  const [skill, setSkill] = useState<SkillId | null>(initialSkill ?? product.skillId ?? null);
  const [playAction, setPlayAction] = useState<DemoActionId | null>(() => demoActionForItem(product));

  const tryOns = useMemo(
    () => suggestions.filter((item) => item.slot || item.skillId),
    [suggestions],
  );

  function apply(item: CatalogItem) {
    track("item_try_on", { itemId: item.id, species });
    if (item.slot) {
      setEquipped((prev) => {
        const next = { ...prev };
        if (next[item.slot!] === item.id) delete next[item.slot!];
        else next[item.slot!] = item.id;
        return next;
      });
    }
    const action = demoActionForItem(item);
    if (action) setPlayAction(action);
    if (item.skillId) {
      setSkill(item.skillId);
      track("skill_performed", { skill: item.skillId });
      window.setTimeout(() => setSkill(null), 2800);
    }
  }

  const heading = product.kind === "companion" ? `Adopt ${product.name}` : shopTitle(product);
  const shopSafe = isShopSafe(product);
  const owned = nest.owns(product.id);
  const equippedOnThem = product.slot ? roommate?.equipped[product.slot] === product.id : false;

  function buy() {
    nest.signInDemo();
    nest.grantItems([product.id], "purchase");
    track("checkout_started", { itemIds: product.id, demo: true });
  }

  function equip() {
    if (!roommate || !product.slot) return;
    nest.saveOutfit(roommate.id, { ...roommate.equipped, [product.slot]: product.id });
  }

  function takeOff() {
    if (!roommate || !product.slot) return;
    const next = { ...roommate.equipped };
    delete next[product.slot];
    nest.saveOutfit(roommate.id, next);
  }

  return (
    <div className="bg-paper">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-14">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream stage-frame">
          <PlayableStage
            species={roommate?.speciesId ?? species}
            equipped={equipped}
            skill={skill}
            mood={skill ? "skill" : "idle"}
            className="h-full w-full"
            cameraZ={5.15}
            companionName={roommate?.name ?? (product.kind === "companion" ? product.name : species)}
            instanceId={roommate?.id}
            seed={roommate?.seed}
            persistEquip={owned}
            playAction={playAction}
            autoPlay={demoActionForItem(product)}
          />
        </div>
        <div>
          <p className="kicker">{product.kind === "companion" ? "Adopt" : owned ? "Owned" : "Try on"}</p>
          <h1 className="mt-3 max-w-[12ch] font-display text-5xl leading-[0.92] text-ink md:text-7xl">{heading}</h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">{oneLiner ?? product.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {product.kind === "companion" ? (
              roommate?.speciesId === product.speciesId ? (
                <Link href={profileHref(roommate.id)} className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-paper">
                  {roommate.name} is yours
                </Link>
              ) : (
                <Link
                  href={adoptHref([product.id])}
                  onClick={() => track("checkout_started", { itemIds: product.id, demo: true })}
                  className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-paper"
                >
                  Adopt {product.name}
                </Link>
              )
            ) : shopSafe ? (
              owned ? (
                product.slot ? (
                  equippedOnThem ? (
                    <button type="button" onClick={takeOff} className="rounded-full bg-ink px-6 py-3 text-paper">
                      On {roommate?.name ?? "them"}
                    </button>
                  ) : (
                    <button type="button" onClick={equip} className="rounded-full bg-ink px-6 py-3 text-paper">
                      Equip
                    </button>
                  )
                ) : (
                  <p className="rounded-full bg-mist px-6 py-3 text-sm text-ink">Owned</p>
                )
              ) : (
                <button type="button" onClick={buy} className="rounded-full bg-ink px-6 py-3 text-paper">
                  {pdpCtaLabel(product)}
                </button>
              )
            ) : product.id === "gadget-camera" ? (
              owned ? (
                <p className="text-sm text-moss">The camera is theirs.</p>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    nest.signInDemo();
                    nest.grantItems(["gadget-camera"], "gift");
                  }}
                  className="rounded-full bg-ink px-6 py-3 text-paper"
                >
                  Give them the camera
                </button>
              )
            ) : (
              <p className="max-w-md rounded-[1.2rem] bg-mist px-4 py-3 text-sm text-ink-soft">Preview</p>
            )}
          </div>
          {tryOns.filter(isShopSafe).length > 0 && (
            <div className="mt-10">
              <p className="text-sm text-ink-soft">Try on</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tryOns.filter(isShopSafe).map((item) => {
                  const active = item.slot ? equipped[item.slot] === item.id : skill === item.skillId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => apply(item)}
                      aria-pressed={active}
                      className={`rounded-full border px-3 py-1.5 text-sm ${
                        active ? "border-ink bg-ink text-paper" : "border-ink/15 bg-paper text-ink hover:border-ink/40"
                      }`}
                    >
                      {shopTitle(item)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <LooksGoodWith ids={product.looksGoodWith} tone="light" />
        </div>
      </div>
    </div>
  );
}
