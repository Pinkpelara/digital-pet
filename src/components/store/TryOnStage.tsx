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
    <div className="relative isolate min-h-[100svh] bg-void text-mist">
      <div className="absolute inset-0 lg:right-[36%]">
        <LiveStage
          species={species}
          equipped={equipped}
          skill={skill}
          mood={skill ? "skill" : "idle"}
          className="h-full min-h-[100svh] w-full"
          cameraZ={5.5}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(7,8,9,0.55)_100%)] max-lg:bg-[linear-gradient(180deg,transparent_45%,rgba(7,8,9,0.88)_100%)]" />
      </div>
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 lg:ml-auto lg:w-[42%] lg:justify-center lg:px-8 lg:pb-24">
        <p className="text-[11px] uppercase tracking-[0.28em] text-mist/50">Live try-on</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.92] text-paper md:text-7xl">{product.name}</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-mist/75 md:text-lg">{product.description}</p>
        <div className="mt-8">
          <Link
            href={adoptHref([product.id])}
            onClick={() => track("checkout_started", { itemIds: product.id, demo: true })}
            className="inline-flex items-center justify-center rounded-full bg-paper px-6 py-3 text-void hover:bg-mist"
          >
            {product.kind === "companion" ? "Adopt" : "Add to nest"} {formatPrice(product.priceCents)}
          </Link>
        </div>
        {tryOns.length > 0 && (
          <div className="mt-10">
            <p className="text-sm text-mist/55">Dress and teach on this stage</p>
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
                        ? "border-paper bg-paper text-void"
                        : "border-mist/20 bg-transparent text-mist hover:border-mist/50"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        <LooksGoodWith ids={product.looksGoodWith} tone="dark" />
      </div>
    </div>
  );
}
