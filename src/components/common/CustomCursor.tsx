import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const CustomCursor: React.FC = () => {
  const { accentColor } = useTheme();

  // Mouse position values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for outer ring (slight delay but smooth)
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Tighter spring for inner dot (almost separate to feel responsive)
  const dotSpringConfig = { damping: 30, stiffness: 700, mass: 0.2 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update motion values directly
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setActive(true);
    const handleMouseUp = () => setActive(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-hover') ||
        getComputedStyle(target).cursor === 'pointer'
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Global CSS to hide default cursor */}
      <style jsx global>{`
        body, a, button, input, select, textarea {
          cursor: none !important;
        }
        @media (max-width: 768px) {
          body, a, button, input, select, textarea {
            cursor: auto !important;
          }
        }
      `}</style>

      {/* Outer Ring - Follows smoothly */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99999] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: hovered ? 48 : 24,
          height: hovered ? 48 : 24,
          border: `1.5px solid ${accentColor}`,
          opacity: 0.8,
          mixBlendMode: 'normal', // Changed from difference to normal for better visibility over dark overlays
          boxShadow: `0 0 10px ${accentColor}40`
        }}
        animate={{
          scale: active ? 0.9 : 1,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Inner Dot - Stays sharp and centered */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99999] hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%', // Center deeply
          width: 8,
          height: 8,
          backgroundColor: accentColor,
        }}
        animate={{
          scale: hovered ? 0 : 1, // Hide dot when ring expands
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
};

export default CustomCursor;
