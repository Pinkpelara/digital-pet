"use client";

import dynamic from "next/dynamic";
import { WhenVisible } from "@/components/site/WhenVisible";

const Loaded = dynamic(() => import("@/components/stage/ResidentSill").then((mod) => mod.ResidentSill), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-cream" />,
});

export function ResidentGallery({ className }: { className?: string }) {
  return (
    <WhenVisible className={className} fallback={<div className="h-full w-full bg-cream" />}>
      <Loaded className={className} />
    </WhenVisible>
  );
}
