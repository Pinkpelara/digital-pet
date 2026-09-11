"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PlayableStage } from "@/components/stage/PlayableStage";
import { track } from "@/lib/analytics";
import { LooksGoodWith } from "@/components/store/LooksGoodWith";
import { adoptHref, isShopSafe, pdpCtaLabel, shopTitle } from "@/lib/catalog-paths";
import { demoActionForItem, showOffMs } from "@/lib/demo-actions";
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
  const [equipped, setEquipped] = useState<EquipmentLoadout>(() =>
    Object.keys(initialEquipped).length
      ? initialEquipped
      : product.slot
        ? { [product.slot]: product.id }
        : {},
  );
  const [skill, setSkill] = useState<SkillId | null>(initialSkill ?? product.skillId ?? null);
  const [playAction, setPlayAction] = useState<DemoActionId | null>(() => demoActionForItem(product));
  const [showOffKey, setShowOffKey] = useState(0);

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
    setShowOffKey((value) => value + 1);
    if (item.skillId) {
      setSkill(item.skillId);
      track("skill_performed", { skill: item.skillId });
      window.setTimeout(() => setSkill(null), 2800);
    }
  }

  const wearParam = Object.values(equipped).filter(Boolean).join(",");
  const heading = product.kind === "companion" ? `Adopt ${product.name}` : shopTitle(product);
  const shopSafe = isShopSafe(product);
  const cta = pdpCtaLabel(product);
  const waitMs = showOffMs(playAction ?? demoActionForItem(product));
  const waitCopy =
    product.kind === "companion" ? "Meet them first." : "Watch them first — then the price.";

  return (
    <div className="bg-paper">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-14">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream">
          <PlayableStage
            species={species}
            equipped={equipped}
            skill={skill}
            mood={skill ? "skill" : "idle"}
            className="h-full w-full"
            cameraZ={5.15}
            companionName={product.kind === "companion" ? product.name : species}
            hint="Tap them — Moonwalk, Skateboard, Umbrella."
            autoPlay={demoActionForItem(product)}
            playAction={playAction}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-moss">
            {product.kind === "companion" ? "Live companion" : "Live try-on"}
          </p>
          <h1 className="mt-3 max-w-[12ch] font-display text-4xl leading-[1.02] text-ink md:text-6xl">{heading}</h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">{oneLiner ?? product.tagline}</p>
          <p className="mt-3 max-w-md text-ink-soft">{product.description}</p>
          {product.kind === "skill" && product.skillId === "moonwalk" ? (
            <p className="mt-3 max-w-md font-medium text-ink">Moonwalk. Backward, smooth, slightly illegal.</p>
          ) : null}
          {product.kind === "companion" ? (
            <p className="mt-3 max-w-md text-sm text-ink-soft">
              Soft trial: live with this individual before anything else. Personality is not for sale.
            </p>
          ) : (
            <p className="mt-3 max-w-md text-sm text-ink-soft">
              Cosmetics and Teach skills stay yours. Birthday and habit magic stay free.
            </p>
          )}
          <div className="mt-8">
            {shopSafe ? (
              <div
                key={`${product.id}-${showOffKey}`}
                className="show-off-stack"
                style={{ ["--show-off" as string]: `${waitMs}ms` }}
              >
                <p className="show-off-wait text-sm text-ink-soft">{waitCopy}</p>
                <div className="show-off-cta">
                  <Link
                    href={adoptHref([product.id])}
                    onClick={() => track("checkout_started", { itemIds: product.id, demo: true })}
                    className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-paper hover:bg-ink/90"
                  >
                    {product.kind === "companion" ? `Adopt ${product.name}` : cta}
                  </Link>
                </div>
              </div>
            ) : (
              <p className="max-w-md rounded-[1.2rem] bg-cream px-4 py-3 text-sm text-ink-soft">
                Preview only. Watch the trick first. If you cannot see it in a second, we do not sell
                it yet. Shop what you can see: Raincoat · Pocket Umbrella.
              </p>
            )}
          </div>
          {tryOns.filter(isShopSafe).length > 0 && (
            <div className="mt-10">
              <p className="text-sm text-ink-soft">Try a look on this one</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tryOns.filter(isShopSafe).map((item) => {
                  const active = item.slot ? equipped[item.slot] === item.id : skill === item.skillId;
                  const href = item.skillId
                    ? `?wear=${wearParam || ""}&play=${item.skillId}`
                    : `?wear=${item.id}`;
                  return (
                    <Link
                      key={item.id}
                      href={href}
                      scroll={false}
                      onClick={() => apply(item)}
                      aria-pressed={active}
                      className={`rounded-full border px-3 py-1.5 text-sm ${
                        active ? "border-ink bg-ink text-paper" : "border-ink/15 bg-paper text-ink hover:border-ink/40"
                      }`}
                    >
                      {shopTitle(item)}
                    </Link>
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
