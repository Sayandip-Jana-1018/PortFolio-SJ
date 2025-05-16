import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useParticles } from '../../hooks/useAnimations';

interface AnimatedBackgroundProps {
  intensity?: number;
  particleCount?: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  intensity = 0.5,
  particleCount = 30
}) => {
  const { theme, accentColor } = useTheme();
  const { particles, containerRef } = useParticles(particleCount, accentColor);
  const gradientRef = useRef<HTMLDivElement>(null);
  
  // Update the gradient colors when accent color changes
  useEffect(() => {
    if (!gradientRef.current) return;
    
    // Create a subtle gradient with the accent color
    const accentWithOpacity = `${accentColor}22`;
    gradientRef.current.style.background = `
      radial-gradient(circle at 20% 20%, ${accentWithOpacity} 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, ${accentWithOpacity} 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, ${theme === 'dark' ? '#00000000' : '#ffffff00'} 0%, ${theme === 'dark' ? '#000000' : '#ffffff'} 100%)
    `;
    
    // Listen for accent color changes
    const handleAccentColorChange = (e: CustomEvent) => {
      const color = e.detail.color;
      const colorWithOpacity = `${color}22`;
      if (gradientRef.current) {
        gradientRef.current.style.background = `
          radial-gradient(circle at 20% 20%, ${colorWithOpacity} 0%, transparent 40%),
          radial-gradient(circle at 80% 80%, ${colorWithOpacity} 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, ${theme === 'dark' ? '#00000000' : '#ffffff00'} 0%, ${theme === 'dark' ? '#000000' : '#ffffff'} 100%)
        `;
      }
    };
    
    document.addEventListener('accentcolorchange', handleAccentColorChange as EventListener);
    
    return () => {
      document.removeEventListener('accentcolorchange', handleAccentColorChange as EventListener);
    };
  }, [accentColor, theme]);
  
  return (
    <>
      {/* Dynamic gradient background */}
      <div 
        ref={gradientRef}
        className="fixed inset-0 z-0 transition-all duration-1000"
        data-accent-gradient="true"
      />
      
      {/* Noise texture overlay */}
      <div className="noise-overlay" />
      
      {/* Particles */}
      <div 
        ref={containerRef} 
        className="particles-container"
        style={{ opacity: intensity }}
      >
        {particles.map((particle) => {
          // Determine the shape CSS
          let shapeCss = {};
          
          switch(particle.shape) {
            case 'triangle':
              shapeCss = {
                width: '0',
                height: '0',
                backgroundColor: 'transparent',
                borderLeft: `${particle.size}px solid transparent`,
                borderRight: `${particle.size}px solid transparent`,
                borderBottom: `${particle.size * 1.5}px solid ${particle.color}`,
              };
              break;
              
            case 'square':
              shapeCss = {
                width: `${particle.size * 1.3}px`,
                height: `${particle.size * 1.3}px`,
                backgroundColor: particle.color,
              };
              break;
              
            case 'pentagon':
              shapeCss = {
                width: `${particle.size * 2}px`,
                height: `${particle.size * 2}px`,
                clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                backgroundColor: particle.color,
              };
              break;
              
            case 'hexagon':
              shapeCss = {
                width: `${particle.size * 2}px`,
                height: `${particle.size * 2}px`,
                clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                backgroundColor: particle.color,
              };
              break;
              
            case 'star':
              shapeCss = {
                width: `${particle.size * 2}px`,
                height: `${particle.size * 2}px`,
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                backgroundColor: particle.color,
              };
              break;
          }
          
          return (
            <motion.div
              key={particle.id}
              className="particle"
              animate={{
                x: [particle.x, particle.x + 100, particle.x - 50, particle.x],
                y: [particle.y, particle.y - 100, particle.y + 50, particle.y],
                rotate: [particle.rotation, particle.rotation + 180, particle.rotation + 360],
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: particle.x,
                top: particle.y,
                opacity: particle.opacity,
                ...shapeCss
              }}
            />
          );
        })}
      </div>
      
      {/* Animated gradient blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            background: `${accentColor}10`,
            width: '40vw',
            height: '40vw',
            left: '10%',
            top: '20%',
          }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            background: `${accentColor}10`,
            width: '30vw',
            height: '30vw',
            right: '10%',
            bottom: '20%',
          }}
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 40, -40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </>
  );
};

export default AnimatedBackground;
