import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useMagneticEffect } from '../../hooks/useAnimations';

interface GlassmorphicProfileProps {
  scrollProgress: number;
}

const GlassmorphicProfile: React.FC<GlassmorphicProfileProps> = ({ scrollProgress }) => {
  const { accentColor } = useTheme();
  const photoRef = useRef<HTMLDivElement>(null);
  const magneticRef = useMagneticEffect();
  const glowRef = useRef<HTMLDivElement>(null);
  
  // Handle the photo scaling and fading on scroll
  useEffect(() => {
    if (photoRef.current) {
      // Start with a circular frame and expand to fill screen
      const scale = 1 + scrollProgress * 0.5; // Scale from 1 to 1.5
      const opacity = 1 - scrollProgress * 0.8; // Fade from 1 to 0.2
      
      photoRef.current.style.transform = `scale(${scale})`;
      photoRef.current.style.opacity = `${opacity}`;
    }
    
    // Animate the glow effect based on scroll
    if (glowRef.current) {
      const glowOpacity = 1 - scrollProgress;
      const glowSize = 20 + scrollProgress * 30;
      glowRef.current.style.boxShadow = `0 0 ${glowSize}px ${accentColor}${Math.floor(glowOpacity * 255).toString(16).padStart(2, '0')}`;
    }
  }, [scrollProgress, accentColor]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Enhanced 3D Breathing Wave Animations */}
      {/* First Wave - Outermost with 3D effect */}
      <motion.div
        className="absolute w-[280px] h-[280px] sm:w-[490px] sm:h-[490px]"
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
          scale: [1, 1.08, 1],
          opacity: [0.7, 0.9, 0.7],
          rotateX: ['5deg', '2deg', '5deg'],
          rotateY: ['0deg', '2deg', '0deg']
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Second Wave - Middle with 3D effect */}
      <motion.div
        className="absolute w-[240px] h-[240px] sm:w-[420px] sm:h-[420px]"
        style={{
          borderRadius: '50%',
          border: `1.5px solid ${accentColor}30`,
          background: `radial-gradient(circle, transparent 70%, ${accentColor}20 100%)`,
          boxShadow: `0 0 20px ${accentColor}25`,
          backdropFilter: 'blur(2px)',
          transform: 'perspective(800px) rotateX(3deg)'
        }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.6, 0.8, 0.6],
          rotateX: ['3deg', '6deg', '3deg'],
          rotateY: ['0deg', '-2deg', '0deg']
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      {/* Third Wave - Inner with 3D effect */}
      <motion.div
        className="absolute w-[200px] h-[200px] sm:w-[350px] sm:h-[350px]"
        style={{
          borderRadius: '50%',
          border: `1px solid ${accentColor}25`,
          background: `radial-gradient(circle, transparent 75%, ${accentColor}25 100%)`,
          boxShadow: `0 0 15px ${accentColor}20`,
          backdropFilter: 'blur(1px)',
          transform: 'perspective(800px) rotateX(2deg)'
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.7, 0.5],
          rotateX: ['2deg', '-2deg', '2deg'],
          rotateY: ['0deg', '3deg', '0deg']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Enhanced 3D accent particles floating around */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        // Randomize particle size for more dynamic effect
        const size = 3 + Math.random() * 3;
        // Create varying distances from center
        const distance = 170 + Math.random() * 40;
        // Random z-index for 3D depth effect
        const zIndex = Math.floor(Math.random() * 5);
        
        return (
          <motion.div
            key={angle}
            className="absolute"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 ${size * 3}px ${accentColor}`,
              left: 'calc(50% - 2px)',
              top: 'calc(50% - 2px)',
              transform: `rotate(${angle}deg) translateY(-${distance}px)`,
              zIndex: zIndex
            }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 0.9, 0.4],
              filter: [`blur(0px)`, `blur(2px)`, `blur(0px)`],
              boxShadow: [
                `0 0 ${size * 2}px ${accentColor}80`,
                `0 0 ${size * 4}px ${accentColor}`,
                `0 0 ${size * 2}px ${accentColor}80`
              ],
              // Add subtle movement in 3D space
              z: ['-5px', '5px', '-5px']
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: angle / 45,
            }}
          />
        );
      })}

      {/* Fourth Wave - Outermost with enhanced 3D effect */}
      <motion.div
        className="absolute w-[320px] h-[320px] sm:w-[530px] sm:h-[530px]"
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
          scale: [1, 1.05, 1],
          opacity: [0.4, 0.6, 0.4],
          rotateX: ['4deg', '0deg', '4deg'],
          rotateY: ['0deg', '4deg', '0deg']
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />


      {/* Circular photo frame with glassmorphic effect */}
      <motion.div
        ref={photoRef}
        className="relative w-[240px] h-[240px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden transition-all duration-300 ease-out z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Glassmorphic border */}
        <div 
          ref={glowRef}
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `0 0 20px ${accentColor}80`,
            zIndex: 1
          }}
        />
        
        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 glassmorphic-dark rounded-full z-10 opacity-30" />
        
        {/* Profile image */}
        <div className="relative w-full h-full">
          <Image 
            src="/MyPhoto.jpeg" 
            alt="Profile Picture" 
            fill 
            priority
            sizes="450px"
            className="object-contain" 
            style={{
              objectFit: 'cover',
              objectPosition: 'center 30%' // Adjust this value to center the face
            }}
          />
        </div>
      </motion.div>
      
      {/* Magnetic effect button */}
      <div ref={magneticRef} className="absolute bottom-0 z-20 transform translate-y-1/2">
        <motion.a
          href="#explore"
          className="btn-glassmorphic px-8 py-4 mt-24 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 text-white text-sm"
          data-accent-color="true"
          style={{ backgroundColor: accentColor }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: `0 10px 25px rgba(0,0,0,0.2), 0 0 15px ${accentColor}80` 
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <span className="text-sm">Explore Portfolio</span>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </motion.svg>
        </motion.a>
      </div>
    </div>
  );
};

export default GlassmorphicProfile;
