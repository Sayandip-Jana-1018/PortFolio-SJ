import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const CustomCursor: React.FC = () => {
  const { accentColor, theme } = useTheme();
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const cursorTrailsRef = useRef<(HTMLDivElement | null)[]>([]);
  const trailCount = 5; // Number of trailing elements
  
  // Initialize trail refs
  useEffect(() => {
    cursorTrailsRef.current = Array(trailCount).fill(null);
  }, []);
  
  useEffect(() => {
    const cursorOuter = cursorOuterRef.current;
    const cursorInner = cursorInnerRef.current;
    if (!cursorOuter || !cursorInner) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let outerX = 0;
    let outerY = 0;
    let innerX = 0;
    let innerY = 0;
    
    // Animation frame for smooth cursor movement
    const animate = () => {
      // Outer cursor follows with delay (smooth follow)
      outerX += (mouseX - outerX) * 0.2;
      outerY += (mouseY - outerY) * 0.2;
      
      // Inner cursor follows with almost no delay (more responsive)
      innerX += (mouseX - innerX) * 0.5;
      innerY += (mouseY - innerY) * 0.5;
      
      // Apply positions
      if (cursorOuter) {
        cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px)`;
      }
      
      if (cursorInner) {
        cursorInner.style.transform = `translate(${innerX}px, ${innerY}px)`;
      }
      
      // Animate trails with increasing delay
      cursorTrailsRef.current.forEach((trail, index) => {
        if (trail) {
          const delay = 0.05 + (index * 0.03);
          // Make trails follow more closely to the inner cursor
          const trailX = mouseX - (mouseX - innerX) * (delay * 2);
          const trailY = mouseY - (mouseY - innerY) * (delay * 2);
          
          trail.style.transform = `translate(${trailX}px, ${trailY}px) scale(${1 - (index * 0.15)})`;
          trail.style.opacity = `${1 - (index * 0.2)}`;
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    // Start animation loop
    const animationId = requestAnimationFrame(animate);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'A' || 
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.classList.contains('cursor-hover')) {
        cursorOuter.classList.add('hover');
        cursorInner.classList.add('hover');
      }
    };
    
    const handleMouseOut = () => {
      cursorOuter.classList.remove('hover');
      cursorInner.classList.remove('hover');
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    // Apply accent color to cursor
    const applyAccentColor = () => {
      const baseColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
      cursorOuter.style.borderColor = accentColor;
      cursorInner.style.backgroundColor = accentColor;
      
      // Apply to trails
      cursorTrailsRef.current.forEach((trail, index) => {
        if (trail) {
          trail.style.backgroundColor = accentColor;
          trail.style.opacity = `${0.8 - (index * 0.15)}`;
        }
      });
    };
    
    applyAccentColor();
    
    // Listen for accent color changes
    const handleAccentColorChange = (e: CustomEvent) => {
      const color = e.detail.color;
      if (cursorOuter && cursorInner) {
        cursorOuter.style.borderColor = color;
        cursorInner.style.backgroundColor = color;
        
        // Apply to trails
        cursorTrailsRef.current.forEach((trail) => {
          if (trail) {
            trail.style.backgroundColor = color;
          }
        });
      }
    };
    
    document.addEventListener('accentcolorchange', handleAccentColorChange as EventListener);
    
    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('accentcolorchange', handleAccentColorChange as EventListener);
    };
  }, [accentColor, theme]);
  
  return (
    <>
      {/* Cursor trails */}
      {Array(trailCount).fill(0).map((_, index) => (
        <motion.div
          key={`trail-${index}`}
          ref={(el: HTMLDivElement | null) => { cursorTrailsRef.current[index] = el; }}
          className="fixed w-2 h-2 rounded-full pointer-events-none z-[9998]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6 - (index * 0.1), scale: 0.6 - (index * 0.1) }}
          transition={{ duration: 0.3, delay: 0.05 * index }}
          style={{
            backgroundColor: accentColor,
            filter: `blur(${index * 0.5}px)`,
            marginLeft: '-1px',
            marginTop: '-1px'
          }}
        />
      ))}
      
      {/* Main cursor outer ring */}
      <motion.div
        ref={cursorOuterRef}
        className="fixed w-10 h-10 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          border: `1.5px solid ${accentColor}`,
          boxShadow: `0 0 10px ${accentColor}40`,
          marginLeft: '-20px',
          marginTop: '-20px',
          transition: 'width 0.3s, height 0.3s, border-color 0.3s, transform 0.1s'
        }}
      />
      
      {/* Inner cursor dot */}
      <motion.div
        ref={cursorInnerRef}
        className="fixed w-3 h-3 rounded-full pointer-events-none z-[9999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: accentColor,
          boxShadow: `0 0 10px ${accentColor}80`,
          marginLeft: '-6px',
          marginTop: '-6px',
          transition: 'background-color 0.3s, transform 0.2s'
        }}
      />
      
      <style jsx global>{`
        body {
          cursor: none !important;
        }
        
        .hover {
          transform: scale(1.5) !important;
        }
        
        @media (max-width: 768px) {
          body {
            cursor: auto !important;
          }
          
          [ref=cursorOuterRef], [ref=cursorInnerRef], [ref^=trail-] {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
