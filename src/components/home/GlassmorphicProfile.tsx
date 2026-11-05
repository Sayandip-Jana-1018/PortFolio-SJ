import React, { useEffect, useMemo } from 'react';
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

  // Picked once. Picking in render restarted the sparks on every re-render.
  const sparks = useMemo(
    () => [0, 90, 180, 270].map((angle) => ({
      angle,
      size: 2 + Math.random() * 2,
      duration: 8 + Math.random() * 4,
      delay: angle / 90,
    })),
    []
  );

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
      <div className="profile-wave-1 absolute w-[220px] h-[220px] sm:w-[380px] sm:h-[380px]">
        {/* The filter is on the inner element, so it is drawn once and the
            animation only moves the finished layer. */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: '50%',
            border: `2px solid ${accentColor}40`,
            background: `radial-gradient(circle, transparent 60%, ${accentColor}15 100%)`,
            boxShadow: `0 0 25px ${accentColor}30`,
            filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.2))',
          }}
        />
      </div>

      {/* Second Wave - Middle with 3D effect */}
      <div
        className="profile-wave-2 absolute w-[180px] h-[180px] sm:w-[320px] sm:h-[320px]"
        style={{
          borderRadius: '50%',
          border: `1.5px solid ${accentColor}30`,
          background: `radial-gradient(circle, transparent 70%, ${accentColor}20 100%)`,
          boxShadow: `0 0 20px ${accentColor}25`,
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Third Wave - Inner with 3D effect */}
      <div
        className="profile-wave-3 absolute w-[150px] h-[150px] sm:w-[260px] sm:h-[260px]"
        style={{
          borderRadius: '50%',
          border: `1px solid ${accentColor}25`,
          background: `radial-gradient(circle, transparent 75%, ${accentColor}25 100%)`,
          boxShadow: `0 0 15px ${accentColor}20`,
          backdropFilter: 'blur(1px)',
        }}
      />

      {/* Reduced accent particles - only 4 instead of 8, rendered only after mount to prevent hydration mismatch */}
      {mounted && sparks.map(({ angle, size, duration, delay }) => (
        <div
          key={angle}
          className="profile-spark absolute"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: accentColor,
            boxShadow: `0 0 ${size * 2}px ${accentColor}60`,
            left: 'calc(50% - 2px)',
            top: 'calc(50% - 2px)',
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}

      {/* Fourth Wave - Outermost with enhanced 3D effect */}
      <div
        className="profile-wave-4 absolute w-[250px] h-[250px] sm:w-[420px] sm:h-[420px]"
        style={{ borderRadius: '50%', backdropFilter: 'blur(1.5px)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            borderRadius: '50%',
            border: `1px solid ${accentColor}20`,
            background: `radial-gradient(circle, transparent 55%, ${accentColor}10 100%)`,
            boxShadow: `0 0 20px ${accentColor}20`,
            filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.15))',
          }}
        />
      </div>


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
