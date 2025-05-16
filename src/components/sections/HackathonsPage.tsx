import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import BackgroundElements from '../about/BackgroundElements';
import TitleSection from '../about/TitleSection';
import HackathonCarousel from '../hackathons/HackathonCarousel';
import HackathonStats from '../hackathons/HackathonStats';
import HackathonTimeline from '../hackathons/HackathonTimeline';
import { hackathonsData, hackathonStats } from '@/data/hackathonsData';

interface HackathonsPageProps {
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const HackathonsPage: React.FC<HackathonsPageProps> = ({ sectionRef }) => {
  const { theme, accentColor } = useTheme();
  
  // Refs for scroll animations
  const titleRef = useRef(null);
  const carouselRef = useRef(null);
  const statsRef = useRef(null);
  const timelineRef = useRef(null);
  
  // InView hooks for animations
  const titleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const carouselInView = useInView(carouselRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const timelineInView = useInView(timelineRef, { once: true, margin: "-100px" });
  
  // Animation variants
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div 
      id="hackathons" 
      ref={sectionRef}
      className="min-h-screen relative section-container py-20 overflow-hidden"
      style={{ 
        background: theme === 'dark' 
          ? `linear-gradient(135deg, #000000, #0a0a18, ${accentColor}40)` 
          : `linear-gradient(135deg, #ffffff, #f0f0f5, ${accentColor}20)`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      {/* Dynamic background elements */}
      <BackgroundElements accentColor={accentColor} theme={theme} />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Title Section with Typing Effect */}
        <motion.div
          ref={titleRef}
          initial="hidden"
          animate={titleInView ? "visible" : "hidden"}
          variants={fadeInUpVariant}
          className="mb-12"
        >
          <TitleSection 
            accentColor={accentColor} 
            theme={theme} 
            title="Hackathons"
            subtitlePrefix="I create"
            subtitles={[
              'Innovative Solutions',
              'Award-Winning Projects',
              'Technical Implementations',
              'Collaborative Experiences'
            ]}
          />
        </motion.div>
        
        <motion.p 
          className="text-center max-w-2xl mx-auto mb-16 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          A showcase of my competitive coding achievements and hackathon experiences,
          where innovation meets technical excellence.
        </motion.p>
        
        {/* Hackathon Stats Section */}
        <motion.div
          ref={statsRef}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          variants={fadeInUpVariant}
        >
          <HackathonStats 
            accentColor={accentColor} 
            theme={theme} 
            stats={hackathonStats} 
          />
        </motion.div>
        
        {/* Hackathon Carousel */}
        <motion.div
          ref={carouselRef}
          initial="hidden"
          animate={carouselInView ? "visible" : "hidden"}
          variants={fadeInUpVariant}
          className="my-20"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Featured Hackathons</h2>
          <HackathonCarousel 
            hackathons={hackathonsData} 
            accentColor={accentColor} 
            theme={theme} 
          />
        </motion.div>
        
        {/* Hackathon Timeline */}
        <motion.div
          ref={timelineRef}
          initial="hidden"
          animate={timelineInView ? "visible" : "hidden"}
          variants={fadeInUpVariant}
          className="mt-20"
        >
          <HackathonTimeline 
            hackathons={hackathonsData} 
            accentColor={accentColor} 
            theme={theme} 
          />
        </motion.div>
      </div>
    </div>
  );
};

export default HackathonsPage;