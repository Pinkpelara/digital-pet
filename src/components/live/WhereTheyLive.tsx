"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import { livePaths, liveIntro, type LivePathId } from "@/lib/live-paths";

export function WhereTheyLive({
  instanceId,
  companionName,
  heading = "h2",
}: {
  instanceId?: string;
  companionName?: string;
  heading?: "h1" | "h2";
}) {
  const copy = liveIntro(companionName);
  const Heading = heading;

  function choose(id: LivePathId) {
    track("home_path_chosen", { path: id, instanceId: instanceId ?? "" });
  }

  return (
    <section aria-labelledby="where-they-live-heading">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Three places, same inventory</p>
      <Heading id="where-they-live-heading" className="mt-2 font-display text-4xl text-ink md:text-5xl">
        {copy.title}
      </Heading>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">{copy.lede}</p>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {livePaths.map((path) => (
          <li key={path.id}>
            <Link
              href={path.href(instanceId)}
              onClick={() => choose(path.id)}
              className="flex h-full flex-col rounded-2xl bg-paper p-6 text-left ring-1 ring-ink/10 transition hover:-translate-y-0.5 hover:ring-ink/20"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-moss">{path.kicker}</p>
              <p className="mt-2 w-fit rounded-full bg-cream px-2 py-0.5 text-[11px] uppercase tracking-wider text-ink">
                {path.badge}
              </p>
              <h3 className="mt-3 font-display text-2xl text-ink">{path.title}</h3>
              <p className="mt-2 flex-1 text-sm text-ink-soft">{path.body}</p>
              <span className="mt-5 inline-flex w-fit rounded-full bg-ink px-4 py-2 text-sm text-paper">
                {path.cta}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
