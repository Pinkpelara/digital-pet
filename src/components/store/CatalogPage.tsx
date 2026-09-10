import { CatalogGrid } from "@/components/store/CatalogGrid";
import { categoryCopy } from "@/lib/catalog-paths";
import type { CatalogItem } from "@/lib/types";

export function CatalogPage({
  kind,
  items,
  kicker,
}: {
  kind: CatalogItem["kind"];
  items: CatalogItem[];
  kicker?: string;
}) {
  const copy = categoryCopy(kind);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-[11px] uppercase tracking-[0.28em] text-moss">{kicker ?? "The sill"}</p>
      <h1 className="mt-3 font-display text-5xl leading-[1.02] text-ink md:text-6xl">{copy.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">{copy.lede}</p>
      <div className="mt-10">
        <CatalogGrid items={items} />
      </div>
    </div>
  );
}
