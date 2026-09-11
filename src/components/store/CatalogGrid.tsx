"use client";

import { ProductCard } from "@/components/store/ProductCard";
import { hrefForItem } from "@/lib/catalog-paths";
import { useNest } from "@/lib/state/nest-context";
import type { CatalogItem } from "@/lib/types";

export function CatalogGrid({ items, className }: { items: CatalogItem[]; className?: string }) {
  const { owns } = useNest();
  return (
    <div className={className ?? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"}>
      {items.map((item) => (
        <ProductCard key={item.id} item={item} href={hrefForItem(item)} owned={owns(item.id)} />
      ))}
    </div>
  );
}
