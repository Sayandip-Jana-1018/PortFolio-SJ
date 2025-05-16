import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useParallax } from '../../hooks/useAnimations';

interface AnimatedTextProps {
  scrollProgress: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ scrollProgress }) => {
  const { accentColor } = useTheme();
  const nameParallaxRef = useParallax(0.2);
  const titleParallaxRef = useParallax(0.3);
  
  // Text animation variants
  const nameVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  const titleItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Calculate opacity based on scroll progress
  const textOpacity = Math.max(0, 1 - scrollProgress * 2);
  
  const titles = ['Developer', 'Designer', 'Innovator'];

  return (
    <div className="relative z-10 mt-[-80px] sm:mt-[-70px] md:mt-[-90px] lg:mt-[-100px]" style={{ opacity: textOpacity }}>
      {/* Name with animated gradient */}
      <motion.div
        ref={nameParallaxRef}
        initial="hidden"
        animate="visible"
        variants={nameVariants}
        className="mb-4"
      >
        <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight relative">
          {/* Decorative elements */}
          <motion.div 
            className="absolute -top-8 -left-8 w-16 h-16 opacity-30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ 
              border: `2px solid ${accentColor}30`,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
            }}
          />
          <motion.div 
            className="absolute -top-4 -right-4 w-12 h-12 opacity-30"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ 
              border: `2px solid ${accentColor}40`,
              borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%'
            }}
          />
          
          <span className="inline-block text-gradient"
            style={{ 
              backgroundImage: `linear-gradient(135deg, #fff 0%, ${accentColor} 50%, #fff 100%)`,
              textShadow: `0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px ${accentColor}80, 0 0 15px ${accentColor}40`,
              fontWeight: 800,
              letterSpacing: '0.5px'
            }}
          >
            Sayandip Jana
          </span>
        </h1>
      </motion.div>
      
      {/* Animated titles */}
      <motion.div
        ref={titleParallaxRef}
        initial="hidden"
        animate="visible"
        variants={titleVariants}
        className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-base sm:text-lg md:text-xl lg:text-2xl relative mb-16 sm:mb-12 md:mb-16"
      >
        {/* Decorative lines */}
        <motion.div 
          className="absolute left-1/2 -top-4 w-[1px] h-8 opacity-30"
          style={{ backgroundColor: accentColor, transform: 'translateX(-50%)' }}
          animate={{ height: [8, 16, 8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute left-1/2 -bottom-4 w-[1px] h-8 opacity-30"
          style={{ backgroundColor: accentColor, transform: 'translateX(-50%)' }}
          animate={{ height: [8, 16, 8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        {titles.map((title, index) => (
          <React.Fragment key={title}>
            <motion.div
              variants={titleItemVariants}
              className="glassmorphic px-4 py-2 rounded-full"
              style={{
                borderColor: `${accentColor}40`,
                boxShadow: `0 0 10px ${accentColor}30`
              }}
            >
              {title}
            </motion.div>
            
            {index < titles.length - 1 && (
              <motion.span 
                variants={titleItemVariants}
                className="flex items-center text-2xl hidden sm:flex md:flex lg:flex"
              >
                •
              </motion.span>
            )}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default AnimatedText;
