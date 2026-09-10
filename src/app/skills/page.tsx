import { items } from "@/data/catalog";
import { CatalogPage } from "@/components/store/CatalogPage";

export const metadata = { title: "Skills" };

export default function SkillsPage() {
  return <CatalogPage kind="skill" items={items.filter((item) => item.kind === "skill")} />;
}
