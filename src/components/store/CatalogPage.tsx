import { CatalogGrid } from "@/components/store/CatalogGrid";
import { PageHero } from "@/components/site/KineticTitle";
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
  const showreel = kind === "gadget" || kind === "skill";
  return (
    <div className="relative overflow-hidden bg-paper pb-20">
      <PageHero
        kicker={kicker ?? (showreel ? "Silent showreel" : "Store")}
        title={copy.title}
        lede={copy.lede}
      />
      <div className="mx-auto max-w-6xl px-4 md:px-10">
        <CatalogGrid
          items={items}
          className={showreel ? "grid gap-5 md:grid-cols-2" : undefined}
        />
      </div>
    </div>
  );
}
