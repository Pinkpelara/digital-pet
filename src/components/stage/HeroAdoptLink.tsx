"use client";

import Link from "next/link";
import { profileHref } from "@/lib/catalog-paths";
import { useNest } from "@/lib/state/nest-context";

export function HeroAdoptLink({ adoptFrom }: { adoptFrom: string }) {
  const nest = useNest();
  const roommate = nest.hydrated ? nest.instances[0] : null;
  const name = roommate?.name ?? "Bloop";

  if (roommate) {
    return (
      <Link href={profileHref(roommate.id)} prefetch={false} className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
        Back to {name}
      </Link>
    );
  }

  return (
    <Link href="/companions/bloop" prefetch={false} className="rounded-full bg-ink px-6 py-3 text-sm text-paper">
      Adopt from {adoptFrom}. Start with Bloop.
    </Link>
  );
}
