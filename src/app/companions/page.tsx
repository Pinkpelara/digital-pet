import { items } from "@/data/catalog";
import { CatalogPage } from "@/components/store/CatalogPage";

export const metadata = { title: "Companions" };

export default function CompanionsPage() {
  return <CatalogPage kind="companion" items={items.filter((item) => item.kind === "companion")} kicker="Adopt" />;
}
