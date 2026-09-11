"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import { adoptHref } from "@/lib/catalog-paths";
import { formatPrice } from "@/lib/format";
import { useNest } from "@/lib/state/nest-context";

export function AdoptButton({
  itemIds,
  priceCents,
  label = "Adopt",
  className,
}: {
  itemIds: string[];
  priceCents: number;
  label?: string;
  className?: string;
}) {
  const { owns, hydrated } = useNest();
  const already = hydrated && itemIds.every((id) => owns(id));

  if (already) {
    return (
      <Link
        href="/inventory"
        className={`inline-flex items-center justify-center rounded-full bg-moss px-5 py-3 text-paper ${className ?? ""}`}
      >
        Already yours
      </Link>
    );
  }

  return (
    <Link
      href={adoptHref(itemIds)}
      onClick={() => track("checkout_started", { itemIds: itemIds.join(","), demo: true })}
      className={`inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-paper transition hover:bg-ink/90 ${className ?? ""}`}
    >
      {label} {formatPrice(priceCents)}
    </Link>
  );
}
