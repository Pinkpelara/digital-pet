import type { CatalogItem, CheckoutSessionShape } from "@/lib/types";

export function buildCheckoutSession(input: {
  sessionId: string;
  userId: string;
  items: CatalogItem[];
  successUrl: string;
  cancelUrl: string;
  demo: boolean;
}): CheckoutSessionShape {
  return {
    id: input.sessionId,
    object: "checkout.session",
    mode: "payment",
    currency: "usd",
    status: "open",
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    client_reference_id: input.userId,
    metadata: {
      userId: input.userId,
      itemIds: input.items.map((item) => item.id).join(","),
      demo: input.demo ? "true" : "false",
    },
    line_items: input.items.map((item) => ({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: item.priceCents,
        product_data: {
          name: item.name,
          metadata: { itemId: item.id, sku: item.sku, kind: item.kind },
        },
      },
    })),
  };
}

export function getStripeSecret(): string | undefined {
  return process.env.STRIPE_SECRET_KEY;
}

export function getWebhookSecret(): string | undefined {
  return process.env.STRIPE_WEBHOOK_SECRET;
}
