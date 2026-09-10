import type { AnalyticsEventName } from "@/lib/types";

type EventPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    companionsAnalytics?: {
      track: (name: string, payload?: EventPayload) => void;
    };
  }
}

export function track(name: AnalyticsEventName, payload: EventPayload = {}): void {
  const event = {
    name,
    payload,
    at: new Date().toISOString(),
    demo: true,
  };

  if (typeof window === "undefined") {
    return;
  }

  window.companionsAnalytics?.track(name, payload);

  if (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === "true") {
    console.info("[companions:event]", event);
  }
}
