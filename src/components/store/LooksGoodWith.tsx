import Link from "next/link";
import { items } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import { hrefForItem } from "@/lib/catalog-paths";

export function LooksGoodWith({ ids, tone = "light" }: { ids: string[]; tone?: "light" | "dark" }) {
  const related = ids
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  if (related.length === 0) return null;

  const dark = tone === "dark";

  return (
    <section className="mt-10">
      <p className={`text-xs uppercase tracking-[0.2em] ${dark ? "text-mist/50" : "text-ink-soft"}`}>Looks good with</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {related.map((item) => (
          <Link
            key={item.id}
            href={hrefForItem(item)}
            className={
              dark
                ? "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:border-white/25"
                : "rounded-2xl border border-ink/8 bg-paper px-4 py-3 hover:border-ink/20"
            }
          >
            <p className={`font-medium ${dark ? "text-paper" : "text-ink"}`}>{item.name}</p>
            <p className={`text-sm ${dark ? "text-mist/60" : "text-ink-soft"}`}>{formatPrice(item.priceCents)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
