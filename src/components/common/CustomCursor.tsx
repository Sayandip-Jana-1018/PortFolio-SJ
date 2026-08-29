import React, { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Fluid Trailing Cursor — Momentum-damped lerp trail with morphing.
 * 
 * Key differences from the old spring-based cursor:
 * - No springs → uses direct lerp interpolation (0.15 factor) = smooth without magnetism
 * - Single requestAnimationFrame loop, not Framer Motion springs
 * - Velocity-reactive shape: stretches into pill shape when moving fast
 * - Hover detection via data attributes, not getComputedStyle
 * - Single outer ring element + CSS ::after for dot = 50% less DOM
 */
const CustomCursor: React.FC = () => {
  const { accentColor } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const velocity = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);
  const isActive = useRef(false);
  const isVisible = useRef(false);
  const rafRef = useRef<number>(0);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    // Lerp positions — ring trails behind, dot is snappy
    const prevX = pos.current.x;
    const prevY = pos.current.y;
    pos.current.x = lerp(pos.current.x, mouse.current.x, 0.12);
    pos.current.y = lerp(pos.current.y, mouse.current.y, 0.12);
    dotPos.current.x = lerp(dotPos.current.x, mouse.current.x, 0.25);
    dotPos.current.y = lerp(dotPos.current.y, mouse.current.y, 0.25);

    // Calculate velocity for morphing
    velocity.current.x = pos.current.x - prevX;
    velocity.current.y = pos.current.y - prevY;
    const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
    const angle = Math.atan2(velocity.current.y, velocity.current.x);

    // Morph: circle → pill shape based on speed
    const stretch = Math.min(speed * 0.08, 0.4);
    const scaleX = 1 + stretch;
    const scaleY = 1 - stretch * 0.3;

    // Size based on hover state
    const baseSize = isHovered.current ? 48 : 28;
    const activeScale = isActive.current ? 0.85 : 1;

    // Ring transform
    cursor.style.transform = `translate3d(${pos.current.x - baseSize / 2}px, ${pos.current.y - baseSize / 2}px, 0) rotate(${angle}rad) scale(${scaleX * activeScale}, ${scaleY * activeScale})`;
    cursor.style.width = `${baseSize}px`;
    cursor.style.height = `${baseSize}px`;
    cursor.style.opacity = isVisible.current ? '1' : '0';

    // Dot transform
    const dotOpacity = isHovered.current ? 0 : 1;
    dot.style.transform = `translate3d(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px, 0)`;
    dot.style.opacity = `${dotOpacity}`;

    // Glow intensity based on speed
    const glowIntensity = Math.min(speed * 1.5, 15);
    cursor.style.boxShadow = `0 0 ${glowIntensity}px ${accentColor}40`;

    rafRef.current = requestAnimationFrame(animate);
  }, [accentColor]);

  useEffect(() => {
    // Don't render on mobile/touch devices
    if (matchMedia('(hover: none)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible.current) isVisible.current = true;
    };

    const handleMouseDown = () => { isActive.current = true; };
    const handleMouseUp = () => { isActive.current = false; };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Fast hover detection via tag/attribute/closest — no getComputedStyle
      isHovered.current = !!(
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor="pointer"]') ||
        target.classList.contains('cursor-hover')
      );
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

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
