import { items } from "@/data/catalog";
import { CatalogPage } from "@/components/store/CatalogPage";

export const metadata = { title: "Limited drops" };

export default function DropsPage() {
  return (
    <CatalogPage
      kind="drop"
      items={items.filter((item) => item.kind === "drop")}
      kicker="While the weather holds"
    />
  );
}
