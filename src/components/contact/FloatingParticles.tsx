import React, { useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface FloatingParticlesProps {
  count?: number;
  accentColor: string;
  theme: string;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({ 
  count = 15, 
  accentColor, 
  theme 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const controls = useAnimation();
  
  React.useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, isInView]);

  // Generate random particles
  const particles = Array.from({ length: count }).map((_, i) => {
    const size = Math.random() * 80 + 20; // 20-100px
    const initialX = Math.random() * 100; // 0-100%
    const initialY = Math.random() * 100; // 0-100%
    const duration = Math.random() * 20 + 10; // 10-30s
    const delay = Math.random() * 5; // 0-5s
    const opacity = Math.random() * 0.15 + 0.05; // 0.05-0.2
    
    return {
      id: i,
      size,
      initialX,
      initialY,
      duration,
      delay,
      opacity
    };
  });

  return (
    <motion.div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
    >
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full blur-xl"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            backgroundColor: `${accentColor}`,
            opacity: particle.opacity,
          }}
          variants={{
            hidden: { 
              opacity: 0,
              scale: 0.5
            },
            visible: { 
              opacity: particle.opacity,
              scale: 1,
              transition: {
                delay: particle.delay,
                duration: 1.5
              }
            }
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: particle.duration,
            ease: "easeInOut",
            delay: particle.delay
          }}
        />
      ))}
    </motion.div>
  );
};

export default FloatingParticles;
