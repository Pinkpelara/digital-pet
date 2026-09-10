import { NextResponse } from "next/server";
import { grantOwnership } from "@/lib/server/grants";
import { readGrantToken } from "@/lib/server/tokens";

export async function POST(request: Request) {
  const body = (await request.json()) as { token?: string; userId?: string };
  if (!body.token) {
    return NextResponse.json({ error: "Missing grant token" }, { status: 400 });
  }

  const payload = readGrantToken(body.token);
  if (!payload) {
    return NextResponse.json({ error: "The ribbon seal did not match." }, { status: 403 });
  }
  if (body.userId && body.userId !== payload.userId) {
    return NextResponse.json({ error: "This parcel belongs to another nest." }, { status: 403 });
  }

  const result = grantOwnership({
    userId: payload.userId,
    itemIds: payload.itemIds,
    source: "purchase",
    stripeEventId: `token:${payload.nonce}`,
  });

  return NextResponse.json({
    ownership: result.ownership,
    instances: result.instances,
    discoveries: result.discoveries,
  });
}
