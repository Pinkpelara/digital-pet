"use client";

import Link from "next/link";
import { ShowreelSlot } from "@/components/store/ShowreelCanvas";
import { formatPrice } from "@/lib/format";
import { isShopSafe, shopTitle } from "@/lib/catalog-paths";
import { demoActionForItem, loadoutForCatalogItem, speciesForCatalogItem } from "@/lib/demo-actions";
import type { CatalogItem } from "@/lib/types";

const KIND_LABEL: Record<CatalogItem["kind"], string> = {
  companion: "Companion",
  outfit: "Look",
  gadget: "Gadget",
  skill: "Skill",
  drop: "Limited",
};

export function ProductCard({
  item,
  href,
  owned,
}: {
  item: CatalogItem;
  href: string;
  owned?: boolean;
}) {
  const title = shopTitle(item);
  const shopSafe = isShopSafe(item);
  const demo = item.kind === "companion" ? null : demoActionForItem(item);

  return (
    <article className="group overflow-hidden rounded-[1.6rem] bg-cream ring-1 ring-ink/10 transition hover:ring-ink/25">
      <Link href={href} className="block">
        <ShowreelSlot
          className="aspect-[4/5] w-full"
          species={speciesForCatalogItem(item)}
          equipped={item.kind === "companion" ? {} : loadoutForCatalogItem(item)}
          skill={item.skillId ?? null}
          demo={demo}
        />
        <div className="bg-paper p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-moss">
            {KIND_LABEL[item.kind]}
            {owned ? " · yours" : ""}
          </p>
          <h3 className="mt-1 font-display text-3xl leading-none text-ink group-hover:text-moss">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.behaviorNote ?? item.tagline}</p>
          <p className="mt-3 text-sm font-medium tabular-nums text-ink">
            {shopSafe ? formatPrice(item.priceCents) : "Coming soon"}
          </p>
        </div>
      </Link>
    </article>
  );
}
