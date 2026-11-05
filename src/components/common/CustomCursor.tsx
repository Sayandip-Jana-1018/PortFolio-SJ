import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Fluid Trailing Cursor — Momentum-damped lerp trail with morphing.
 *
 * - No springs → uses direct lerp interpolation = smooth without magnetism
 * - Velocity-reactive shape: stretches into pill shape when moving fast
 * - Hover detection via data attributes, not getComputedStyle
 * - The loop only runs while the cursor is catching up to the pointer, and each
 *   style property is written only when its value changes
 */

/** Distance in px at which the ring and dot count as having caught up. */
const SETTLE_DISTANCE = 0.05;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const CustomCursor: React.FC = () => {
  const { accentColor } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const isHovered = useRef(false);
  const isActive = useRef(false);
  const isVisible = useRef(false);
  const rafRef = useRef(0);
  const accentRef = useRef(accentColor);
  const wakeRef = useRef<() => void>(() => { });
  // Last values written to the DOM. A glow of -1 forces the next write.
  const written = useRef({ size: -1, opacity: '', dotOpacity: '', glow: -1 });

  useEffect(() => {
    // Don't run on mobile/touch devices
    if (matchMedia('(hover: none)').matches) return;

    const animate = () => {
      rafRef.current = 0;
      const cursor = cursorRef.current;
      const dot = dotRef.current;
      if (!cursor || !dot) return;
      const last = written.current;

      // Lerp positions — ring trails behind, dot is snappy
      const prevX = pos.current.x;
      const prevY = pos.current.y;
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.12);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.12);
      dotPos.current.x = lerp(dotPos.current.x, mouse.current.x, 0.25);
      dotPos.current.y = lerp(dotPos.current.y, mouse.current.y, 0.25);

      // Calculate velocity for morphing
      const vx = pos.current.x - prevX;
      const vy = pos.current.y - prevY;
      const speed = Math.sqrt(vx ** 2 + vy ** 2);
      const angle = Math.atan2(vy, vx);

      // Morph: circle → pill shape based on speed
      const stretch = Math.min(speed * 0.08, 0.4);
      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch * 0.3;

      // Size based on hover state
      const baseSize = isHovered.current ? 48 : 28;
      const activeScale = isActive.current ? 0.85 : 1;

      // Ring transform
      cursor.style.transform = `translate3d(${pos.current.x - baseSize / 2}px, ${pos.current.y - baseSize / 2}px, 0) rotate(${angle}rad) scale(${scaleX * activeScale}, ${scaleY * activeScale})`;
      if (baseSize !== last.size) {
        cursor.style.width = `${baseSize}px`;
        cursor.style.height = `${baseSize}px`;
        last.size = baseSize;
      }
      const opacity = isVisible.current ? '1' : '0';
      if (opacity !== last.opacity) {
        cursor.style.opacity = opacity;
        last.opacity = opacity;
      }

      // Dot transform
      dot.style.transform = `translate3d(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px, 0)`;
      const dotOpacity = isHovered.current ? '0' : '1';
      if (dotOpacity !== last.dotOpacity) {
        dot.style.opacity = dotOpacity;
        last.dotOpacity = dotOpacity;
      }

      // Glow intensity based on speed, in half pixel steps so a slow drift does
      // not repaint the shadow on every frame
      const glow = Math.round(Math.min(speed * 1.5, 15) * 2) / 2;
      if (glow !== last.glow) {
        cursor.style.boxShadow = `0 0 ${glow}px ${accentRef.current}40`;
        last.glow = glow;
      }

      const settled =
        Math.abs(mouse.current.x - pos.current.x) < SETTLE_DISTANCE &&
        Math.abs(mouse.current.y - pos.current.y) < SETTLE_DISTANCE &&
        Math.abs(mouse.current.x - dotPos.current.x) < SETTLE_DISTANCE &&
        Math.abs(mouse.current.y - dotPos.current.y) < SETTLE_DISTANCE;

      if (!settled) rafRef.current = requestAnimationFrame(animate);
    };

    const wake = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(animate);
    };
    wakeRef.current = wake;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible.current) isVisible.current = true;
      wake();
    };

    const handleMouseDown = () => { isActive.current = true; wake(); };
    const handleMouseUp = () => { isActive.current = false; wake(); };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Fast hover detection via tag/attribute/closest — no getComputedStyle
      const hovered = !!(
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor="pointer"]') ||
        target.classList.contains('cursor-hover')
      );
      if (hovered !== isHovered.current) {
        isHovered.current = hovered;
        wake();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      wakeRef.current = () => { };
    };
  }, []);

  // A new accent colour has to reach the glow even while the cursor is at rest.
  useEffect(() => {
    accentRef.current = accentColor;
    written.current.glow = -1;
    wakeRef.current();
  }, [accentColor]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && matchMedia('(hover: none)').matches) {
    return null;
  }

  return (
    <>
      {/* Global CSS to hide default cursor */}
      <style jsx global>{`
        @media (hover: hover) {
          body, a, button, input, select, textarea {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Outer Ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99999] hidden md:block"
        style={{
          border: `1.5px solid ${accentColor}`,
          opacity: 0,
          willChange: 'transform',
          transition: 'width 0.2s, height 0.2s',
        }}
      />

      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99999] hidden md:block"
        style={{
          width: 8,
          height: 8,
          backgroundColor: accentColor,
          willChange: 'transform',
          transition: 'opacity 0.2s',
        }}
      />
    </>
  );
};

export default CustomCursor;
