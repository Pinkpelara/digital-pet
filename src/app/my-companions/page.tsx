"use client";

import Link from "next/link";
import { Creature } from "@/components/creatures/Creature";
import { useNest } from "@/lib/state/nest-context";

export default function MyCompanionsPage() {
  const { instances, hydrated, user } = useNest();

  if (!hydrated) {
    return <div className="mx-auto max-w-6xl px-4 py-16 text-ink-soft">Warming the nest…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">My companions</p>
      <h1 className="mt-2 font-display text-5xl text-ink">{user ? `${user.displayName}'s nest` : "Your nest"}</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Customization lives here: a big live character, LOOK / GADGET / SKILLS / PERSONALITY, and Save outfit.
      </p>
      {instances.length === 0 ? (
        <div className="mt-10 rounded-[2rem] bg-paper p-8 ring-1 ring-ink/8">
          <p className="text-lg text-ink">The sill is empty — in a hopeful way.</p>
          <Link href="/companions" className="mt-4 inline-block rounded-full bg-ink px-5 py-3 text-paper">
            Adopt someone
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {instances.map((instance) => (
            <Link
              key={instance.id}
              href={`/my-companions/${instance.id}`}
              className="card-lift rounded-[1.6rem] bg-paper p-6 ring-1 ring-ink/8"
            >
              <Creature species={instance.speciesId} size={180} equipped={instance.equipped} name={instance.name} />
              <h2 className="mt-2 font-display text-3xl">{instance.name}</h2>
              <p className="text-sm text-ink-soft">Open the studio</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
