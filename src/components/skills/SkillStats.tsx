import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../../context/ThemeContext';
import { FiCode, FiCoffee, FiAward, FiClock } from 'react-icons/fi';

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

const StatItem: React.FC<StatItemProps> = ({ 
  icon, 
  value, 
  label, 
  suffix = '', 
  delay = 0 
}) => {
  const [count, setCount] = useState(0);
  const { accentColor } = useTheme();
  const controls = useAnimation();
  const [ref, inView] = useInView({ 
    triggerOnce: false,
    threshold: 0.2
  });
  
  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { 
          duration: 0.8,
          delay
        }
      });
      
      // Animate counter
      let start = 0;
      const end = value;
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      
      const timer = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smoother animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * end);
        
        setCount(current);
        
        if (progress === 1) {
          clearInterval(timer);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [inView, value, controls, delay]);
  
  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
    >
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ 
          backgroundColor: `${accentColor}20`,
          color: accentColor
        }}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">
        {count}{suffix}
      </div>
      <div className="text-sm opacity-70">{label}</div>
    </motion.div>
  );
};

const SkillStats: React.FC = () => {
  return (
    <div className="mt-24 mb-16">
      <motion.h3
        className="text-3xl font-bold mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false }}
      >
        Experience Overview
      </motion.h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <StatItem 
          icon={<FiCode size={28} />} 
          value={50} 
          label="Projects Completed"
          delay={0}
        />
        <StatItem 
          icon={<FiCoffee size={28} />} 
          value={15000} 
          label="Lines of Code"
          suffix="+"
          delay={0.2}
        />
        <StatItem 
          icon={<FiAward size={28} />} 
          value={25} 
          label="Certifications"
          delay={0.4}
        />
        <StatItem 
          icon={<FiClock size={28} />} 
          value={4} 
          label="Years Experience"
          suffix="+"
          delay={0.6}
        />
      </div>
    </div>
  );
};

export default SkillStats;
