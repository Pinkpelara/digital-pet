"use client";

import type { ReactNode } from "react";
import { useClientMounted } from "@/lib/state/use-client-mounted";

/**
 * Renders children only after hydration. Used for anything that reads
 * browser-only state (search params, localStorage) so the server HTML and the
 * first client render always agree.
 */
export function ClientOnly({
  fallback = null,
  children,
}: {
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const mounted = useClientMounted();
  return <>{mounted ? children : fallback}</>;
}
