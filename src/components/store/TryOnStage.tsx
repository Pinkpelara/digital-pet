"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LiveStage } from "@/components/stage/LiveStage";
import { track } from "@/lib/analytics";
import { LooksGoodWith } from "@/components/store/LooksGoodWith";
import { adoptHref } from "@/lib/catalog-paths";
import { formatPrice } from "@/lib/format";
import type { CatalogItem, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

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
    if (item.skillId) {
      setSkill(item.skillId);
      track("skill_performed", { skill: item.skillId });
      window.setTimeout(() => setSkill(null), 2800);
    }
  }

  const wearParam = Object.values(equipped).filter(Boolean).join(",");
  const heading =
    product.kind === "skill" ? `Teach ${product.name}` : product.kind === "companion" ? `Meet ${product.name}.` : product.name;
  const cta =
    product.kind === "companion"
      ? `Adopt ${formatPrice(product.priceCents)}`
      : product.kind === "skill"
        ? `Teach ${product.name} ${formatPrice(product.priceCents)}`
        : `Add to inventory ${formatPrice(product.priceCents)}`;

  return (
    <div className="bg-paper">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-14">
        <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream">
          <LiveStage
            species={species}
            equipped={equipped}
            skill={skill}
            mood={skill ? "skill" : "idle"}
            className="h-full w-full"
            cameraZ={5.15}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-moss">
            {product.kind === "companion" ? "Live companion" : "Live try-on"}
          </p>
          <h1 className="mt-3 max-w-[12ch] font-display text-4xl leading-[1.02] text-ink md:text-6xl">{heading}</h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">{oneLiner ?? product.tagline}</p>
          <p className="mt-3 max-w-md text-ink-soft">{product.description}</p>
          <div className="mt-8">
            <Link
              href={adoptHref([product.id])}
              onClick={() => track("checkout_started", { itemIds: product.id, demo: true })}
              className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-paper hover:bg-ink/90"
            >
              {cta}
            </Link>
          </div>
          {tryOns.length > 0 && (
            <div className="mt-10">
              <p className="text-sm text-ink-soft">Try a look on this one</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tryOns.map((item) => {
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
                      {item.kind === "skill" ? `Teach ${item.name}` : item.name}
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
