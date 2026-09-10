"use client";

import { useMemo } from "react";
import { companions } from "@/data/catalog";
import { Creature } from "@/components/creatures/Creature";
import { discoveredLabels } from "@/lib/personality";
import { useNest } from "@/lib/state/nest-context";

export function ProfileView({ publicId }: { publicId: string }) {
  const { instances, user, hydrated } = useNest();
  const mine = useMemo(
    () => instances.filter((row) => row.publicId === publicId || user?.publicId === publicId),
    [instances, publicId, user?.publicId],
  );

  if (!hydrated) return <div className="px-5 py-16 text-ink-soft">Looking through the window.</div>;

  const showcase = mine[0] ?? {
    name: "A visiting companion",
    speciesId: "bloop" as const,
    equipped: { body: "outfit-raincoat" },
    discovered: [],
  };

  const labels = "discovered" in showcase ? discoveredLabels(showcase.discovered) : [];

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 text-center">
      <p className="kicker">Shared companion · {publicId}</p>
      <h1 className="mt-2 font-display text-5xl text-ink">
        {user?.displayName ?? "Someone"}&apos;s companion
      </h1>
      <p className="mt-3 text-ink-soft">
        A quiet showcase. No comments, no feed, no messaging — just a creature you can look at.
      </p>
      <div className="card mt-8 p-8">
        <Creature
          species={showcase.speciesId}
          size={240}
          equipped={showcase.equipped}
          name={showcase.name}
        />
        <p className="mt-3 font-display text-3xl text-ink">{showcase.name}</p>
        {labels.length > 0 && (
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {labels.map((label) => (
              <li key={label} className="chip">
                {label}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-sm text-ink-soft">
          Species: {companions.find((entry) => entry.id === showcase.speciesId)?.name}
        </p>
      </div>
    </div>
  );
}
