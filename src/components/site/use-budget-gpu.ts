"use client";

import { useEffect, useState } from "react";

/** Mobile, save-data, or very slow connection — cut shadows and cap DPR. */
export function useBudgetGpu(): boolean {
  const [budget, setBudget] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
    const sync = () => {
      const saveData = nav.connection?.saveData === true;
      const slow = nav.connection?.effectiveType === "2g" || nav.connection?.effectiveType === "slow-2g";
      setBudget(mq.matches || saveData || slow);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return budget;
}
