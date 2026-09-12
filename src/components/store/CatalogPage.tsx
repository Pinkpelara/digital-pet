import { CatalogGrid } from "@/components/store/CatalogGrid";
import { ShowreelCanvas } from "@/components/store/ShowreelCanvas";
import { PageHero } from "@/components/site/KineticTitle";
import { categoryCopy, orderForShop } from "@/lib/catalog-paths";
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
  const ordered = orderForShop(items);
  return (
    <ShowreelCanvas>
      <div className="relative overflow-hidden bg-paper pb-20">
        <PageHero kicker={kicker ?? copy.kicker} title={copy.title} lede={copy.lede} />
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <CatalogGrid items={ordered} />
        </div>
      </div>
    </ShowreelCanvas>
  );
}
