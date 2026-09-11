"use client";

import { createContext, useContext } from "react";

export const StageBudgetContext = createContext({ budget: false });

export function useStageBudget(): boolean {
  return useContext(StageBudgetContext).budget;
}
