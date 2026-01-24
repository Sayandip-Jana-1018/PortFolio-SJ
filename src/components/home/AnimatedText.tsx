import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useParallax } from '../../hooks/useAnimations';

interface AnimatedTextProps {
  scrollProgress: number;
}

// Helper to darken a hex color
const darkenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
};

// Helper to lighten a hex color
const lightenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min((num >> 16) + amt, 255);
  const G = Math.min((num >> 8 & 0x00FF) + amt, 255);
  const B = Math.min((num & 0x0000FF) + amt, 255);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
};

const AnimatedText: React.FC<AnimatedTextProps> = ({ scrollProgress }) => {
  const { accentColor, theme } = useTheme();
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

  // Get text color - Responsive: Black in Light Mode, White in Dark Mode
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';

  // Generate metallic gradient colors based on accent
  const lightAccent = lightenColor(accentColor, 35);
  const darkAccent = darkenColor(accentColor, 35);

  // 3D text shadow for depth effect
  const textShadow3D = `
    1px 1px 2px ${darkAccent}90,
    2px 2px 4px ${darkAccent}70,
    3px 3px 6px ${darkAccent}50,
    4px 4px 8px ${darkAccent}30,
    5px 5px 10px rgba(0,0,0,0.4),
    0 0 30px ${accentColor}50,
    0 0 60px ${accentColor}30
  `;

  const titles = ['Developer', 'Designer', 'Innovator'];

  return (
    <div className="relative z-10 mt-[-80px] sm:mt-[-70px] md:mt-[-90px] lg:mt-[-100px]" style={{ opacity: textOpacity }}>
      {/* Name with animated gradient */}
      <motion.div
        ref={nameParallaxRef}
        initial="hidden"
        animate="visible"
        variants={nameVariants}
        className="mb-6 relative"
      >
        {/* Glow orb behind name */}
        <motion.div
          className="absolute inset-0 -z-10 opacity-60 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${accentColor}40 0%, transparent 60%)`,
            transform: 'scale(2)'
          }}
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wide relative text-center">
          {/* Decorative elements */}
          <motion.div
            className="absolute -top-8 -left-8 w-16 h-16 opacity-40"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              border: `2px solid ${accentColor}40`,
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
            }}
          />
          <motion.div
            className="absolute -top-4 -right-4 w-12 h-12 opacity-40"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{
              border: `2px solid ${accentColor}50`,
              borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%'
            }}
          />

          {/* Main Name with Metallic 3D Effect */}
          <span
            className="inline-block relative"
            style={{
              fontFamily: 'var(--font-title)',
              backgroundImage: `linear-gradient(
                135deg, 
                ${lightAccent} 0%, 
                ${accentColor} 20%, 
                ${lightAccent} 40%, 
                ${accentColor} 60%, 
                ${lightAccent} 80%, 
                ${accentColor} 100%
              )`,
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: textShadow3D,
              animation: 'shimmer 4s ease-in-out infinite',
            }}
          >
            Sayandip Jana
          </span>

          {/* Shine sweep overlay */}
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
            style={{ mixBlendMode: 'overlay' }}
          >
            <motion.div
              className="w-[25%] h-full"
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)`,
                transform: 'skewX(-25deg)'
              }}
              animate={{ x: ['-100%', '500%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            />
          </motion.div>
        </h1>
      </motion.div>

      {/* Animated titles */}
      <motion.div
        ref={titleParallaxRef}
        initial="hidden"
        animate="visible"
        variants={titleVariants}
        className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 text-lg sm:text-xl md:text-2xl relative mb-16 sm:mb-12 md:mb-16"
      >
        {/* Decorative lines */}
        <motion.div
          className="absolute left-1/2 -top-4 w-[1px] h-8 opacity-40"
          style={{ backgroundColor: accentColor, transform: 'translateX(-50%)' }}
          animate={{ height: [8, 16, 8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 -bottom-4 w-[1px] h-8 opacity-40"
          style={{ backgroundColor: accentColor, transform: 'translateX(-50%)' }}
          animate={{ height: [8, 16, 8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {titles.map((title, index) => (
          <React.Fragment key={title}>
            <motion.div
              variants={titleItemVariants}
              className="px-5 py-2.5 rounded-full border font-medium"
              style={{
                fontFamily: 'var(--font-body)',
                borderColor: `${accentColor}50`,
                background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: `0 0 15px ${accentColor}20, inset 0 0 20px ${accentColor}10`,
                color: textColor,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 0 25px ${accentColor}40, inset 0 0 30px ${accentColor}20`,
                borderColor: accentColor
              }}
            >
              {title}
            </motion.div>

            {index < titles.length - 1 && (
              <motion.span
                variants={titleItemVariants}
                className="flex items-center text-2xl hidden sm:flex md:flex lg:flex"
                style={{ color: accentColor, opacity: 0.6 }}
              >
                •
              </motion.span>
            )}
          </React.Fragment>
        ))}
      </motion.div>

      {/* CSS Keyframes for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedText;
