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
  duration = 2400,
  delay = 200,
  prefix = '',
  suffix = '',
  padZero = false,
  className = '',
}: StatCounterProps) {
  const [current, setCurrent] = useState<number>(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    // Small initial delay so user sees the counter begin from 0
    const timer = setTimeout(() => {
      if (!isMounted.current) return;

      if (end <= 20) {
        // For small numbers like 12 or 5: step through EVERY SINGLE INTEGER
        // so it NEVER jumps and each number is clearly readable on screen.
        let step = 0;
        const stepInterval = duration / end;

        const intervalId = setInterval(() => {
          if (!isMounted.current) {
            clearInterval(intervalId);
            return;
          }
          step += 1;
          setCurrent(step);
          if (step >= end) {
            clearInterval(intervalId);
          }
        }, stepInterval);

        return () => clearInterval(intervalId);
      } else {
        // For larger numbers like 100%: smooth incremental climb
        const startTime = performance.now();
        let animId: number;

        const tick = (now: number) => {
          if (!isMounted.current) return;
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Eased progress so it gently decelerates near 100%
          const eased = 1 - Math.pow(1 - progress, 2.5);
          const val = Math.min(Math.round(eased * end), end);
          
          setCurrent(val);

          if (progress < 1) {
            animId = requestAnimationFrame(tick);
          } else {
            setCurrent(end);
          }
        };

        animId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animId);
      }
    }, delay);

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, [end, duration, delay]);

  const formatted =
    padZero && current < 10 ? `0${current}` : String(current);

  return (
    <span className={`inline-block tabular-nums tracking-normal ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

