import { ClientOnly } from "@/components/site/ClientOnly";
import { AdoptCeremony } from "./ceremony";

export const metadata = { title: "A parcel arrived" };

export default function AdoptSuccessPage() {
  return (
    <ClientOnly fallback={<div className="px-4 py-20 text-center text-ink-soft">Untying the ribbon…</div>}>
      <AdoptCeremony />
    </ClientOnly>
  );
}
