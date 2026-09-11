"use client";

import type { CSSProperties, ReactNode } from "react";
import type { ResolvedWheelItem, WheelIconId } from "@/lib/demo-actions";

function Icon({ id }: { id: WheelIconId }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "skate":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <path {...common} d="M4 14h16l-1.5 3H6L4 14Z" />
          <circle cx="8" cy="19" r="1.4" fill="currentColor" />
          <circle cx="16" cy="19" r="1.4" fill="currentColor" />
        </svg>
      );
    case "umbrella":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <path {...common} d="M12 4c-5 0-8 4-8 7h16c0-3-3-7-8-7Z" />
          <path {...common} d="M12 11v8a2 2 0 0 1-2 2" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <rect x="4" y="8" width="16" height="11" rx="2" {...common} />
          <circle cx="12" cy="13.5" r="3" {...common} />
          <path {...common} d="M9 8 10.5 5h3L15 8" />
        </svg>
      );
    case "balloon":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <ellipse cx="12" cy="9" rx="5" ry="6" {...common} />
          <path {...common} d="M12 15v6M12 15c.8 1 0 2-1.4 2" />
        </svg>
      );
    case "broom":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <path {...common} d="M8 4l8 12" />
          <path {...common} d="M14 14l6 2-3 5-6-2" />
        </svg>
      );
    case "moonwalk":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <path {...common} d="M16 16c-2-4-7-4-9 0" />
          <path {...common} d="M7 16h11M18 16l-2-2M18 16l-2 2" />
        </svg>
      );
    case "climb":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <path {...common} d="M7 20V8M7 8l4 3M7 12l4 3" />
          <circle cx="14" cy="7" r="2.2" {...common} />
        </svg>
      );
    case "nap":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <path {...common} d="M5 16h14M7 16c0-4 3-7 7-7" />
          <path {...common} d="M15 6h4l-4 4h4" />
        </svg>
      );
    case "dance":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <circle cx="12" cy="6" r="2" {...common} />
          <path {...common} d="M12 8v6l-4 5M12 14l4 5M8 11h8" />
        </svg>
      );
    case "cartwheel":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <circle cx="12" cy="12" r="7" {...common} />
          <path {...common} d="M12 5v14M5 12h14" />
        </svg>
      );
    case "hide":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <path {...common} d="M4 16c4-8 12-8 16 0" />
          <circle cx="12" cy="11" r="2" {...common} />
        </svg>
      );
    case "juggle":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <circle cx="8" cy="8" r="2" fill="currentColor" />
          <circle cx="16" cy="7" r="2" fill="currentColor" />
          <circle cx="12" cy="14" r="2" fill="currentColor" />
        </svg>
      );
    case "outfit":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <path {...common} d="M8 6l4-2 4 2 3 3-3 1v8H8V10L5 9l3-3Z" />
        </svg>
      );
    case "mood":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <circle cx="12" cy="12" r="7" {...common} />
          <path {...common} d="M8.5 11v.5M15.5 11v.5M9 15c1.2 1.2 4.8 1.2 6 0" />
        </svg>
      );
    case "gift":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <rect x="5" y="11" width="14" height="8" rx="1" {...common} />
          <path {...common} d="M5 15h14M12 11v8M9 7c0-1.5 1.2-2.5 3-1.2C13.8 4.5 15 5.5 15 7c0 1-3 4-3 4s-3-3-3-4Z" />
        </svg>
      );
    case "study":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <path {...common} d="M4 7l8-3 8 3v10l-8 3-8-3V7Z" />
          <path {...common} d="M12 4v16M4 7l8 3 8-3" />
        </svg>
      );
    case "mad":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
          <circle cx="12" cy="12" r="7" {...common} />
          <path {...common} d="M8 10l2.5 1.2M16 10l-2.5 1.2M9 16c1.4-1 4.6-1 6 0" />
        </svg>
      );
  }
}

export function ActionWheel({
  items,
  open,
  onSelect,
  onClose,
  name = "them",
}: {
  items: ResolvedWheelItem[];
  open: boolean;
  onSelect: (item: ResolvedWheelItem) => void;
  onClose: () => void;
  name?: string;
}): ReactNode {
  if (!open) return null;

  return (
    <div className="action-wheel" role="dialog" aria-label={`${name}’s day`}>
      <button type="button" className="action-wheel-scrim" onClick={onClose} aria-label="Close wheel" />
      <div className="action-wheel-orbit">
        <div className="action-wheel-ring" aria-hidden />
        <ul className="action-wheel-slots">
          {items.map((item, index) => {
            const angle = (index / items.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 42;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;
            return (
              <li key={item.itemId} style={{ left: `${x}%`, top: `${y}%` }}>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="action-wheel-slot"
                  style={{ "--slot-accent": item.accent } as CSSProperties}
                  aria-label={item.preview ? `${item.label} (preview)` : item.label}
                >
                  <span className="action-wheel-icon">
                    <Icon id={item.icon} />
                  </span>
                  <span className="action-wheel-label">{item.label}</span>
                  {item.preview ? <span className="action-wheel-preview">Preview</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="action-wheel-center">They’re listening</p>
      </div>
    </div>
  );
}
