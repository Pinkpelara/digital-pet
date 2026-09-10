"use client";

import dynamic from "next/dynamic";

const Loaded = dynamic(() => import("@/components/stage/ResidentSill").then((mod) => mod.ResidentSill), {
  ssr: false,
});

export function ResidentGallery({ className }: { className?: string }) {
  return <Loaded className={className} />;
}
