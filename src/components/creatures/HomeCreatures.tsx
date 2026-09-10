"use client";

import { useSearchParams } from "next/navigation";
import { WorldLayer } from "@/components/creatures/WorldLayer";

export function HomeCreatures() {
  const params = useSearchParams();
  if (params.get("pause") === "1") return null;
  return <WorldLayer enabled />;
}
