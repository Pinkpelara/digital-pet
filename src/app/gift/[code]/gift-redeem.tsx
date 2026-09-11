"use client";

import Link from "next/link";
import { giftCodes, items } from "@/data/catalog";
import { LiveStage } from "@/components/stage/LiveStage";
import { adoptHref } from "@/lib/catalog-paths";
import { track } from "@/lib/analytics";
import { useNest } from "@/lib/state/nest-context";

export function GiftRedeem({ code }: { code: string }) {
  const gift = giftCodes[code.toUpperCase()];
  const { signInDemo } = useNest();
  const first = gift ? items.find((item) => gift.itemIds.includes(item.id)) : undefined;
  const species = first?.speciesId ?? (first?.looksGoodWith.includes("companion-niblet") ? "niblet" : "bloop");

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-sm font-medium text-moss">A gift</p>
      <h1 className="mt-2 font-display text-5xl text-ink">{code}</h1>
      {gift ? (
        <>
          <div className="mx-auto mt-8 h-72 w-full overflow-hidden rounded-[1.8rem] bg-cream">
            <LiveStage species={species} className="h-full w-full" mood="happy" cameraZ={5.5} />
          </div>
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
