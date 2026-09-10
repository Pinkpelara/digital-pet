"use client";

import Link from "next/link";
import { giftCodes } from "@/data/catalog";
import { adoptHref } from "@/lib/catalog-paths";
import { track } from "@/lib/analytics";
import { useNest } from "@/lib/state/nest-context";

export function GiftRedeem({ code }: { code: string }) {
  const gift = giftCodes[code.toUpperCase()];
  const { signInDemo } = useNest();

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">A gift</p>
      <h1 className="mt-2 font-display text-5xl text-ink">{code}</h1>
      {gift ? (
        <>
          <p className="mt-4 text-lg text-ink-soft">{gift.note}</p>
          <Link
            href={adoptHref(gift.itemIds)}
            onClick={() => {
              signInDemo();
              track("gift_redeemed", { code });
            }}
            className="mt-8 inline-block rounded-full bg-ink px-5 py-3 text-paper"
          >
            Open the parcel
          </Link>
        </>
      ) : (
        <p className="mt-4 text-ink-soft">We could not find a parcel with that string. Try WELCOME-BLOOP.</p>
      )}
    </div>
  );
}
