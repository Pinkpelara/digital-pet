"use client";

import { useEffect, useState } from "react";

/**
 * False during the hydration render so the server HTML and the first client
 * render always agree, true from the first effect onwards.
 *
 * The flag has to be set inside the effect (not a timer / microtask) so it
 * flips after this subtree has been hydrated — otherwise selective hydration
 * can render client-only content against server HTML and mismatch.
 */
export function useClientMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount flag, must flip after hydration
    setMounted(true);
  }, []);

  return mounted;
}
