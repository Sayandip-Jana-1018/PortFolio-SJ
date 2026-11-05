import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../../context/ThemeContext';
import { FiCode, FiCpu, FiAward, FiTarget } from 'react-icons/fi';

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
  const countRef = useRef<HTMLSpanElement>(null);
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

      // Animate counter, writing straight to the DOM so each tick skips React
      const duration = 2000; // 2 seconds
      const startTime = performance.now();
      let raf = 0;

      const tick = (now: number) => {
        const progress = Math.min(Math.max(now - startTime, 0) / duration, 1);

        // Easing function for smoother animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        if (countRef.current) {
          countRef.current.textContent = String(Math.floor(easeOutQuart * value));
        }

        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      return () => cancelAnimationFrame(raf);
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
        <span ref={countRef}>0</span>{suffix}
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

      <div className="flex flex-wrap justify-around gap-8 w-full">
        <StatItem
          icon={<FiCpu size={32} />}
          value={6}
          suffix="+"
          label="ML/AI Projects"
          delay={0.1}
        />
        <StatItem
          icon={<FiCode size={32} />}
          value={8}
          suffix="+"
          label="Web Projects"
          delay={0.2}
        />
        <StatItem
          icon={<FiAward size={32} />}
          value={5}
          suffix=""
          label="Hackathons Won"
          delay={0.3}
        />
        <StatItem
          icon={<FiTarget size={32} />}
          value={2}
          suffix="+"
          label="Years Experience"
          delay={0.4}
        />
      </div>
    </div>
  );
};

export default SkillStats;
