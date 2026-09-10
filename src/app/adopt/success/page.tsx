import { AdoptionCeremony } from "@/components/ceremony/AdoptionCeremony";

export const metadata = { title: "A parcel arrived" };

export default async function AdoptSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ items?: string; token?: string }>;
}) {
  const query = await searchParams;
  const itemIds = (query.items ?? "companion-bloop").split(",").filter(Boolean);
  const grantToken = query.token ?? "";

  return <AdoptionCeremony itemIds={itemIds} grantToken={grantToken} />;
}
