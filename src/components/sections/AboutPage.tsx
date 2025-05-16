import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useInView, useScroll } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Import modular components
import BackgroundElements from '../about/BackgroundElements';
import TitleSection from '../about/TitleSection';
import ProfileCard from '../about/ProfileCard';
import ExpertiseCards from '../about/ExpertiseCards';
import TechnicalSkills from '../about/TechnicalSkills';
import StatsSection from '../about/StatsSection';
import QuoteSection from '../about/QuoteSection';
import ExperienceTimeline from '../about/ExperienceTimeline';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutPageProps {
  sectionRef: React.RefObject<HTMLDivElement>;
}

const AboutPage: React.FC<AboutPageProps> = ({ sectionRef }) => {
  const { theme, accentColor } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Individual refs for each section
  const titleRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const expertiseRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Individual inView states for each section with different thresholds
  const titleInView = useInView(titleRef, { once: false, amount: 0.5 });
  const profileInView = useInView(profileRef, { once: false, amount: 0.3 });
  const expertiseInView = useInView(expertiseRef, { once: false, amount: 0.25 });
  const skillsInView = useInView(skillsRef, { once: false, amount: 0.2 });
  const statsInView = useInView(statsRef, { once: false, amount: 0.2 });
  const quoteInView = useInView(quoteRef, { once: false, amount: 0.15 });
  const timelineInView = useInView(timelineRef, { once: false, amount: 0.15 });
  
  // Animation variants for fade-in effect
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 80, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };
  
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div 
      id="about" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative section-container py-10 overflow-hidden"
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
      
      {/* Main content container */}
      <motion.div 
        ref={containerRef}
        className="w-full max-w-7xl mx-auto px-4 z-20 content-block"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Title Section with Typing Effect */}
        <motion.div
          ref={titleRef}
          initial="hidden"
          animate={titleInView ? "visible" : "hidden"}
          variants={fadeInUpVariant}
        >
          <TitleSection 
            accentColor={accentColor} 
            theme={theme} 
            title="About Me"
            subtitlePrefix="I am a"
            subtitles={[
              'Full Stack Developer',
              'UI/UX Designer',
              'Problem Solver',
              'Tech Enthusiast'
            ]}
          />
        </motion.div>
        
        {/* Main content with card-based layout */}
        <div className="grid grid-cols-1 gap-8 mb-10 w-full">
          {/* Profile Card */}
          <motion.div
            ref={profileRef}
            initial="hidden"
            animate={profileInView ? "visible" : "hidden"}
            variants={fadeInUpVariant}
          >
            <ProfileCard accentColor={accentColor} theme={theme} />
          </motion.div>
          
          {/* Core Expertise Cards */}
          <motion.div
            ref={expertiseRef}
            initial="hidden"
            animate={expertiseInView ? "visible" : "hidden"}
            variants={fadeInUpVariant}
          >
            <ExpertiseCards accentColor={accentColor} theme={theme} />
          </motion.div>
          
          {/* Technical Skills Grid */}
          <motion.div
            ref={skillsRef}
            initial="hidden"
            animate={skillsInView ? "visible" : "hidden"}
            variants={fadeInUpVariant}
          >
            <TechnicalSkills accentColor={accentColor} theme={theme} />
          </motion.div>
        </div>
        
        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          variants={fadeInUpVariant}
        >
          <StatsSection accentColor={accentColor} theme={theme} />
        </motion.div>
        
        {/* Two-column layout for Quote and Experience */}
        <div className="grid grid-cols-1 gap-6 mt-8">
          {/* Quote */}
          <motion.div
            ref={quoteRef}
            initial="hidden"
            animate={quoteInView ? "visible" : "hidden"}
            variants={fadeInUpVariant}
          >
            <QuoteSection accentColor={accentColor} theme={theme} />
          </motion.div>
          
          {/* Experience Timeline */}
          <motion.div
            ref={timelineRef}
            initial="hidden"
            animate={timelineInView ? "visible" : "hidden"}
            variants={fadeInUpVariant}
          >
            <ExperienceTimeline accentColor={accentColor} theme={theme} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;