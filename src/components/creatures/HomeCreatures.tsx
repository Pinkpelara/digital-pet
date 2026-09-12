"use client";

import { useSearchParams } from "next/navigation";
import { SiteWorld } from "@/components/world/SiteWorld";

export function HomeCreatures() {
  const params = useSearchParams();
  if (params.get("pause") === "1") return null;
  return <SiteWorld />;
}
