"use client";

import { useState } from "react";
import { Creature } from "@/components/creatures/Creature";
import { speciesName } from "@/lib/companion-view";
import { track } from "@/lib/analytics";
import type { CompanionInstance } from "@/lib/types";

/**
 * The personality reveal card. Two owners of the same species compare these.
 */
export function PersonalityReveal({ instance }: { instance: CompanionInstance }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const title = personalityHeadline(instance);
  const lines = personalityBody(instance);

  async function share() {
    const text = `We think we figured ${instance.name} out.\n\n${title}\n${lines
      .map((line) => `· ${line}`)
      .join("\n")}\n\n— a ${speciesName(instance)}`;
    track("personality_revealed", { instanceId: instance.id, shared: true });
    try {
      if (navigator.share) {
        await navigator.share({ title: `We figured ${instance.name} out`, text });
        return;
      }
      await navigator.clipboard.writeText(text);
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
          <p className="kicker">Personality</p>
          <p className="mt-2 font-display text-2xl text-ink">
            We think we figured {instance.name} out.
          </p>
        </div>
        <button type="button" onClick={() => setOpen((prev) => !prev)} className="btn btn-ghost">
          {open ? "Hide card" : "Show the card"}
        </button>
      </div>

      {open && (
        <div className="mt-6 overflow-hidden rounded-[24px] bg-gold/25 p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
                {speciesName(instance)} · {instance.name}
              </p>
              <p className="mt-2 font-display text-4xl uppercase leading-none text-ink md:text-5xl">
                {title}
              </p>
            </div>
            <Creature species={instance.speciesId} size={120} mood="idle" equipped={instance.equipped} decorative />
          </div>
          <ul className="mt-6 space-y-2 text-lg text-ink">
            {lines.map((line) => (
              <li key={line}>· {line}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-soft">
            Nobody chose this. It was decided when {instance.name} was adopted.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => void share()} className="btn btn-primary">
              Share
            </button>
            {copied && <span className="text-sm text-moss">Copied to your clipboard.</span>}
          </div>
        </div>
      )}
    </section>
  );
}

function personalityHeadline(instance: CompanionInstance): string {
  const discovered = instance.discovered.map((entry) => entry.label.toUpperCase());
  if (discovered.length >= 2) return discovered.slice(0, 2).join(" ");
  if (discovered.length === 1) return `${discovered[0]} ???`;
  return "STILL A MYSTERY";
}

function personalityBody(instance: CompanionInstance): string[] {
  const map: Record<string, string> = {
    Curious: "Curious about everything.",
    Nosy: "Reads your tabs when you leave the room.",
    Cowardly: "Brave about almost nothing.",
    Brave: "Brave to the point of bad decisions.",
    Clingy: "Follows your cursor like a small shadow.",
    Sleepy: "Naps constantly. Deeply committed to it.",
    Restless: "Never stops moving.",
    Dramatic: "Every nap is an aria.",
    Chaotic: "Starts problems it cannot finish.",
    "Show-off": "Performs for an audience of zero.",
    Shy: "Comes closer only if you wait.",
    Friendly: "Greets everything, including icons.",
  };
  const lines = instance.discovered.map((entry) => map[entry.label] ?? entry.label);
  if (lines.length === 0) return ["Nothing observed yet. Live together a while."];
  return lines;
}
