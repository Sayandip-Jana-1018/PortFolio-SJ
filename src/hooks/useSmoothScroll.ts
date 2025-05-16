import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollOptions {
  lerp?: number;
  duration?: number;
  easing?: (t: number) => number;
  orientation?: 'vertical' | 'horizontal';
  gestureOrientation?: 'vertical' | 'horizontal';
  smoothWheel?: boolean;
  smoothTouch?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
}

export const useSmoothScroll = (options: SmoothScrollOptions = {}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, // Lower values create smoother animations
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
      ...options,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [options]);

  return lenisRef;
};

export default useSmoothScroll;
