import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BackgroundElementsProps {
  accentColor: string;
  theme: string;
}

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

      {/* Static Glassy corner elements - no animation */}
      <div
        className="absolute top-0 left-0 w-64 h-64 opacity-20"
        style={{
          background: `radial-gradient(circle, ${accentColor}80 0%, transparent 70%)`,
          filter: 'blur(40px)',
          borderRadius: '0 0 100% 0',
        }}
      />

      <div
        className="absolute bottom-0 right-0 w-64 h-64 opacity-20"
        style={{
          background: `radial-gradient(circle, ${accentColor}80 0%, transparent 70%)`,
          filter: 'blur(40px)',
          borderRadius: '100% 0 0 0',
        }}
      />

      {/* Static blurred ambient circles - no animation */}
      <div
        className="absolute rounded-full opacity-30"
        style={{
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
          filter: 'blur(100px)',
          top: '20%',
          left: '10%',
        }}
      />

      <div
        className="absolute rounded-full opacity-30"
        style={{
          width: 350,
          height: 350,
          background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
          filter: 'blur(100px)',
          bottom: '20%',
          right: '10%',
        }}
      />
    </div>
  );
};

export default BackgroundElements;
