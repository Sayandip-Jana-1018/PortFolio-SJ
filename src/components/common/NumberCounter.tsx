import React, { useEffect, useRef, useState } from 'react';

interface NumberCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Animated number counter — counts up from 0 when scrolled into view.
 * Single IntersectionObserver + requestAnimationFrame. Lightweight.
 */
const NumberCounter: React.FC<NumberCounterProps> = ({
  end,
  prefix = '',
  suffix = '',
  duration = 2000,
  decimals = 0,
  className = '',
  style,
}) => {
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          io.disconnect();

          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * end;
            setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);

    return () => io.disconnect();
  }, [end, prefix, suffix, duration, decimals]);

  return (
    <span ref={ref} className={`number-counter ${className}`} style={style}>
      {display}
    </span>
  );
};

export default NumberCounter;
