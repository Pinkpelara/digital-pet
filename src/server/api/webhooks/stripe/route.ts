import { NextResponse } from "next/server";
import { grantOwnership } from "@/lib/server/grants";
import { getWebhookSecret } from "@/lib/stripe";

/**
 * Stripe webhook: the only production path that inserts ownership.
 * Verifies the event, then grants entitlements idempotently by event.id.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  const secret = getWebhookSecret();
  let event: { id: string; type: string; data: { object: { metadata?: { userId?: string; itemIds?: string } } } };

  if (secret && process.env.STRIPE_SECRET_KEY) {
    const stripe = await import("stripe").then((mod) => new mod.default(process.env.STRIPE_SECRET_KEY!));
    const signature = request.headers.get("stripe-signature");
    if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    try {
      event = stripe.webhooks.constructEvent(raw, signature, secret) as typeof event;
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    event = JSON.parse(raw) as typeof event;
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const metadata = event.data.object.metadata ?? {};
  const userId = metadata.userId;
  const itemIds = (metadata.itemIds ?? "").split(",").filter(Boolean);
  if (!userId || itemIds.length === 0) {
    return NextResponse.json({ error: "Missing grant metadata" }, { status: 422 });
  }

  const result = grantOwnership({
    userId,
    itemIds,
    source: "purchase",
    stripeEventId: event.id,
  });

  return NextResponse.json({
    received: true,
    alreadyGranted: result.alreadyGranted,
    granted: result.ownership.length,
  });
}
