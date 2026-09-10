import { NextResponse } from "next/server";
import { giftCodes } from "@/data/catalog";
import { isDemoMode } from "@/lib/demo-mode";
import { getActiveItems } from "@/lib/server/catalog";
import { createGrantToken } from "@/lib/server/tokens";
import { buildCheckoutSession, getStripeSecret } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    itemIds?: string[];
    userId?: string;
    email?: string;
    giftCode?: string;
  };

  const fromGift = body.giftCode ? giftCodes[body.giftCode.toUpperCase()]?.itemIds : undefined;
  const itemIds = fromGift ?? body.itemIds ?? [];
  const catalog = getActiveItems();
  const selected = catalog.filter((item) => itemIds.includes(item.id));
  if (selected.length === 0) {
    return NextResponse.json({ error: "Nothing to wrap." }, { status: 400 });
  }

  const userId = body.userId ?? "demo-user";
  const origin = new URL(request.url).origin;
  const token = createGrantToken({ userId, itemIds: selected.map((item) => item.id) });
  const successUrl = `${origin}/adopt/success?items=${selected.map((item) => item.id).join(",")}&token=${token}`;
  const cancelUrl = `${origin}/companions`;
  const session = buildCheckoutSession({
    sessionId: `cs_demo_${crypto.randomUUID()}`,
    userId,
    items: selected,
    successUrl,
    cancelUrl,
    demo: isDemoMode() || Boolean(fromGift) || !getStripeSecret(),
  });

  if (!getStripeSecret() || isDemoMode() || fromGift) {
    return NextResponse.json({
      url: successUrl,
      session,
      demo: true,
    });
  }

  const stripe = await import("stripe").then((mod) => new mod.default(getStripeSecret()!));
  const live = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    customer_email: body.email,
    metadata: session.metadata,
    line_items: session.line_items.map((line) => ({
      quantity: line.quantity,
      price_data: line.price_data,
    })),
  });

  return NextResponse.json({ url: live.url, session: { ...session, id: live.id }, demo: false });
}
