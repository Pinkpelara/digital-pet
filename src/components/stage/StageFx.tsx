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
  if (demo === "gift" || demo === "party" || demo === "balloon-bunch") {
    return (
      <div className="stage-confetti" aria-hidden>
        {Array.from({ length: 10 }, (_, index) => (
          <span key={index} style={{ left: `${8 + index * 9}%`, animationDelay: `${(index % 4) * 0.12}s` }} />
        ))}
      </div>
    );
  }
  if (demo === "stretch") {
    return <div className="stage-bubble" aria-hidden />;
  }
  return null;
}
