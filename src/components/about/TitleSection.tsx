import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/dist/TextPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

interface TitleSectionProps {
  accentColor: string;
  theme: string;
  title?: string;
  subtitlePrefix?: string;
  subtitles?: string[];
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

const TitleSection: React.FC<TitleSectionProps> = ({ 
  accentColor, 
  theme, 
  title = "About Me",
  subtitlePrefix = "I am a",
  subtitles = [
    'Full Stack Developer',
    'UI/UX Designer',
    'Problem Solver',
    'Tech Enthusiast'
  ]
}) => {
  const textRef = useRef<HTMLDivElement>(null);

  // Text typing animation with GSAP
  useEffect(() => {
    if (typeof window === 'undefined' || !textRef.current) return;
    
    let currentIndex = 0;
    
    const animateText = () => {
      gsap.to(textRef.current, {
        duration: 0.5,
        text: { value: '', padSpace: true },
        ease: 'none',
        onComplete: () => {
          currentIndex = (currentIndex + 1) % subtitles.length;
          gsap.to(textRef.current, {
            duration: 1.5,
            text: { value: subtitles[currentIndex], padSpace: true },
            ease: 'none',
            onComplete: () => {
              gsap.delayedCall(2, animateText);
            }
          });
        }
      });
    };
    
    gsap.to(textRef.current, {
      duration: 1.5,
      text: { value: subtitles[0], padSpace: true },
      ease: 'none',
      onComplete: () => {
        gsap.delayedCall(2, animateText);
      }
    });
    
    return () => {
      gsap.killTweensOf(textRef.current);
    };
  }, [subtitles]);

  // Generate metallic gradient colors based on accent
  const lightAccent = lightenColor(accentColor, 30);
  const darkAccent = darkenColor(accentColor, 30);

  // 3D text shadow for depth effect
  const textShadow3D = `
    1px 1px 2px ${darkAccent}80,
    2px 2px 4px ${darkAccent}60,
    3px 3px 6px ${darkAccent}40,
    4px 4px 8px rgba(0,0,0,0.3),
    0 0 20px ${accentColor}40,
    0 0 40px ${accentColor}30
  `;

  return (
    <motion.div 
      className="text-center mb-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="inline-block relative mb-2"
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Decorative glow orb behind title */}
        <motion.div 
          className="absolute inset-0 -z-10 opacity-50 blur-3xl"
          style={{ 
            background: `radial-gradient(circle, ${accentColor}50 0%, transparent 70%)`,
            transform: 'scale(1.5)'
          }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Main Title with 3D Metallic Effect */}
        <h2 
          className="text-5xl md:text-7xl font-bold relative z-10 tracking-wide"
          style={{ 
            fontFamily: 'var(--font-title)',
            backgroundImage: `linear-gradient(
              135deg, 
              ${lightAccent} 0%, 
              ${accentColor} 25%, 
              ${lightAccent} 50%, 
              ${accentColor} 75%, 
              ${lightAccent} 100%
            )`,
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: textShadow3D,
            animation: 'shimmer 5s ease-in-out infinite',
          }}
        >
          {title}
        </h2>

        {/* Shine sweep overlay */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-lg"
          style={{ mixBlendMode: 'overlay' }}
        >
          <motion.div 
            className="w-[30%] h-full"
            style={{ 
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)`,
              transform: 'skewX(-20deg)'
            }}
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
      
      {/* Animated typing effect */}
      <motion.div className="flex justify-center items-center text-xl md:text-2xl mt-6 h-10">
        <span 
          className="mr-2 opacity-70 font-light"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {subtitlePrefix}
        </span>
        <div 
          ref={textRef} 
          className="font-semibold"
          style={{ 
            color: accentColor,
            fontFamily: 'var(--font-body)',
            textShadow: `0 0 10px ${accentColor}50`
          }}
        >
          {subtitles[0]}
        </div>
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
    </motion.div>
  );
};

export default TitleSection;
