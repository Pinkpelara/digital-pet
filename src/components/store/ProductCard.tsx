import Link from "next/link";
import { formatPrice } from "@/lib/format";
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
  return (
    <article>
      <Link
        href={href}
        className="group flex items-end justify-between gap-6 border-b border-ink/10 py-6 transition-colors hover:border-ink/40"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft">
            {item.kind}
            {owned ? " · owned" : ""}
          </p>
          <h3 className="mt-1 font-display text-3xl text-ink">{item.name}</h3>
          <p className="mt-1 max-w-md text-sm text-ink-soft">{item.tagline}</p>
        </div>
        <span className="shrink-0 text-sm tabular-nums text-ink-soft">{formatPrice(item.priceCents)}</span>
      </Link>
    </article>
  );
}
