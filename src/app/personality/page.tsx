import { items } from "@/data/catalog";
import { CatalogPage } from "@/components/store/CatalogPage";

export const metadata = { title: "Personality packs" };

export default function PersonalityPage() {
  return <CatalogPage kind="personality" items={items.filter((item) => item.kind === "personality")} />;
}
