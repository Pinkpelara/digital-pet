import { Suspense } from "react";
import { AdoptCeremony } from "./ceremony";

export const metadata = { title: "A parcel arrived" };

export default function AdoptSuccessPage() {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-center text-ink-soft">Untying the ribbon…</div>}>
      <AdoptCeremony />
    </Suspense>
  );
}
