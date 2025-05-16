import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
  opacity: number;
}

const ClickEffect: React.FC = () => {
  const { accentColor } = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Create particles at click position
      const newParticles: Particle[] = [];
      const particleCount = 12; // Number of particles per click
      
      for (let i = 0; i < particleCount; i++) {
        // Calculate angle for even distribution in a circle
        const angle = (i / particleCount) * 360;
        const speed = 2 + Math.random() * 3;
        
        newParticles.push({
          id: clickCount * particleCount + i,
          x: e.clientX,
          y: e.clientY,
          size: 5 + Math.random() * 8,
          color: i % 3 === 0 ? accentColor : '#ffffff',
          angle: angle,
          speed: speed,
          opacity: 0.8,
        });
      }
      
      setClickCount(prev => prev + 1);
      setParticles(prev => [...prev, ...newParticles]);
      
      // Remove particles after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.includes(p)));
      }, 1000);
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [accentColor, clickCount]);

  // Listen for accent color changes
  useEffect(() => {
    const handleAccentColorChange = (e: CustomEvent) => {
      const color = e.detail.color;
      setParticles(prev => 
        prev.map(p => {
          if (p.id % 3 === 0) {
            return { ...p, color };
          }
          return p;
        })
      );
    };
    
    document.addEventListener('accentcolorchange', handleAccentColorChange as EventListener);
    
    return () => {
      document.removeEventListener('accentcolorchange', handleAccentColorChange as EventListener);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x, 
              y: particle.y, 
              opacity: particle.opacity,
              scale: 0
            }}
            animate={{ 
              x: particle.x + Math.cos(particle.angle * (Math.PI / 180)) * (particle.speed * 30),
              y: particle.y + Math.sin(particle.angle * (Math.PI / 180)) * (particle.speed * 30),
              opacity: 0,
              scale: 1
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: particle.color,
              boxShadow: `0 0 6px ${particle.color}`,
              zIndex: 9999,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ClickEffect;
