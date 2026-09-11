"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Keep below-fold WebGL (and other heavy subtrees) out of the first paint.
 * Children mount only while the placeholder is near the viewport.
 */
export function WhenVisible({
  children,
  fallback = null,
  className,
  rootMargin = "180px",
  once = false,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  rootMargin?: string;
  once?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          if (once) observer.disconnect();
          return;
        }
        if (!once) setShow(false);
      },
      { rootMargin, threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin]);

  return (
    <div ref={host} className={className}>
      {show ? children : fallback}
    </div>
  );
}
