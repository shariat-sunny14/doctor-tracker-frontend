"use client";

import { useEffect, useRef, useState } from "react";

/** Animates a number from its previous value to `target` (skipped when the user prefers reduced motion). */
export function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (typeof target !== "number") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return undefined;
    }
    const start = performance.now();
    const origin = from.current;
    let frame;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = origin + (target - origin) * eased;
      setValue(current);
      from.current = current;
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
