import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiPlay, FiPause } from 'react-icons/fi';
import HackathonCard, { HackathonProject } from './HackathonCard';

interface HackathonCarouselProps {
  hackathons: HackathonProject[];
  accentColor: string;
  theme: string;
}

const HackathonCarousel: React.FC<HackathonCarouselProps> = ({ 
  hackathons, 
  accentColor, 
  theme 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handle next and previous actions
  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % hackathons.length);
    resetAutoPlay();
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + hackathons.length) % hackathons.length);
    resetAutoPlay();
  };

  // Reset auto play timer when user interacts
  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
    
    if (isAutoPlaying) {
      autoPlayRef.current = setTimeout(() => {
        handleNext();
      }, 5000);
    }
  };

  // Toggle auto play
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Set up auto play
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setTimeout(() => {
        handleNext();
      }, 5000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, activeIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Variants for carousel animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      y: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.7,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      zIndex: 10,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 }
      }
    },
    left: {
      x: -250,
      y: 50,
      opacity: 0.7,
      scale: 0.8,
      rotateY: -10,
      zIndex: 5,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    farLeft: {
      x: -350,
      y: 100,
      opacity: 0.5,
      scale: 0.7,
      rotateY: -20,
      zIndex: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    right: {
      x: 250,
      y: 50,
      opacity: 0.7,
      scale: 0.8,
      rotateY: 10,
      zIndex: 5,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    farRight: {
      x: 350,
      y: 100,
      opacity: 0.5,
      scale: 0.7,
      rotateY: 20,
      zIndex: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      y: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.7,
      rotateY: direction < 0 ? 45 : -45,
      zIndex: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }
    })
  };

  // Get visible hackathons (we'll show 5 cards in a stacked layout)
  const getVisibleHackathons = () => {
    const result = [];
    // Get 2 cards before active
    for (let i = -2; i <= 2; i++) {
      const index = (activeIndex + i + hackathons.length) % hackathons.length;
      result.push(index);
    }
    return result;
  };

  const visibleIndices = getVisibleHackathons();

  // Get the animation variant based on position relative to active card
  const getVariant = (index: number) => {
    const position = visibleIndices.indexOf(index);
    
    switch (position) {
      case 0: return "farLeft";
      case 1: return "left";
      case 2: return "center";
      case 3: return "right";
      case 4: return "farRight";
      default: return "";
    }
  };
  
  // Get blur amount based on distance from center
  const getBlurAmount = (index: number) => {
    const position = visibleIndices.indexOf(index);
    
    switch (position) {
      case 0: return 'blur(4px)';
      case 1: return 'blur(2px)';
      case 2: return 'blur(0px)';
      case 3: return 'blur(2px)';
      case 4: return 'blur(4px)';
      default: return 'blur(5px)';
    }
  };

  return (
    <section className="w-full py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-current opacity-50"></div>
            <h2 className="text-3xl md:text-4xl font-bold">Hackathon Projects</h2>
            <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-current opacity-50"></div>
          </div>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Innovative solutions created during intense coding competitions
          </p>
        </motion.div>
        
        <div className="relative w-full" ref={carouselRef}>
          {/* Main Carousel */}
          <motion.div 
            className="relative h-[700px] md:h-[650px] overflow-visible flex items-center justify-center perspective-1000"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {hackathons.map((hackathon, index) => {
            // Only render visible cards in the stack
            if (!visibleIndices.includes(index)) return null;
            
            const isActive = index === activeIndex;
            const variant = getVariant(index);
            
            return (
              <motion.div
                key={hackathon.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate={variant}
                exit="exit"
                className="absolute w-full max-w-md mx-auto cursor-pointer"
                onClick={() => {
                  const position = visibleIndices.indexOf(index);
                  if (position < 2) handlePrev();
                  if (position > 2) handleNext();
                }}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center center",
                  filter: isActive ? "none" : `brightness(0.85) ${getBlurAmount(index)}`,
                  pointerEvents: isActive ? 'auto' : 'none'
                }}
                whileHover={{
                  scale: isActive ? 1.05 : 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <HackathonCard 
                  hackathon={hackathon} 
                  index={index} 
                  accentColor={accentColor} 
                  theme={theme}
                  isActive={isActive}
                />
              </motion.div>
            );
          })}
            </AnimatePresence>
          </motion.div>

      {/* Navigation Controls */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center px-4 md:px-10 -mt-6 z-20">
        <motion.button
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgba(20, 20, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: `0 5px 15px rgba(0, 0, 0, 0.15), 0 0 10px ${accentColor}30`,
            border: `1px solid ${accentColor}30`
          }}
          onClick={handlePrev}
          whileHover={{ scale: 1.1, boxShadow: `0 8px 25px rgba(0, 0, 0, 0.2), 0 0 15px ${accentColor}40` }}
          whileTap={{ scale: 0.95 }}
        >
          <FiChevronLeft size={28} color={accentColor} />
        </motion.button>
        
        <motion.button
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgba(20, 20, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: `0 5px 15px rgba(0, 0, 0, 0.15), 0 0 10px ${accentColor}30`,
            border: `1px solid ${accentColor}30`
          }}
          onClick={handleNext}
          whileHover={{ scale: 1.1, boxShadow: `0 8px 25px rgba(0, 0, 0, 0.2), 0 0 15px ${accentColor}40` }}
          whileTap={{ scale: 0.95 }}
        >
          <FiChevronRight size={28} color={accentColor} />
        </motion.button>
      </div>

      {/* Pagination and Controls */}
      <motion.div 
        className="flex flex-col items-center mt-20 gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {/* Pagination Indicators */}
        <div className="flex justify-center gap-3">
          {hackathons.map((_, index) => (
            <motion.button
              key={index}
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: index === activeIndex ? accentColor : `${accentColor}40`,
                transform: index === activeIndex ? 'scale(1.3)' : 'scale(1)',
                boxShadow: index === activeIndex ? `0 0 10px ${accentColor}80` : 'none'
              }}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
                resetAutoPlay();
              }}
              whileHover={{ scale: 1.5, boxShadow: `0 0 12px ${accentColor}` }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>

        {/* Auto Play Toggle */}
        <motion.button
          className="flex items-center gap-2 text-sm px-5 py-2 rounded-full mt-2"
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgba(20, 20, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            color: accentColor,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: `0 2px 10px rgba(0, 0, 0, 0.15), 0 0 5px ${accentColor}30`,
            border: `1px solid ${accentColor}30`
          }}
          onClick={toggleAutoPlay}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: `0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px ${accentColor}40` 
          }}
          whileTap={{ scale: 0.95 }}
        >
          {isAutoPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
          <span>{isAutoPlaying ? 'Pause Slideshow' : 'Play Slideshow'}</span>
        </motion.button>
      </motion.div>
      </div>
    </div>
  </section>
  );
};

export default HackathonCarousel;
