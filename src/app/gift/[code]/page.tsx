"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { giftCodes } from "@/data/catalog";
import { track } from "@/lib/analytics";
import { useNest } from "@/lib/state/nest-context";

export default function GiftPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const router = useRouter();
  const { user, signInDemo } = useNest();
  const gift = giftCodes[code.toUpperCase()];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function redeem() {
    if (!gift) return;
    setBusy(true);
    const sessionUser = user ?? signInDemo();
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemIds: gift.itemIds,
        userId: sessionUser.id,
        email: sessionUser.email,
        giftCode: code,
      }),
    });
    const data = (await response.json()) as { url?: string; path?: string; error?: string };
    if (!response.ok || !(data.path || data.url)) {
      setError(data.error ?? "This ribbon would not untie.");
      setBusy(false);
      return;
    }
    track("gift_redeemed", { code });
    router.push(data.path ?? data.url!);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">A gift</p>
      <h1 className="mt-2 font-display text-5xl text-ink">{code}</h1>
      {gift ? (
        <>
          <p className="mt-4 text-lg text-ink-soft">{gift.note}</p>
          <button
            type="button"
            onClick={redeem}
            disabled={busy}
            className="mt-8 rounded-full bg-ink px-5 py-3 text-paper disabled:opacity-60"
          >
            {busy ? "Unwrapping…" : "Open the parcel"}
          </button>
        </>
      ) : (
        <p className="mt-4 text-ink-soft">We could not find a parcel with that string. Try WELCOME-BLOOP.</p>
      )}
      {error && <p className="mt-4 text-sm text-peach">{error}</p>}
    </div>
  );
}
