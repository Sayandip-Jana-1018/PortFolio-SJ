import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * Touch Ripple Effect for mobile — premium ripple on tap.
 * Only renders on touch devices. Zero cost on desktop.
 */

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const TouchRipple: React.FC = () => {
  const { accentColor } = useTheme();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Only activate on touch devices
    const isTouchDevice = matchMedia('(hover: none) and (pointer: coarse)').matches;
    setIsTouch(isTouchDevice);
  }, []);

  useEffect(() => {
    if (!isTouch) return;

    let idCounter = 0;
    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      const id = idCounter++;
      const ripple: Ripple = {
        id,
        x: touch.clientX,
        y: touch.clientY,
      };

      setRipples(prev => [...prev, ripple]);

      // Remove after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 800);
    };

    document.addEventListener('touchstart', handleTouch, { passive: true });
    return () => document.removeEventListener('touchstart', handleTouch);
  }, [isTouch]);

  if (!isTouch) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{
              x: ripple.x - 30,
              y: ripple.y - 30,
              scale: 0,
              opacity: 0.6,
            }}
            animate={{
              scale: 3,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: `2px solid ${accentColor}`,
              background: `radial-gradient(circle, ${accentColor}30, transparent 70%)`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TouchRipple;
