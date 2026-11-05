import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/dist/TextPlugin';
import MaskedHeading from '../common/MaskedHeading';
import { observeViewport } from '../../hooks/useInViewport';

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
  // Parents pass a new array on every render, so the effect keys on the content.
  const subtitlesKey = subtitles.join('|');

  // Typing loop: one killable timeline that only runs near the viewport.
  // The first subtitle is already in the DOM, so it holds for 3.5s, then each
  // cycle erases, types the next one, and holds for 2s.
  useEffect(() => {
    const el = textRef.current;
    if (!el || subtitles.length === 0) return;

    const timeline = gsap.timeline({ repeat: -1, delay: 3.5, paused: true });
    [...subtitles.slice(1), subtitles[0]].forEach((value) => {
      timeline.to(el, { duration: 0.5, text: { value: '', padSpace: true }, ease: 'none' });
      timeline.to(el, { duration: 1.5, text: { value, padSpace: true }, ease: 'none' });
      timeline.to({}, { duration: 2 });
    });

    const stopObserving = observeViewport(el, (inView) => {
      timeline.paused(!inView);
    });

    return () => {
      stopObserving();
      timeline.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtitlesKey]);

  return (
    <motion.div 
      className="text-center mb-10"
      initial={{ opacity: 0, y: 30, scale: 0.85, rotateX: 25 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 15 }}
      style={{ perspective: 1200 }}
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
          // Text shadows are drawn once. A drop-shadow filter around the video
          // fill had to be recalculated on every video frame.
          style={{ textShadow: `0 20px 60px ${accentColor}30` }}
        />
      </div>
      
      {/* Animated typing effect */}
      <motion.div className="flex justify-center items-center text-xl md:text-2xl mt-6 h-10">
        <span 
          className="mr-2 opacity-70 font-light"
          style={{ fontFamily: 'var(--font-body)', textShadow: `0 20px 60px ${accentColor}30` }}
        >
          {subtitlePrefix}
        </span>
        <div 
          ref={textRef} 
          className="font-semibold"
          style={{ 
            color: accentColor,
            fontFamily: 'var(--font-body)',
            textShadow: `0 0 10px ${accentColor}50, 0 20px 60px ${accentColor}30`
          }}
        >
          {subtitles[0]}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TitleSection;
