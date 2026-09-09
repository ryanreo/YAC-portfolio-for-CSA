'use client';

import { useEffect, useRef, useState } from 'react';

interface StatCounterProps {
  end: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  padZero?: boolean;
  className?: string;
}

export function StatCounter({
  end,
  duration = 2600,
  delay = 350,
  prefix = '',
  suffix = '',
  padZero = false,
  className = '',
}: StatCounterProps) {
  const [count, setCount] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Respect reduced motion settings
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setCount(end);
        return;
      }
    }

    const currentEl = elementRef.current;
    if (!currentEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(currentEl);

    return () => observer.disconnect();
  }, [end]);

  useEffect(() => {
    if (!hasStarted) return;

    let timeoutId: NodeJS.Timeout;
    let animationFrameId: number;

    // Smooth quadratic easeInOut for a calm, legible start and elegant decelerated finish
    const easeInOutQuad = (t: number): number =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    timeoutId = setTimeout(() => {
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutQuad(progress);

        const currentVal = Math.round(easedProgress * end);
        setCount(currentVal);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [hasStarted, end, duration, delay]);

  const formattedDynamic = padZero && count < 10 ? `0${count}` : String(count);
  const formattedFinal = padZero && end < 10 ? `0${end}` : String(end);

  return (
    <span ref={elementRef} className={`tabular-nums ${className}`}>
      {/* Screen dynamic counter */}
      <span className="print:hidden" aria-hidden="true">
        {prefix}
        {formattedDynamic}
        {suffix}
      </span>
      {/* Screen reader and print fallback (always complete) */}
      <span className="sr-only print:not-sr-only print:inline">
        {prefix}
        {formattedFinal}
        {suffix}
      </span>
    </span>
  );
}
