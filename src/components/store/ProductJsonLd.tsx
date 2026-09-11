import { isShopSafe } from "@/lib/catalog-paths";
import { brand } from "@/lib/brand";
import type { CatalogItem } from "@/lib/types";

export function ProductJsonLd({ item }: { item: CatalogItem }) {
  const url = `https://pinkpelara.github.io/digital-pet${
    item.kind === "companion" ? `/companions/${item.slug}/` : `/item/${item.slug}/`
  }`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.kind === "skill" ? `Teach ${item.name}` : item.name,
    description: item.description,
    sku: item.sku,
    brand: { "@type": "Brand", name: brand.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (item.priceCents / 100).toFixed(2),
      availability: isShopSafe(item) ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      url,
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
