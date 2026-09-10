import { NextResponse } from "next/server";
import { giftCodes } from "@/data/catalog";
import { isDemoMode } from "@/lib/demo-mode";
import { getActiveItems } from "@/lib/server/catalog";
import { createGrantToken } from "@/lib/server/tokens";
import { buildCheckoutSession, getStripeSecret } from "@/lib/stripe";

function requestOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
  const envOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  const headerOrigin =
    forwardedHost && !forwardedHost.startsWith("0.0.0.0") && !forwardedHost.startsWith("[::]")
      ? `${forwardedProto}://${forwardedHost}`
      : null;
  return (
    envOrigin ||
    headerOrigin ||
    new URL(request.url).origin.replace("://0.0.0.0", "://127.0.0.1").replace("://[::]", "://127.0.0.1")
  );
}

function wrapSession(request: Request, itemIds: string[], userId: string) {
  const catalog = getActiveItems();
  const selected = catalog.filter((item) => itemIds.includes(item.id));
  if (selected.length === 0) return null;
  const origin = requestOrigin(request);
  const token = createGrantToken({ userId, itemIds: selected.map((item) => item.id) });
  const path = `/adopt/success?items=${selected.map((item) => item.id).join(",")}&token=${token}`;
  const session = buildCheckoutSession({
    sessionId: `cs_demo_${crypto.randomUUID()}`,
    userId,
    items: selected,
    successUrl: `${origin}${path}`,
    cancelUrl: `${origin}/companions`,
    demo: isDemoMode() || !getStripeSecret(),
  });
  return { selected, token, path, session, origin };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const itemIds = (url.searchParams.get("itemIds") ?? "").split(",").filter(Boolean);
  const userId = url.searchParams.get("userId") ?? "demo-user";
  const wrapped = wrapSession(request, itemIds, userId);
  if (!wrapped) return NextResponse.json({ error: "Nothing to wrap." }, { status: 400 });
  return new NextResponse(null, { status: 303, headers: { Location: wrapped.path } });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    itemIds?: string[];
    userId?: string;
    email?: string;
    giftCode?: string;
  };

  const fromGift = body.giftCode ? giftCodes[body.giftCode.toUpperCase()]?.itemIds : undefined;
  const itemIds = fromGift ?? body.itemIds ?? [];
  const wrapped = wrapSession(request, itemIds, body.userId ?? "demo-user");
  if (!wrapped) return NextResponse.json({ error: "Nothing to wrap." }, { status: 400 });

  if (!getStripeSecret() || isDemoMode() || fromGift) {
    return NextResponse.json({
      url: `${wrapped.origin}${wrapped.path}`,
      path: wrapped.path,
      session: wrapped.session,
      demo: true,
    });
  }

  const stripe = await import("stripe").then((mod) => new mod.default(getStripeSecret()!));
  const live = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${wrapped.origin}${wrapped.path}`,
    cancel_url: `${wrapped.origin}/companions`,
    client_reference_id: body.userId ?? "demo-user",
    customer_email: body.email,
    metadata: wrapped.session.metadata,
    line_items: wrapped.session.line_items.map((line) => ({
      quantity: line.quantity,
      price_data: line.price_data,
    })),
  });

  return NextResponse.json({ url: live.url, session: { ...wrapped.session, id: live.id }, demo: false });
}
