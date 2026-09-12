"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PlayableStage } from "@/components/stage/PlayableStage";
import { track } from "@/lib/analytics";
import { adoptHref, isShopSafe, pdpCtaLabel } from "@/lib/catalog-paths";
import { demoActionForItem } from "@/lib/demo-actions";
import { formatPrice } from "@/lib/format";
import { useNest } from "@/lib/state/nest-context";
import type { CatalogItem, DemoActionId, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

const KIND_LABEL: Record<CatalogItem["kind"], string> = {
  companion: "Companion",
  outfit: "Look",
  gadget: "Gadget",
  skill: "Skill",
  drop: "Limited",
};

export function TryOnStage({
  species,
  product,
  suggestions,
  initialEquipped = {},
  initialSkill = null,
  oneLiner,
  kicker,
}: {
  species: SpeciesId;
  product: CatalogItem;
  suggestions: CatalogItem[];
  initialEquipped?: EquipmentLoadout;
  initialSkill?: SkillId | null;
  oneLiner?: string;
  kicker?: string;
}) {
  const [equipped, setEquipped] = useState<EquipmentLoadout>(() =>
    Object.keys(initialEquipped).length
      ? initialEquipped
      : product.slot
        ? { [product.slot]: product.id }
        : {},
  );
  const [skill, setSkill] = useState<SkillId | null>(initialSkill ?? product.skillId ?? null);
  const [playAction, setPlayAction] = useState<DemoActionId | null>(() => demoActionForItem(product));
  const nest = useNest();
  const roommate = nest.instances[0] ?? null;
  const isCompanion = product.kind === "companion";

  const tryOns = useMemo(
    () => suggestions.filter((item) => (item.slot || item.skillId) && isShopSafe(item)),
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

  const shopSafe = isShopSafe(product);

  return (
    <div className="bg-paper">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-14">
        <div className="stage-frame relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream">
          <PlayableStage
            species={species}
            equipped={equipped}
            skill={skill}
            mood={skill ? "skill" : "idle"}
            className="h-full w-full"
            cameraZ={5.15}
            companionName={roommate?.name ?? (isCompanion ? product.name : species)}
            instanceId={roommate?.id}
            seed={roommate?.seed}
            persistEquip={nest.hydrated}
            autoPlay={demoActionForItem(product)}
            playAction={playAction}
          />
        </div>
        <div>
          <p className="kicker">{kicker ?? KIND_LABEL[product.kind]}</p>
          <h1 className="mt-3 max-w-[12ch] font-display text-5xl leading-[0.92] text-ink md:text-7xl">
            {product.name}
          </h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink">{oneLiner ?? product.tagline}</p>
          <p className="mt-3 max-w-md leading-relaxed text-ink-soft">{product.description}</p>

          {product.unlocksBehavior && (
            <p className="mt-5 max-w-md rounded-[1.2rem] bg-mist px-4 py-3 text-ink ring-1 ring-ink/10">
              <span className="font-medium">What changes: </span>
              {product.behaviorNote ?? product.unlocksBehavior}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {shopSafe ? (
              <>
                <Link
                  href={adoptHref([product.id])}
                  onClick={() => track("checkout_started", { itemIds: product.id, demo: true })}
                  className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-paper hover:bg-ink/90"
                >
                  {isCompanion ? `Adopt ${product.name}` : pdpCtaLabel(product)}
                </Link>
                <p className="text-lg font-medium tabular-nums text-ink">{formatPrice(product.priceCents)}</p>
              </>
            ) : (
              <p className="max-w-md rounded-[1.2rem] bg-mist px-4 py-3 text-sm text-ink-soft ring-1 ring-ink/10">
                Not in the shop yet. Watch what it does — it arrives in a later drop.
              </p>
            )}
          </div>
          <p className="mt-4 max-w-md text-sm text-ink-soft">
            {isCompanion
              ? "Watch them for a bit. Adopt when you are sure."
              : "Yours forever once you buy it. No subscriptions, no fake currency."}
          </p>

          {tryOns.length > 0 && (
            <div className="mt-10">
              <p className="text-sm text-ink-soft">
                {isCompanion ? "Try a look on this one" : "See it on them with"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tryOns.map((item) => {
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
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
