import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface FloatingElementsProps {
  count?: number;
  intensity?: number;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({ 
  count = 15,
  intensity = 0.3
}) => {
  const { accentColor, theme } = useTheme();
  const [elements, setElements] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    type: 'pentagon' | 'hexagon' | 'star' | 'square' | 'triangle' | 'line';
    color: string;
  }>>([]);
  
  useEffect(() => {
    const shapes = [];
    // Remove circles from the types array and add more interesting shapes
    const types: Array<'pentagon' | 'hexagon' | 'star' | 'square' | 'triangle' | 'line'> = [
      'pentagon', 'hexagon', 'star', 'square', 'triangle', 'line'
    ];
    
    for (let i = 0; i < count; i++) {
      shapes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 5 + Math.random() * 15,
        duration: 15 + Math.random() * 30,
        delay: Math.random() * 5,
        type: types[Math.floor(Math.random() * types.length)],
        color: i % 3 === 0 ? accentColor : theme === 'dark' ? '#ffffff' : '#000000'
      });
    }
    
    setElements(shapes);
  }, [count, accentColor, theme]);
  
  // Update colors when accent color changes
  useEffect(() => {
    const handleAccentColorChange = (e: CustomEvent) => {
      const color = e.detail.color;
      setElements(prev => 
        prev.map((el, i) => {
          if (i % 3 === 0) {
            return { ...el, color };
          }
          return el;
        })
      );
    };
    
    document.addEventListener('accentcolorchange', handleAccentColorChange as EventListener);
    
    return () => {
      document.removeEventListener('accentcolorchange', handleAccentColorChange as EventListener);
    };
  }, []);
  
  const renderShape = (element: typeof elements[0]) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${element.x}%`,
      top: `${element.y}%`,
      opacity: intensity * (0.05 + Math.random() * 0.1), // Reduced opacity for less visibility
    };
    
    switch (element.type) {
      case 'pentagon':
        return (
          <motion.div
            key={element.id}
            style={{
              ...baseStyle,
              width: element.size,
              height: element.size,
              clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
              border: `1px solid ${element.color}`,
            }}
            animate={{
              x: [0, 30, -20, 10, 0],
              y: [0, -20, 30, -10, 0],
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 0.9, 1.05, 1]
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      case 'hexagon':
        return (
          <motion.div
            key={element.id}
            style={{
              ...baseStyle,
              width: element.size,
              height: element.size,
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              border: `1px solid ${element.color}`,
            }}
            animate={{
              x: [0, 30, -20, 10, 0],
              y: [0, -20, 30, -10, 0],
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 0.9, 1.05, 1]
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      case 'star':
        return (
          <motion.div
            key={element.id}
            style={{
              ...baseStyle,
              width: element.size,
              height: element.size,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              border: `1px solid ${element.color}`,
            }}
            animate={{
              x: [0, 30, -20, 10, 0],
              y: [0, -20, 30, -10, 0],
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 0.9, 1.05, 1]
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
        
      case 'square':
        return (
          <motion.div
            key={element.id}
            style={{
              ...baseStyle,
              width: element.size,
              height: element.size,
              border: `1px solid ${element.color}`,
              opacity: baseStyle.opacity * 0.8, // Further reduced opacity
            }}
            animate={{
              x: [0, 20, -10, 5, 0],
              y: [0, -10, 20, -5, 0],
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 0.9, 1.05, 1]
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
        
      case 'triangle':
        return (
          <motion.div
            key={element.id}
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              borderLeft: `${element.size / 2}px solid transparent`,
              borderRight: `${element.size / 2}px solid transparent`,
              borderBottom: `${element.size}px solid ${element.color}`,
              opacity: baseStyle.opacity * 0.6, // Further reduced opacity
            }}
            animate={{
              x: [0, 15, -10, 5, 0],
              y: [0, -10, 15, -5, 0],
              rotate: [0, 120, 240, 360],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
        
      case 'line':
        return (
          <motion.div
            key={element.id}
            style={{
              ...baseStyle,
              width: element.size * 1.5,
              height: 1,
              backgroundColor: element.color,
              opacity: baseStyle.opacity * 0.4, // Further reduced opacity
            }}
            animate={{
              x: [0, 10, -5, 0],
              y: [0, -5, 10, 0],
              rotate: [0, 45, 90, 135, 180],
              scaleX: [1, 1.5, 0.8, 1]
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
        
      default:
        // Fallback to pentagon if somehow we get an invalid type
        return (
          <motion.div
            key={element.id}
            style={{
              ...baseStyle,
              width: element.size,
              height: element.size,
              clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
              border: `1px solid ${element.color}`,
              opacity: baseStyle.opacity * 0.7,
            }}
            animate={{
              x: [0, 30, -20, 10, 0],
              y: [0, -20, 30, -10, 0],
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 0.9, 1.05, 1]
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
    }
  };
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map(element => renderShape(element))}
    </div>
  );
};

export default FloatingElements;
