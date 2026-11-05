import React, { useState, useEffect } from 'react';

interface BackgroundElementsProps {
  accentColor: string;
  theme: string;
}

/**
 * The soft glows here used to be radial gradients under filter: blur(), which is
 * slow to draw every time a tile of the page is rasterized. These gradients have
 * the falloff that blur produces, computed numerically for each shape, so they
 * look the same with no filter at all. Each array is evenly spaced stops from the
 * centre out to the edge of the glow, as a fraction of its peak brightness.
 */
const AMBIENT_LARGE_FALLOFF = [1, 0.9507, 0.8162, 0.6313, 0.4381, 0.2714, 0.1493, 0.0724, 0.0308, 0.0114, 0.0037, 0.001, 0];
const AMBIENT_SMALL_FALLOFF = [1, 0.95, 0.8141, 0.6283, 0.4356, 0.2703, 0.1496, 0.0736, 0.032, 0.0123, 0.0041, 0.0012, 0];
const CORNER_FALLOFF = [1, 0.958, 0.8412, 0.6742, 0.4884, 0.315, 0.1774, 0.0854, 0.0345, 0.0115, 0.0031, 0.0007, 0];

/** Peak opacity of each glow: its original element opacity × its peak after blur. */
const AMBIENT_LARGE_OPACITY = 0.3 * 0.0993;
const AMBIENT_SMALL_OPACITY = 0.3 * 0.08419;
const CORNER_OPACITY = 0.2 * 0.30249;

const glow = (accentColor: string, falloff: number[]) => {
  const stops = falloff.map((fraction, i) => {
    const alpha = Math.round(fraction * 255).toString(16).padStart(2, '0');
    return `${accentColor}${alpha} ${((i / (falloff.length - 1)) * 100).toFixed(2)}%`;
  });
  return `radial-gradient(circle closest-side, ${stops.join(', ')})`;
};

const BackgroundElements: React.FC<BackgroundElementsProps> = ({ accentColor, theme }) => {
  // State to track if we're on mobile
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical md breakpoint
    };

    // Check immediately
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Don't render anything on mobile to improve performance
  if (isMobile) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static gradient borders - no animation */}
      <div
        className="absolute top-0 left-0 w-full h-1 opacity-40"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          boxShadow: `0 0 10px ${accentColor}, 0 0 20px ${accentColor}50`
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-full h-1 opacity-40"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          boxShadow: `0 0 10px ${accentColor}, 0 0 20px ${accentColor}50`
        }}
      />

      {/* Static glassy corner glows */}
      <div
        className="absolute"
        style={{
          width: 496,
          height: 496,
          top: -120,
          left: -120,
          opacity: CORNER_OPACITY,
          background: glow(accentColor, CORNER_FALLOFF),
        }}
      />

      <div
        className="absolute"
        style={{
          width: 496,
          height: 496,
          bottom: -120,
          right: -120,
          opacity: CORNER_OPACITY,
          background: glow(accentColor, CORNER_FALLOFF),
        }}
      />

      {/* Static ambient glows */}
      <div
        className="absolute"
        style={{
          width: 1000,
          height: 1000,
          top: 'calc(20% - 300px)',
          left: 'calc(10% - 300px)',
          opacity: AMBIENT_LARGE_OPACITY,
          background: glow(accentColor, AMBIENT_LARGE_FALLOFF),
        }}
      />

      <div
        className="absolute"
        style={{
          width: 950,
          height: 950,
          bottom: 'calc(20% - 300px)',
          right: 'calc(10% - 300px)',
          opacity: AMBIENT_SMALL_OPACITY,
          background: glow(accentColor, AMBIENT_SMALL_FALLOFF),
        }}
      />
    </div>
  );
};

export default BackgroundElements;
