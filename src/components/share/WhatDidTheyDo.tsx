"use client";

import { useState } from "react";
import { Creature } from "@/components/creatures/Creature";
import { latestBehaviour, speciesName } from "@/lib/companion-view";
import { track } from "@/lib/analytics";
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
  const cardText = `${line}\n\nMeet your own at companions.app`;

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
    <section className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="kicker">What did they just do?</p>
          <p className="mt-2 font-display text-2xl text-ink">{line}</p>
        </div>
        <button type="button" onClick={() => setOpen((prev) => !prev)} className="btn btn-ghost">
          {open ? "Hide card" : "Make a share card"}
        </button>
      </div>

      {open && (
        <div className="mt-6 overflow-hidden rounded-[24px] bg-void p-6 text-mist">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.2em] text-moss">Just now</p>
            <p className="text-xs text-mist/60">companions.app</p>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Creature species={instance.speciesId} size={110} mood="happy" equipped={instance.equipped} decorative />
            <p className="font-display text-2xl leading-tight text-paper">
              {instance.name} {latestBehaviour(instance)}.
            </p>
          </div>
          <p className="mt-4 text-sm text-mist/60">
            Clip rendering is coming. Today this card is built from real behaviour counters —
            nothing is invented.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => void share()} className="btn btn-accent">
              Share
            </button>
            {copied && <span className="text-sm text-moss">Copied to your clipboard.</span>}
          </div>
        </div>
      )}
    </section>
  );
}
