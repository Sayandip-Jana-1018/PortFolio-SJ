import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const PARTICLES_PER_CLICK = 12;
const DURATION_MS = 800;
/** Finished particles kept for reuse. Enough for a few quick clicks at once. */
const MAX_POOLED = 48;

/**
 * The burst on every click. Runs on the Web Animations API with a pool of reused
 * elements, so a click creates no React renders and the browser can run the
 * animation off the main thread.
 */
const ClickEffect: React.FC = () => {
  const { accentColor } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef(accentColor);
  accentRef.current = accentColor;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pool: HTMLDivElement[] = [];

    const createParticle = () => {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.top = '0';
      el.style.left = '0';
      el.style.borderRadius = '50%';
      container.appendChild(el);
      return el;
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < PARTICLES_PER_CLICK; i++) {
        const angle = (i / PARTICLES_PER_CLICK) * Math.PI * 2; // Even spread in a circle
        const speed = 2 + Math.random() * 3;
        const size = 5 + Math.random() * 8;
        const color = i % 3 === 0 ? accentRef.current : '#ffffff';
        const endX = e.clientX + Math.cos(angle) * (speed * 30);
        const endY = e.clientY + Math.sin(angle) * (speed * 30);

        const el = pool.pop() ?? createParticle();
        el.style.display = 'block';
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.backgroundColor = color;
        el.style.boxShadow = `0 0 6px ${color}`;

        const animation = el.animate(
          [
            { transform: `translate(${e.clientX}px, ${e.clientY}px) scale(0)`, opacity: 0.8 },
            { transform: `translate(${endX}px, ${endY}px) scale(1)`, opacity: 0 },
          ],
          { duration: DURATION_MS, easing: 'ease-out', fill: 'forwards' }
        );

        animation.onfinish = () => {
          animation.cancel();
          el.style.display = 'none';
          if (pool.length < MAX_POOLED) pool.push(el);
          else el.remove();
        };
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      container.replaceChildren();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[9999]" />;
};

export default ClickEffect;
