"use client";

import { useClientMounted } from "@/lib/state/use-client-mounted";
import { idleMs } from "@/lib/state/presence";

/** Soft Finch-style care chips. Labels, not a kids health bar. */
export function CareChips({ className = "" }: { className?: string }) {
  const mounted = useClientMounted();
  if (!mounted) {
    return (
      <ul className={`flex flex-wrap gap-2 ${className}`}>
        <li className="rounded-full bg-mist px-3 py-1.5 text-sm text-ink ring-1 ring-ink/10">
          <span className="text-ink-soft">Energy · </span>Rested
        </li>
        <li className="rounded-full bg-mist px-3 py-1.5 text-sm text-ink ring-1 ring-ink/10">
          <span className="text-ink-soft">Mood · </span>Curious
        </li>
      </ul>
    );
  }

  const idle = idleMs();
  const energy = idle > 8 * 60 * 60 * 1000 ? "Quiet" : idle > 20000 ? "Resting" : "Rested";
  const mood = idle > 20000 ? "Waiting" : idle > 8000 ? "Soft" : "Curious";

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      <li className="rounded-full bg-mist px-3 py-1.5 text-sm text-ink ring-1 ring-ink/10">
        <span className="text-ink-soft">Energy · </span>
        {energy}
      </li>
      <li className="rounded-full bg-mist px-3 py-1.5 text-sm text-ink ring-1 ring-ink/10">
        <span className="text-ink-soft">Mood · </span>
        {mood}
      </li>
      <li className="rounded-full bg-mist px-3 py-1.5 text-sm text-ink-soft ring-1 ring-ink/10">from today’s habits</li>
    </ul>
  );
}
