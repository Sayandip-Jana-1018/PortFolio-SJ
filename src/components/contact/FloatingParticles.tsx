import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface FloatingParticlesProps {
  count?: number;
  accentColor: string;
  theme: string;
}

interface FloatingParticle {
  id: number;
  size: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  opacity: number;
  driftX: number;
  driftY: number;
}

/** Random values, so this only runs on the client, and only once per count. */
const createParticles = (count: number): FloatingParticle[] =>
  Array.from({ length: count }, (_, id) => ({
    id,
    size: Math.random() * 80 + 20, // 20-100px
    left: Math.random() * 100, // 0-100%
    top: Math.random() * 100, // 0-100%
    duration: Math.random() * 20 + 10, // 10-30s
    delay: Math.random() * 5, // 0-5s
    opacity: Math.random() * 0.15 + 0.05, // 0.05-0.2
    driftX: Math.random() * 100 - 50, // -50 to 50px
    driftY: Math.random() * 100 - 50, // -50 to 50px
  }));

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 15,
  accentColor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const controls = useAnimation();
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  useEffect(() => {
    setParticles(createParticles(count));
  }, [count]);

  useEffect(() => {
    controls.start(isInView ? 'visible' : 'hidden');
  }, [controls, isInView]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="ambient-float absolute rounded-full blur-xl"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            backgroundColor: accentColor,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            '--float-x': `${particle.driftX}px`,
            '--float-y': `${particle.driftY}px`,
          } as React.CSSProperties}
        />
      ))}
    </motion.div>
  );
};

export default FloatingParticles;
