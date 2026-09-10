import Link from "next/link";
import { companions, items } from "@/data/catalog";
import { Creature } from "@/components/creatures/Creature";
import { bringToDesktopUrl } from "@/lib/deep-link";
import { grantOwnership, listInstances } from "@/lib/server/grants";
import { readGrantToken } from "@/lib/server/tokens";

export const metadata = { title: "A parcel arrived" };
export const dynamic = "force-dynamic";

export default async function AdoptSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ items?: string; token?: string }>;
}) {
  const query = await searchParams;
  const itemIds = (query.items ?? "companion-bloop").split(",").filter(Boolean);
  const grantToken = query.token ?? "";
  const payload = grantToken ? readGrantToken(grantToken) : null;
  const userId = payload?.userId ?? "demo-user";
  const grantedIds = payload?.itemIds ?? itemIds;

  if (grantedIds.length) {
    grantOwnership({
      userId,
      itemIds: grantedIds,
      source: "purchase",
      stripeEventId: payload ? `token:${payload.nonce}` : `page:${grantedIds.join(",")}`,
    });
  }

  const companionItem = items.find((item) => grantedIds.includes(item.id) && item.kind === "companion");
  const species = companionItem?.speciesId ?? "bloop";
  const speciesMeta = companions.find((entry) => entry.id === species);
  const instance =
    listInstances(userId).find((row) => row.speciesId === species) ?? listInstances(userId).at(-1) ?? null;

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-moss">A parcel for you</p>
      <div className="relative mt-8 flex h-72 w-full items-end justify-center">
        <div className="parcel is-shaking is-open">
          <div className="parcel-box" />
          <div className="parcel-flap" />
        </div>
        <div className="creature-crawl absolute bottom-6">
          <Creature species={species} size={180} mood="happy" name={instance?.name ?? speciesMeta?.name} />
        </div>
      </div>

      {companionItem && instance ? (
        <form action="/api/companions/rename" method="POST" className="mt-8 w-full max-w-md">
          <input type="hidden" name="id" value={instance.id} />
          <label htmlFor="companion-name" className="font-display text-3xl text-ink">
            {speciesMeta?.name} crawled out. What will you call them?
          </label>
          <input
            id="companion-name"
            name="name"
            defaultValue={instance.name}
            className="mt-4 w-full rounded-full border border-ink/15 bg-paper px-5 py-3 text-center text-lg text-ink outline-none focus:border-moss"
            maxLength={24}
          />
          <button type="submit" className="mt-4 rounded-full bg-ink px-5 py-3 text-paper">
            That&apos;s their name
          </button>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={`/my-companions/${instance.id}`} className="rounded-full border border-ink/15 px-5 py-3 text-ink">
              Keep them here
            </Link>
            <a href={bringToDesktopUrl(instance.id)} className="rounded-full bg-cream px-5 py-3 text-ink">
              Bring to computer
            </a>
          </div>
        </form>
      ) : (
        <div className="mt-8">
          <h1 className="font-display text-4xl text-ink">Packed into your nest.</h1>
          <Link href="/inventory" className="mt-6 inline-block rounded-full bg-ink px-5 py-3 text-paper">
            Open inventory
          </Link>
        </div>
      )}
    </div>
  );
}
