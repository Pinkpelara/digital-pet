"use client";

import Link from "next/link";
import { LiveStage } from "@/components/stage/LiveStage";
import { formatPrice } from "@/lib/format";
import { isShopSafe, shopTitle } from "@/lib/catalog-paths";
import { demoActionForItem, loadoutForCatalogItem, speciesForCatalogItem } from "@/lib/demo-actions";
import type { CatalogItem } from "@/lib/types";

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
  const showStage =
    item.kind === "gadget" ||
    item.kind === "skill" ||
    item.kind === "outfit" ||
    item.kind === "drop" ||
    (item.kind === "companion" && Boolean(item.speciesId));
  const demo = item.kind === "companion" ? null : demoActionForItem(item);

  return (
    <article className="poster-card card-lift rounded-[1.6rem]">
      <Link href={href} className="block">
        <div className="aspect-[4/5] bg-cream">
          {showStage ? (
            <div className="pointer-events-none h-full w-full">
              <LiveStage
                species={speciesForCatalogItem(item)}
                equipped={item.kind === "companion" ? undefined : loadoutForCatalogItem(item)}
                skill={item.skillId ?? null}
                demo={demo}
                className="h-full w-full"
                cameraZ={5.55}
                followPointer={false}
                quality="medium"
                dprMax={1.2}
                loop
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <span
                className="flex h-24 w-24 items-center justify-center rounded-full text-sm text-ink"
                style={{ background: item.accent }}
              >
                {item.kind === "skill" ? item.name : item.kind}
              </span>
            </div>
          )}
        </div>
        <div className="film-wash" aria-hidden />
        <div className="poster-copy">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-moss">
            {item.kind}
            {owned ? " · owned" : shopSafe ? "" : " · coming soon"}
          </p>
          <h3 className="mt-1 font-display text-3xl leading-none text-ink">{title}</h3>
          <p className="mt-2 text-sm text-ink-soft">{item.behaviorNote ?? item.tagline}</p>
          <p className="mt-3 text-sm tabular-nums text-ink">
            {shopSafe ? formatPrice(item.priceCents) : "Coming soon"}
          </p>
        </div>
      </Link>
    </article>
  );
}
