"use client";

import { useEffect, useState } from "react";

/** Mobile, save-data, or few cores — cut lights, DPR, and shadows. */
export function useBudgetGpu(): boolean {
  const [budget, setBudget] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
    const sync = () => {
      const saveData = nav.connection?.saveData === true;
      const slow = nav.connection?.effectiveType === "2g" || nav.connection?.effectiveType === "slow-2g";
      const fewCores = navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 4;
      setBudget(mq.matches || saveData || slow || fewCores);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return budget;
}
