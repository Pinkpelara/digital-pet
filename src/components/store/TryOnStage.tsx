"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Creature } from "@/components/creatures/Creature";
import { track } from "@/lib/analytics";
import { LooksGoodWith } from "@/components/store/LooksGoodWith";
import { adoptHref } from "@/lib/catalog-paths";
import type { CatalogItem, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

export function TryOnStage({
  species,
  product,
  suggestions,
  initialEquipped = {},
  initialSkill = null,
}: {
  species: SpeciesId;
  product: CatalogItem;
  suggestions: CatalogItem[];
  initialEquipped?: EquipmentLoadout;
  initialSkill?: SkillId | null;
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

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative z-10 overflow-hidden rounded-[2rem] bg-cream px-6 py-10">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,#e8d8b8,transparent)]" />
        <div className="flex min-h-[340px] items-end justify-center">
          <Creature species={species} size={280} equipped={equipped} skill={skill} mood={skill ? "skill" : "idle"} />
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-moss">Live try-on</p>
        <h1 className="mt-2 font-display text-5xl text-ink">{product.name}</h1>
        <p className="mt-3 text-lg text-ink-soft">{product.description}</p>
        <div className="mt-6">
          <Link
            href={adoptHref([product.id])}
            onClick={() => track("checkout_started", { itemIds: product.id, demo: true })}
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-paper hover:bg-ink/90"
          >
            {product.kind === "companion" ? "Adopt" : "Add to nest"}{" "}
            {(product.priceCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </Link>
        </div>
        {tryOns.length > 0 && (
          <div className="mt-8">
            <p className="text-sm font-medium text-ink">Dress and teach on this page</p>
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
                      active
                        ? "border-moss bg-moss text-paper"
                        : "border-ink/10 bg-paper text-ink hover:border-ink/30"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        <LooksGoodWith ids={product.looksGoodWith} />
      </div>
    </div>
  );
}
