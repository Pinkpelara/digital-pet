import { giftCodes } from "@/data/catalog";
import { GiftRedeem } from "./gift-redeem";

export function generateStaticParams() {
  return Object.keys(giftCodes).map((code) => ({ code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return { title: code.toUpperCase() };
}

export default async function GiftPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <GiftRedeem code={code} />;
}
