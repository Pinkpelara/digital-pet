import { items } from "@/data/catalog";
import { CatalogPage } from "@/components/store/CatalogPage";

export const metadata = { title: "Gadgets" };

export default function GadgetsPage() {
  return <CatalogPage kind="gadget" items={items.filter((item) => item.kind === "gadget")} />;
}
