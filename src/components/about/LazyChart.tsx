import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { NEAR_MARGIN, useInViewport } from '../../hooks/useInViewport';
import type { ChartCanvasProps } from './ChartCanvas';

const ChartCanvas = dynamic(() => import('./ChartCanvas'), { ssr: false });

/**
 * Loads chart.js and draws the chart only when it gets close to the screen. The
 * card around it sets the size, so nothing shifts when the chart appears.
 */
const LazyChart = (props: ChartCanvasProps) => {
  const slotRef = useRef<HTMLDivElement>(null);
  const isNear = useInViewport(slotRef, { rootMargin: NEAR_MARGIN, once: true });

  return (
    <div ref={slotRef} className="h-full w-full">
      {isNear && <ChartCanvas {...props} />}
    </div>
  );
};

export default LazyChart;
