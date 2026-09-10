import { items } from "@/data/catalog";
import { CatalogPage } from "@/components/store/CatalogPage";

export const metadata = { title: "Closet" };

export default function ClosetPage() {
  return <CatalogPage kind="outfit" items={items.filter((item) => item.kind === "outfit")} />;
}
