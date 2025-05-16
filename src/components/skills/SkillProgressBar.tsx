import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../../context/ThemeContext';

interface SkillProgressBarProps {
  name: string;
  level: number; // 0-100
  index?: number;
}

const SkillProgressBar: React.FC<SkillProgressBarProps> = ({ 
  name, 
  level, 
  index = 0 
}) => {
  const { accentColor, theme } = useTheme();
  const controls = useAnimation();
  const [ref, inView] = useInView({ 
    triggerOnce: true,
    threshold: 0.2
  });
  
  // Gradient effect for progress bar
  const gradientRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (inView) {
      controls.start({
        width: `${level}%`,
        transition: { 
          duration: 1.2,
          ease: [0.33, 1, 0.68, 1],
          delay: index * 0.1
        }
      });
    }
  }, [controls, inView, level, index]);
  
  useEffect(() => {
    if (gradientRef.current) {
      // Create a gradient effect based on accent color
      const rgbColor = hexToRgb(accentColor);
      const gradient = `
        linear-gradient(90deg, 
          rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.7) 0%, 
          rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 1) 100%)
      `;
      gradientRef.current.style.background = gradient;
    }
  }, [accentColor]);
  
  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  
  return (
    <motion.div 
      ref={ref}
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex justify-between mb-3 items-center">
        <div className="flex items-center">
          <div 
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: accentColor }}
          ></div>
          <span className="font-medium">{name}</span>
        </div>
        <span 
          className="text-sm font-semibold px-2 py-1 rounded-md" 
          style={{ 
            backgroundColor: `${accentColor}20`,
            color: accentColor 
          }}
        >
          {level}%
        </span>
      </div>
      
      <div 
        className={`h-2 rounded-full w-full ${
          theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-200/70'
        } overflow-hidden backdrop-blur-sm`}
        style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}
      >
        <motion.div
          ref={gradientRef}
          className="h-full rounded-full relative"
          initial={{ width: "0%" }}
          animate={controls}
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
        >
          {/* Animated glow effect */}
          <div 
            className="absolute top-0 bottom-0 right-0 w-4 rounded-full animate-pulse"
            style={{ 
              background: `radial-gradient(circle at right, ${accentColor}, transparent)`,
              filter: 'blur(2px)'
            }}
          ></div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SkillProgressBar;
