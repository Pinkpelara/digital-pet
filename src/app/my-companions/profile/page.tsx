import { ClientOnly } from "@/components/site/ClientOnly";
import { CompanionProfileView } from "./companion-profile-view";

export const metadata = { title: "Companion" };

export default function CompanionProfilePage() {
  return (
    <ClientOnly fallback={<div className="px-5 py-16 text-ink-soft">Finding them.</div>}>
      <CompanionProfileView />
    </ClientOnly>
  );
}
