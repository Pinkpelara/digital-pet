import { isShopSafe } from "@/lib/catalog-paths";
import { brand } from "@/lib/brand";
import { adoptFromCents, catalogById } from "@/data/catalog";
import { formatPrice } from "@/lib/format";
import type { CatalogItem } from "@/lib/types";

function offerName(item: CatalogItem): string {
  if (item.id === "companion-bloop") return `Adopt from ${formatPrice(item.priceCents)}`;
  if (item.kind === "companion") return `Adopt ${item.name}`;
  return item.name;
}

export function ProductJsonLd({ item }: { item: CatalogItem }) {
  const url = `https://pinkpelara.github.io/digital-pet${
    item.kind === "companion" ? `/companions/${item.slug}/` : `/item/${item.slug}/`
  }`;
  const sticker = (item.priceCents / 100).toFixed(2);
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.description,
    sku: item.sku,
    brand: { "@type": "Brand", name: brand.name },
    offers: {
      "@type": "Offer",
      name: offerName(item),
      priceCurrency: "USD",
      price: sticker,
      availability: isShopSafe(item) ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      url,
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

/** Homepage: Bloop Product + Offer at the real adopt-from sticker ($5.99). */
export function HomeProductJsonLd() {
  const bloop = catalogById.get("companion-bloop");
  const fromCents = bloop?.priceCents ?? adoptFromCents();
  const from = formatPrice(fromCents);
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Bloop",
    description: bloop?.description ?? brand.hero,
    sku: bloop?.sku ?? "cmp-bloop",
    brand: { "@type": "Brand", name: brand.name },
    offers: {
      "@type": "Offer",
      name: `Adopt from ${from}`,
      priceCurrency: "USD",
      price: (fromCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: "https://pinkpelara.github.io/digital-pet/companions/bloop/",
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: "https://pinkpelara.github.io/digital-pet/",
    description: brand.hero,
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
