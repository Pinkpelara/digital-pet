import Link from "next/link";
import { ClientOnly } from "@/components/site/ClientOnly";
import { LiveHub } from "./live-hub";

export const metadata = { title: "Where they live" };

export default function LivePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <ClientOnly fallback={<div className="text-ink-soft">Finding them.</div>}>
        <LiveHub />
      </ClientOnly>
      <p className="mt-8">
        <Link href="/my-companions" className="text-sm text-moss underline">
          Back to your companions
        </Link>
      </p>
    </div>
  );
}
