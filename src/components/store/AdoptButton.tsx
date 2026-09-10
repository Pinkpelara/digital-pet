"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { formatPrice } from "@/lib/format";
import { useNest } from "@/lib/state/nest-context";

export function AdoptButton({
  itemIds,
  priceCents,
  label = "Adopt",
  className,
}: {
  itemIds: string[];
  priceCents: number;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const { owns, user, signInDemo } = useNest();
  const [busy, setBusy] = useState(false);
  const already = itemIds.every((id) => owns(id));

  if (already) {
    return (
      <a
        href="/inventory"
        className={`inline-flex items-center justify-center rounded-full bg-moss px-5 py-3 text-paper ${className ?? ""}`}
      >
        In your nest
      </a>
    );
  }

  async function checkout() {
    setBusy(true);
    const sessionUser = user ?? signInDemo();
    track("checkout_started", { itemIds: itemIds.join(","), demo: true });
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemIds,
          userId: sessionUser.id,
          email: sessionUser.email,
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      router.push(data.url);
    } catch (error) {
      console.error(error);
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={checkout}
      disabled={busy}
      className={`inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-paper transition hover:bg-ink/90 disabled:opacity-60 ${className ?? ""}`}
    >
      {busy ? "Tying the parcel…" : `${label} ${formatPrice(priceCents)}`}
    </button>
  );
}
