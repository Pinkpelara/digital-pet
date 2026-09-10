import { AdoptionCeremony } from "@/components/ceremony/AdoptionCeremony";
import { grantOwnership } from "@/lib/server/grants";
import { readGrantToken } from "@/lib/server/tokens";

export const metadata = { title: "A parcel arrived" };

export default async function AdoptSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ items?: string; token?: string }>;
}) {
  const query = await searchParams;
  const itemIds = (query.items ?? "companion-bloop").split(",").filter(Boolean);
  const grantToken = query.token ?? "";
  const payload = grantToken ? readGrantToken(grantToken) : null;
  if (payload) {
    grantOwnership({
      userId: payload.userId,
      itemIds: payload.itemIds,
      source: "purchase",
      stripeEventId: `token:${payload.nonce}`,
    });
  }

  return <AdoptionCeremony itemIds={itemIds} grantToken={grantToken} />;
}
