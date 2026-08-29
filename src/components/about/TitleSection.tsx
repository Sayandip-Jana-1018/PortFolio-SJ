import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/dist/TextPlugin';
import MaskedHeading from '../common/MaskedHeading';

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

  return (
    <motion.div 
      className="text-center mb-10"
      initial={{ opacity: 0, y: 30, scale: 0.85, rotateX: 25 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 15 }}
      style={{ 
        perspective: 1200,
        filter: `drop-shadow(0 20px 30px ${accentColor}30)`
      }}
    >
      {/* MaskedHeading — video-filled text with reveal animation */}
      <div className="mb-4">
        <MaskedHeading
          text={title}
          tag="h2"
          mediaType="video"
          src="/media/LiveWallpaper.webm"
          fillScale={1.3}
          parallax={20}
          drift={10}
          reveal="rise"
          trigger="view"
          textScale={0.1}
          weight={800}
          tracking={-0.02}
          lineHeight={1.1}
          fontSize="clamp(3.2rem, 8vw, 5.5rem)"
          className="mx-auto pb-2"
        />
      </div>
      
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
    </motion.div>
  );
};

export default TitleSection;
