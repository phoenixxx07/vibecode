"use client";

import { useEffect, useState } from "react";

type Point = { x: number; y: number };

function formatAxis(value: number) {
  return String(value).padStart(4, "0");
}

export function CoordinateOverlay() {
  const [pos, setPos] = useState<Point | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    if (reducedMotion.matches || !finePointer.matches) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      setPos({ x: event.clientX, y: event.clientY });
      setActive(true);
    };

    const onLeave = () => {
      setActive(false);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!active || !pos) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      <div
        className="absolute top-0 bottom-0 w-px bg-primary/20"
        style={{ left: pos.x }}
      />
      <div
        className="absolute left-0 right-0 h-px bg-primary/20"
        style={{ top: pos.y }}
      />

      <div className="fixed bottom-4 left-4 border border-muted bg-surface/95 px-2 py-1 text-[10px] uppercase tracking-wider text-primary">
        &gt; CURSOR :: X:{formatAxis(pos.x)} Y:{formatAxis(pos.y)}
      </div>
    </div>
  );
}
