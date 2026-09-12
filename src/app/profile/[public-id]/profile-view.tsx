"use client";

import { useMemo } from "react";
import { ShowreelCanvas, ShowreelSlot } from "@/components/store/ShowreelCanvas";
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
  };

  return (
    <ShowreelCanvas>
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="kicker">Public profile · {publicId}</p>
        <h1 className="mt-3 font-display text-5xl leading-[0.92] text-ink md:text-6xl">{user?.displayName ?? "Someone"}&apos;s companions</h1>
        <p className="mt-3 text-ink-soft">A quiet look at someone&apos;s companion. No comments, no feed.</p>
        <div className="mt-8 rounded-[2rem] bg-mist p-8 ring-1 ring-ink/10">
          <div className="mx-auto h-56 w-56">
            <ShowreelSlot
              className="h-56 w-56"
              species={showcase.speciesId}
              equipped={showcase.equipped}
            />
          </div>
          <p className="mt-3 font-display text-3xl">{showcase.name}</p>
        </div>
      </div>
    </ShowreelCanvas>
  );
}
