"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { profileHref } from "@/lib/catalog-paths";
import { readMarkSeen } from "@/lib/state/presence";
import { useNest } from "@/lib/state/nest-context";

const AWAY_MS = 6 * 3600 * 1000;

const LINES = [
  "knocked the plant over. Looked at you. Denied it.",
  "ended up behind the footer. Won't explain how.",
  "learned a new way to fall down the stairs.",
  "moved every pixel two inches left. Put them back. Mostly.",
  "stared at the cursor for an hour. It never moved. Riveting.",
  "found a new favourite spot. It's inconvenient.",
];

function pick(lines: string[], salt: string): string {
  let h = 2166136261;
  for (let i = 0; i < salt.length; i += 1) {
    h ^= salt.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return lines[(h >>> 0) % lines.length];
}

/**
 * "Something happened while you were gone."
 * Rare things happen when nobody is watching. A funny card on return —
 * never guilt, never a streak, never "he missed you".
 */
export function AwayNote() {
  const { instances, hydrated } = useNest();
  const [line, setLine] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [targetId, setTargetId] = useState<string | null>(null);
  const checked = useRef(false);

  useEffect(() => {
    if (!hydrated || checked.current || instances.length === 0) return;
    checked.current = true;
    const { awayMs } = readMarkSeen();
    if (awayMs < AWAY_MS) return;
    const first = instances[0];
    const others = instances.filter((row) => row.id !== first.id);
    const day = new Date().toISOString().slice(0, 10);
    const meeting =
      others.length > 0 && pick(["a", "b"], `${day}:${first.id}`) === "a"
        ? `held a meeting with ${others[0].name}. No notes.`
        : null;
    setLine(meeting ?? pick(LINES, `${day}:${first.id}`));
    setName(first.name);
    setTargetId(first.id);
  }, [hydrated, instances]);

  if (!line) return null;

  return (
    <section className="mb-8 rounded-[1.6rem] bg-mist p-6 ring-1 ring-ink/10 md:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">While you were gone</p>
      <p className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl">
        Something happened while you were gone.
      </p>
      <p className="mt-3 max-w-xl text-lg text-ink-soft">
        Apparently {name} {line}
      </p>
      <p className="mt-2 text-sm text-ink-soft">Nothing bad happened. Something funny did.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {targetId && (
          <Link
            href={profileHref(targetId)}
            className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper"
          >
            Check on {name}
          </Link>
        )}
        <button
          type="button"
          onClick={() => setLine(null)}
          className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink"
        >
          Noted
        </button>
      </div>
    </section>
  );
}
