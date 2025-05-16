import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundElementsProps {
  accentColor: string;
  theme: string;
}

const BackgroundElements: React.FC<BackgroundElementsProps> = ({ accentColor, theme }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient borders */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-2 opacity-60"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, 
          boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}50`
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-2 opacity-60"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, 
          boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}50`
        }}
        animate={{ x: ['100%', '-100%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Glassy corner elements */}
      <motion.div 
        className="absolute top-0 left-0 w-64 h-64 opacity-30"
        style={{ 
          background: `radial-gradient(circle, ${accentColor}80 0%, transparent 70%)`,
          filter: 'blur(30px)',
          borderRadius: '0 0 100% 0',
          boxShadow: `0 0 30px ${accentColor}40`
        }}
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <motion.div 
        className="absolute bottom-0 right-0 w-64 h-64 opacity-30"
        style={{ 
          background: `radial-gradient(circle, ${accentColor}80 0%, transparent 70%)`,
          filter: 'blur(30px)',
          borderRadius: '100% 0 0 0',
          boxShadow: `0 0 30px ${accentColor}40`
        }}
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Additional corner elements */}
      <motion.div 
        className="absolute top-0 right-0 w-48 h-48 opacity-30"
        style={{ 
          background: `radial-gradient(circle, ${accentColor}80 0%, transparent 70%)`,
          filter: 'blur(25px)',
          borderRadius: '0 0 0 100%',
          boxShadow: `0 0 30px ${accentColor}40`
        }}
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      
      <motion.div 
        className="absolute bottom-0 left-0 w-48 h-48 opacity-30"
        style={{ 
          background: `radial-gradient(circle, ${accentColor}80 0%, transparent 70%)`,
          filter: 'blur(25px)',
          borderRadius: '0 100% 0 0',
          boxShadow: `0 0 30px ${accentColor}40`
        }}
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      
      {/* Floating geometric shapes - reduced quantity */}
      {Array.from({ length: 12 }).map((_, i) => {
        const isCircle = i % 3 === 0;
        const isSquare = i % 3 === 1;
        const isTriangle = i % 3 === 2;
        const size = 15 + Math.random() * 100;
        
        return (
          <motion.div
            key={`geo-shape-${i}`}
            className={`absolute ${isCircle ? 'rounded-full' : isSquare ? 'rounded-lg' : ''} opacity-40`}
            style={{
              width: size,
              height: isTriangle ? size * 0.866 : size, // Adjust height for triangles
              border: `2px solid ${accentColor}${theme === 'dark' ? 'CC' : 'AA'}`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 4 === 0 
                ? `radial-gradient(circle, ${accentColor}60 0%, transparent 70%)` 
                : i % 4 === 1 
                  ? `linear-gradient(135deg, ${accentColor}40, transparent)` 
                  : i % 4 === 2
                    ? `linear-gradient(45deg, transparent, ${accentColor}30, transparent)`
                    : 'transparent',
              boxShadow: `0 0 ${10 + Math.random() * 20}px ${accentColor}${i % 2 === 0 ? '80' : '60'}`,
              clipPath: isTriangle ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
              backdropFilter: i % 4 === 0 ? 'blur(5px)' : 'none',
              WebkitBackdropFilter: i % 4 === 0 ? 'blur(5px)' : 'none',
              zIndex: i % 5 === 0 ? 5 : 1
            }}
            animate={{
              y: [0, -20 * Math.random(), 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, i % 2 === 0 ? 180 : -180],
              scale: [1, i % 2 === 0 ? 1.15 : 0.9, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 20 + Math.random() * 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 10
            }}
          />
        );
      })}
      
      {/* Animated blurred circles */}
      <motion.div 
        className="absolute rounded-full opacity-50"
        style={{ 
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${accentColor}70 0%, transparent 70%)`,
          filter: 'blur(80px)',
          top: '20%',
          left: '10%',
          boxShadow: `0 0 100px ${accentColor}60`
        }}
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, 40, 0],
          y: [0, -30, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 35, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute rounded-full opacity-50"
        style={{ 
          width: 350,
          height: 350,
          background: `radial-gradient(circle, ${accentColor}70 0%, transparent 70%)`,
          filter: 'blur(80px)',
          bottom: '20%',
          right: '10%',
          boxShadow: `0 0 100px ${accentColor}60`
        }}
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, -40, 0],
          y: [0, 30, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      {/* Additional center blurred circle */}
      <motion.div 
        className="absolute rounded-full opacity-30"
        style={{ 
          width: 300,
          height: 300,
          background: `radial-gradient(circle, ${accentColor}50 0%, transparent 70%)`,
          filter: 'blur(70px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 80px ${accentColor}40`
        }}
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 5
        }}
      />
      
      {/* Diagonal light beam */}
      <motion.div 
        className="absolute opacity-20"
        style={{ 
          width: '200%',
          height: '20px',
          background: `linear-gradient(90deg, transparent, ${accentColor}70, transparent)`,
          filter: 'blur(10px)',
          top: '30%',
          left: '-50%',
          transform: 'rotate(45deg)',
          boxShadow: `0 0 30px ${accentColor}40`
        }}
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          boxShadow: [`0 0 20px ${accentColor}30`, `0 0 40px ${accentColor}60`, `0 0 20px ${accentColor}30`]
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </div>
  );
};

export default BackgroundElements;
