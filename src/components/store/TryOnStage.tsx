"use client";

import { useMemo, useState } from "react";
import { RiveCreature } from "@/components/creatures/RiveCreature";
import { track } from "@/lib/analytics";
import { AdoptButton } from "@/components/store/AdoptButton";
import { LooksGoodWith } from "@/components/store/LooksGoodWith";
import type { CatalogItem, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

export function TryOnStage({
  species,
  product,
  suggestions,
}: {
  species: SpeciesId;
  product: CatalogItem;
  suggestions: CatalogItem[];
}) {
  const [equipped, setEquipped] = useState<EquipmentLoadout>(() =>
    product.slot ? { [product.slot]: product.id } : {},
  );
  const [skill, setSkill] = useState<SkillId | null>(product.skillId ?? null);

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

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative overflow-hidden rounded-[2rem] bg-cream px-6 py-10">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,#e8d8b8,transparent)]" />
        <div className="flex min-h-[340px] items-end justify-center">
          <RiveCreature species={species} size={280} equipped={equipped} skill={skill} mood={skill ? "skill" : "idle"} />
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-moss">Live try-on</p>
        <h1 className="mt-2 font-display text-5xl text-ink">{product.name}</h1>
        <p className="mt-3 text-lg text-ink-soft">{product.description}</p>
        <div className="mt-6">
          <AdoptButton itemIds={[product.id]} priceCents={product.priceCents} label={product.kind === "companion" ? "Adopt" : "Add to nest"} />
        </div>
        {tryOns.length > 0 && (
          <div className="mt-8">
            <p className="text-sm font-medium text-ink">Dress and teach on this page</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tryOns.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => apply(item)}
                  className="rounded-full border border-ink/10 bg-paper px-3 py-1.5 text-sm text-ink hover:border-ink/30"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <LooksGoodWith ids={product.looksGoodWith} />
      </div>
    </div>
  );
}
