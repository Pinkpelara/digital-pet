"use client";

import dynamic from "next/dynamic";
import { WhenVisible } from "@/components/site/WhenVisible";
import type { PairedFigure } from "@/components/stage/PairedCreatureStage";

const Loaded = dynamic(
  () => import("@/components/stage/PairedCreatureStage").then((mod) => mod.PairedCreatureStage),
  { ssr: false, loading: () => <div className="h-full min-h-[280px] w-full bg-cream" /> },
);

export function PairedStage({
  left,
  right,
  className,
}: {
  left: PairedFigure;
  right: PairedFigure;
  className?: string;
}) {
  return (
    <WhenVisible
      className={className}
      fallback={<div className="h-full min-h-[280px] w-full bg-cream" />}
    >
      <Loaded left={left} right={right} className="h-full min-h-[280px] w-full" />
    </WhenVisible>
  );
}
