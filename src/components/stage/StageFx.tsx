"use client";

import type { DemoActionId } from "@/lib/types";

export function StageFx({ demo }: { demo: DemoActionId | null }) {
  if (demo === "rain-walk") {
    return (
      <div className="stage-rain" aria-hidden>
        {Array.from({ length: 14 }, (_, index) => (
          <span key={index} style={{ left: `${6 + index * 6.5}%`, animationDelay: `${(index % 5) * 0.18}s` }} />
        ))}
      </div>
    );
  }
  if (demo === "photo-pose") {
    return <div className="stage-flash" aria-hidden />;
  }
  return null;
}
