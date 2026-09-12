"use client";

import { useState } from "react";
import { ShowreelSlot } from "@/components/store/ShowreelCanvas";
import { latestBehaviour, speciesName } from "@/lib/companion-view";
import { track } from "@/lib/analytics";
import { brand } from "@/lib/brand";
import type { CompanionInstance } from "@/lib/types";

/**
 * "What did they just do?"
 *
 * The full build will render a short privacy-safe clip of recent behaviour.
 * For now it makes a shareable card out of the state we actually have.
 */
export function WhatDidTheyDo({ instance }: { instance: CompanionInstance }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const line = `${instance.name} the ${speciesName(instance)} ${latestBehaviour(instance)}.`;
  const cardText = `${line}\n\nMeet your own at ${brand.domain}`;

  async function share() {
    track("clip_shared", { instanceId: instance.id });
    try {
      if (navigator.share) {
        await navigator.share({ title: `${instance.name} was up to something`, text: cardText });
        return;
      }
      await navigator.clipboard.writeText(cardText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-[1.6rem] bg-paper p-6 ring-1 ring-ink/8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-moss">What did they just do?</p>
          <p className="mt-2 font-display text-2xl text-ink">{line}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink"
        >
          {open ? "Hide card" : "Make a share card"}
        </button>
      </div>

      {open && (
        <div className="mt-6 overflow-hidden rounded-2xl bg-cream p-6 text-ink">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.2em] text-moss">Just now</p>
            <p className="text-xs text-ink-soft">{brand.domain}</p>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-24 w-24 items-end justify-center overflow-hidden rounded-xl bg-paper">
              <ShowreelSlot
                className="h-24 w-24"
                species={instance.speciesId}
                equipped={instance.equipped}
                demo="dance"
              />
            </div>
            <p className="font-display text-2xl leading-tight text-ink">
              {instance.name} {latestBehaviour(instance)}.
            </p>
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            Made from what {instance.name} actually did. Nothing on this card is invented.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => void share()} className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper">
              Share
            </button>
            {copied && <span className="text-sm text-moss">Copied to your clipboard.</span>}
          </div>
        </div>
      )}
    </section>
  );
}
