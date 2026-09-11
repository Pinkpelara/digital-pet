import Link from "next/link";
import { LiveStage } from "@/components/stage/LiveStage";
import { companions } from "@/data/catalog";
import type { CreatureMood, SpeciesId } from "@/lib/types";

const moods: Record<SpeciesId, CreatureMood> = {
  bloop: "climb",
  mochi: "nap",
  sprout: "follow",
  niblet: "happy",
};

export function PersonalityCards({
  featured = false,
}: {
  featured?: boolean;
}) {
  return (
    <ol className={`grid gap-4 ${featured ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2"}`}>
      {companions.map((companion) => (
        <li key={companion.id}>
          <Link href={`/companions/${companion.slug}`} className="poster-card group block rounded-[1.6rem]">
            <div className="aspect-[4/5]">
              <LiveStage
                species={companion.id}
                mood={moods[companion.id]}
                className="h-full w-full"
                cameraZ={5.45}
                followPointer
                quality="medium"
                dprMax={1}
              />
            </div>
            <div className="film-wash" aria-hidden />
            <div className="poster-copy">
              <p className="text-[11px] font-semibold tracking-[0.28em] text-moss">{companion.alias}</p>
              <h3 className="mt-1 font-display text-4xl leading-none text-ink group-hover:text-moss md:text-5xl">
                {companion.name}
              </h3>
              <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-ink-soft">{companion.title}</p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
