"use client";

import { useMemo } from "react";
import { companions } from "@/data/catalog";
import { Creature } from "@/components/creatures/Creature";
import { useNest } from "@/lib/state/nest-context";

export function ProfileView({ publicId }: { publicId: string }) {
  const { instances, user, hydrated } = useNest();
  const mine = useMemo(
    () => instances.filter((row) => row.publicId === publicId || user?.publicId === publicId),
    [instances, publicId, user?.publicId],
  );

  if (!hydrated) return <div className="px-4 py-16 text-ink-soft">Looking through the window…</div>;

  const showcase = mine[0] ?? {
    name: "A visiting companion",
    speciesId: "bloop" as const,
    equipped: { body: "outfit-raincoat" },
    stats: companions[0].defaultStats,
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="kicker">Public profile · {publicId}</p>
      <h1 className="mt-3 font-display text-5xl leading-[0.92] text-ink md:text-6xl">{user?.displayName ?? "Someone"}&apos;s companions</h1>
      <p className="mt-3 text-ink-soft">
        A quiet showcase — no comments, no feed, no kids chat. Just a companion you can look at.
      </p>
      <div className="mt-8 rounded-[2rem] bg-mist p-8 ring-1 ring-ink/10">
        <Creature species={showcase.speciesId} size={240} equipped={showcase.equipped} name={showcase.name} />
        <p className="mt-3 font-display text-3xl">{showcase.name}</p>
      </div>
    </div>
  );
}
