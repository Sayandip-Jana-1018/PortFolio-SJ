import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useMagneticEffect } from '../../hooks/useAnimations';

interface GlassmorphicProfileProps {
  scrollProgress: MotionValue<number>;
}

const GlassmorphicProfile: React.FC<GlassmorphicProfileProps> = ({ scrollProgress }) => {
  const { accentColor } = useTheme();
  const magneticRef = useMagneticEffect();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scale = useTransform(scrollProgress, [0, 1], [1, 1.5]);
  const profileOpacity = useTransform(scrollProgress, [0, 1], [1, 0.2]);

  const boxShadow = useTransform(scrollProgress, (p) => {
    const glowOpacity = 1 - p;
    const size = 20 + p * 30;
    const alpha = Math.floor(glowOpacity * 255).toString(16).padStart(2, '0');
    return `0 0 ${size}px ${accentColor}${alpha}`;
  });

  return (
    <div className="relative flex items-center justify-center">
      {/* Enhanced 3D Breathing Wave Animations */}
      {/* First Wave - Outermost with 3D effect */}
      <motion.div
        className="absolute w-[220px] h-[220px] sm:w-[380px] sm:h-[380px]"
        style={{
          borderRadius: '50%',
          border: `2px solid ${accentColor}40`,
          background: `radial-gradient(circle, transparent 60%, ${accentColor}15 100%)`,
          boxShadow: `0 0 25px ${accentColor}30`,
          opacity: 0.9,
          filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.2))',
          transform: 'perspective(800px) rotateX(5deg)'
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.7, 0.85, 0.7],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Second Wave - Middle with 3D effect */}
      <motion.div
        className="absolute w-[180px] h-[180px] sm:w-[320px] sm:h-[320px]"
        style={{
          borderRadius: '50%',
          border: `1.5px solid ${accentColor}30`,
          background: `radial-gradient(circle, transparent 70%, ${accentColor}20 100%)`,
          boxShadow: `0 0 20px ${accentColor}25`,
          backdropFilter: 'blur(2px)',
          transform: 'perspective(800px) rotateX(3deg)'
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.6, 0.75, 0.6],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      {/* Third Wave - Inner with 3D effect */}
      <motion.div
        className="absolute w-[150px] h-[150px] sm:w-[260px] sm:h-[260px]"
        style={{
          borderRadius: '50%',
          border: `1px solid ${accentColor}25`,
          background: `radial-gradient(circle, transparent 75%, ${accentColor}25 100%)`,
          boxShadow: `0 0 15px ${accentColor}20`,
          backdropFilter: 'blur(1px)',
          transform: 'perspective(800px) rotateX(2deg)'
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.65, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Reduced accent particles - only 4 instead of 8, rendered only after mount to prevent hydration mismatch */}
      {mounted && [0, 90, 180, 270].map((angle) => {
        const size = 2 + Math.random() * 2; // Smaller size
        const distance = 180 + Math.random() * 30;

        return (
          <motion.div
            key={angle}
            className="absolute"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 ${size * 2}px ${accentColor}60`,
              left: 'calc(50% - 2px)',
              top: 'calc(50% - 2px)',
              transform: `rotate(${angle}deg) translateY(-${distance}px)`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 4, // Much slower
              repeat: Infinity,
              ease: "easeInOut",
              delay: angle / 90,
            }}
          />
        );
      })}

      {/* Fourth Wave - Outermost with enhanced 3D effect */}
      <motion.div
        className="absolute w-[250px] h-[250px] sm:w-[420px] sm:h-[420px]"
        style={{
          borderRadius: '50%',
          border: `1px solid ${accentColor}20`,
          background: `radial-gradient(circle, transparent 55%, ${accentColor}10 100%)`,
          boxShadow: `0 0 20px ${accentColor}20`,
          filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.15))',
          backdropFilter: 'blur(1.5px)',
          transform: 'perspective(800px) rotateX(4deg)'
        }}
        animate={{
          scale: [1, 1.03, 1],
          opacity: [0.4, 0.5, 0.4],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />


      {/* Circular photo frame with glassmorphic effect */}
      <motion.div
        className="relative w-[170px] h-[170px] sm:w-[250px] sm:h-[250px] md:w-[290px] md:h-[290px] lg:w-[330px] lg:h-[330px] rounded-full overflow-hidden transition-all duration-300 ease-out z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div className="w-full h-full relative" style={{ scale, opacity: profileOpacity }}>
          {/* Glassmorphic border */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow,
              zIndex: 1
            }}
          />

        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 glassmorphic-dark rounded-full z-10 opacity-30" />

          {/* Profile image */}
          <div className="relative w-full h-full">
            <Image
              src="/images/profile_photo.jpg"
              alt="Profile Picture"
              fill
              priority
              sizes="450px"
              className="object-cover"
              style={{
                objectPosition: 'center center'
              }}
            />
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default GlassmorphicProfile;
