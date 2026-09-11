"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WhereTheyLive } from "@/components/live/WhereTheyLive";
import { BirthdayVignette } from "@/components/home/BirthdayVignette";
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
      <BirthdayVignette compact />
      <p className="mt-10 max-w-2xl text-sm text-ink-soft">
        You can change your mind later. The website is always there. Browser pin is how they sit in
        the corner on a work machine. Desktop is an extra door into the same inventory — never a
        second checkout, never a loot box.
      </p>
    </div>
  );
}

export function LiveHub() {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-ink-soft">Finding them…</div>}>
      <LiveHubInner />
    </Suspense>
  );
}
