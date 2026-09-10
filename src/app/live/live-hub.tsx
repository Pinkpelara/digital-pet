"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WhereTheyLive } from "@/components/live/WhereTheyLive";
import { useNest } from "@/lib/state/nest-context";

function LiveHubInner() {
  const params = useSearchParams();
  const id = params.get("id");
  const { instances, hydrated } = useNest();
  const instance = instances.find((row) => row.id === id) ?? null;
  const name = hydrated ? instance?.name : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <WhereTheyLive heading="h1" instanceId={instance?.id ?? id ?? undefined} companionName={name} />
      <p className="mt-10 max-w-2xl text-sm text-ink-soft">
        You can change your mind later. The nest on this website is always there. Browser pin and desktop app are extra
        doors into the same belongings — never a second checkout, never a loot box.
      </p>
    </div>
  );
}

export function LiveHub() {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-ink-soft">Finding a perch…</div>}>
      <LiveHubInner />
    </Suspense>
  );
}
