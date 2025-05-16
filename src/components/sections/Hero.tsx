import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Image from 'next/image';

interface HeroProps {
  circleRefForwarded?: (node: HTMLDivElement | null) => void;
  videoRefForwarded?: (node: HTMLVideoElement | null) => void;
  liveWallpaperRefForwarded?: (node: HTMLVideoElement | null) => void;
  transitionState?: 'initial' | 'profile' | 'wallpaper' | 'content';
  onScrollButtonClick?: (direction: 'up' | 'down') => void;
}

const Hero: React.FC<HeroProps> = ({ circleRefForwarded, videoRefForwarded, liveWallpaperRefForwarded, transitionState = 'initial', onScrollButtonClick }) => {
  const { theme, accentColor } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Simulate loading and trigger fade-in
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Circle animation
  useEffect(() => {
    if (isLoaded && circleRef.current) {
      const circle = circleRef.current;
      circle.style.transition = 'transform 2.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 2s';
      circle.style.transform = 'scale(1)';
      circle.style.opacity = '1';
    }
  }, [isLoaded]);
  
  // Initialize video
  useEffect(() => {
    if (videoRef.current) {
      // Preload the video but don't play it yet
      videoRef.current.load();
    }
  }, []);
  
  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-black-900 to-black">
      {/* Dynamic background particles */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, ${accentColor}22 0%, transparent 70%)` }}></div>
      </div>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-radial from-transparent to-black opacity-70"></div>

      {/* Hidden video that will be revealed when scrolling up (original video) */}
      <div className="absolute inset-0 z-5 opacity-0">
        <video 
          ref={(node) => {
            videoRef.current = node;
            if (videoRefForwarded) videoRefForwarded(node);
          }}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
        >
          <source src="/LiveWallpaper.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* LiveWallpaper video that appears after profile picture scrolling */}
      <AnimatePresence>
        {transitionState === 'wallpaper' && (
          <motion.div 
            className="absolute inset-0 z-15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <video 
              ref={(node) => {
                if (liveWallpaperRefForwarded) liveWallpaperRefForwarded(node);
              }}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              style={{ opacity: 0 }} // Initially hidden, will be controlled by GSAP
            >
              <source src="/LiveWallpaper.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular Frame with Photo */}
      <div className="relative z-10 flex items-center justify-center h-full" style={{ transform: 'translateY(-10vh)' }}>
        <motion.div 
          ref={(node) => {
            circleRef.current = node;
            if (circleRefForwarded) circleRefForwarded(node);
          }}
          className="relative rounded-full overflow-hidden border-4 transform opacity-0 shadow-2xl"
          style={{ 
            borderColor: accentColor, 
            width: '450px', 
            height: '450px', 
            transform: 'scale(0.5)'
          }}
          animate={{
            boxShadow: transitionState !== 'initial' ? '0 0 80px rgba(255,255,255,0.4)' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            transition: { duration: 1.5 }
          }}
        >
          {/* Photo */}
          <Image
            src="/MyPhoto.jpeg"
            alt="Profile Picture"
            fill
            sizes="(max-width: 768px) 100vw, 450px"
            className="object-cover"
            priority
          />
        </motion.div>
      </div>

      {/* Name and Title - Appears when loaded */}
      <motion.div 
        className="absolute top-2/3 left-0 right-0 z-20 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={isLoaded && transitionState === 'initial' ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white" style={{ textShadow: '0 0 15px rgba(0,0,0,0.6)' }}>
          Sayandip Jana
        </h1>
        <h2 
          className="text-2xl md:text-3xl mb-6 font-semibold"
          style={{ color: accentColor, textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
        >
          Healthcare AI Developer
        </h2>
      </motion.div>
      
      {/* Animated text that appears during wallpaper transition */}
      <AnimatePresence>
        {transitionState === 'wallpaper' && (
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 text-center w-full px-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl -z-10"></div>
              <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white tracking-wider px-8 pt-6" style={{ textShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                Welcome to My World
              </h1>
              <h2 
                className="text-3xl md:text-4xl mb-6 pb-6 px-8"
                style={{ color: accentColor, textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
              >
                Innovating Healthcare with AI
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Indicator - Only shown in initial state */}
      <AnimatePresence>
        {transitionState === 'initial' && (
          <motion.div
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1.8, duration: 1 }}
          >
            <button 
              onClick={() => onScrollButtonClick && onScrollButtonClick('up')}
              className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform duration-300 focus:outline-none"
              aria-label="Scroll Up"
            >
              <p className="text-sm mb-2 text-white font-medium hover:text-blue-300 transition-colors duration-300">Scroll Up</p>
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1 hover:border-blue-300 hover:shadow-glow transition-all duration-300" style={{ boxShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                <motion.div
                  animate={{
                    y: [12, 0, 12],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  className="w-2 h-2 rounded-full bg-white group-hover:bg-black-300"
                />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Continue Indicator - Only shown in wallpaper state */}
      <AnimatePresence>
        {transitionState === 'wallpaper' && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <button 
              onClick={() => onScrollButtonClick && onScrollButtonClick('up')}
              className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform duration-300 focus:outline-none"
              aria-label="Continue Scrolling Up"
            >
              <p className="text-sm mb-2 text-white font-medium hover:text-blue-300 transition-colors duration-300">Continue Scrolling Up</p>
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1 hover:border-blue-300 hover:shadow-glow transition-all duration-300" style={{ boxShadow: '0 0 15px rgba(255,255,255,0.3)' }}>
                <motion.div
                  animate={{
                    y: [12, 0, 12],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  className="w-2 h-2 rounded-full bg-white group-hover:bg-black-300"
                />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
