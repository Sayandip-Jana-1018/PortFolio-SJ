import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface SectionTitleProps {
  title: string;
  subtitle: string;
  isInView: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, isInView }) => {
  const { theme, accentColor } = useTheme();
  
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut"
      }
    }
  };
  
  const subtitleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };
  
  const lineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: '80px',
      transition: { 
        duration: 0.8, 
        delay: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.h2 
        className="text-4xl md:text-5xl font-bold text-white mb-2"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={titleVariants}
      >
        {title}
      </motion.h2>
      
      <motion.div
        className="h-1 rounded-full mb-4"
        style={{ backgroundColor: accentColor }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={lineVariants}
      />
      
      <motion.p
        className="text-gray-400 text-lg max-w-2xl text-center"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={subtitleVariants}
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

export default SectionTitle;
