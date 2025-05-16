import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../context/ThemeContext";
import Navbar from "../components/layout/Navbar";
import { useTheme } from "../context/ThemeContext";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { FiChevronDown, FiArrowRight, FiAward, FiCode, FiUser, FiFileText, FiStar, FiArrowDown } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import AnimatedBackground from "../components/common/AnimatedBackground";
import GlassmorphicProfile from "../components/home/GlassmorphicProfile";
import AnimatedText from "../components/home/AnimatedText";
import CustomCursor from "../components/common/CustomCursor";
import ClickEffect from "../components/common/ClickEffect";
import FloatingElements from "../components/common/FloatingElements";
import PremiumParticles from "../components/common/PremiumParticles";
import DynamicBackground from "../components/common/DynamicBackground";
import { CanvasRevealEffect } from "../components/common/CanvasRevealEffect";
import AboutPage from "../components/sections/AboutPage";
import ProjectsPage from "../components/sections/ProjectsPage";
import SkillsPage from "../components/sections/SkillsPage";
import HackathonsPage from "../components/sections/HackathonsPage";
import CertificatesPage from "../components/sections/CertificatesPage";
import ContactPage from "../components/sections/ContactPage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const { theme, accentColor } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const wallpaperSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showWallpaper, setShowWallpaper] = useState(false);
  
  // Refs for scroll-triggered animations in Welcome section
  const welcomeTitleRef = useRef<HTMLDivElement>(null);
  const welcomeTextRef = useRef<HTMLDivElement>(null);
  const cardGridRef = useRef<HTMLDivElement>(null);
  const additionalCardsRef = useRef<HTMLDivElement>(null);
  
  // Individual inView states for each section with different thresholds
  const welcomeTitleInView = useInView(welcomeTitleRef, { once: false, amount: 0.5 });
  const welcomeTextInView = useInView(welcomeTextRef, { once: false, amount: 0.4 });
  const cardGridInView = useInView(cardGridRef, { once: false, amount: 0.3 });
  const additionalCardsInView = useInView(additionalCardsRef, { once: false, amount: 0.2 });
  
  // Get scroll progress for animations
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ['start start', 'end end']
  });
  
  // Animation variant for fade-in effect
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
  
  // Transform scroll progress for various effects
  const scrollProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const [scrollValue, setScrollValue] = useState(0);
  
  // Update scroll value for components that can't use motion values directly
  useEffect(() => {
    const unsubscribe = scrollProgress.on("change", v => setScrollValue(v));
    return () => unsubscribe();
  }, [scrollProgress]);
  
  // Client-side initialization
  useEffect(() => {
    setIsClient(true);
    
    // Add the glassmorphism CSS to the page
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/glassmorphism.css';
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);
  
  // State to track if user is on the first page
  const [isOnFirstPage, setIsOnFirstPage] = useState(true);
  
  // Track scroll position to determine if user is on first page
  useEffect(() => {
    const handleScroll = () => {
      // Consider user on first page if scrolled less than 100px
      setIsOnFirstPage(window.scrollY < 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Set wallpaper to always be visible
  useEffect(() => {
    setShowWallpaper(true);
  }, []);

  // Handle video loading and play
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Video play error:', error);
      });
    }
  }, [videoLoaded]);

  // Section refs for scrolling
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const hackathonsSectionRef = useRef<HTMLDivElement>(null);
  const certificatesSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  
  // Scroll to section function
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ 
        behavior: 'smooth'
      });
    }
  };
  
  // Scroll down function
  const scrollToWallpaper = () => {
    if (wallpaperSectionRef.current) {
      wallpaperSectionRef.current.scrollIntoView({ 
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };
  
  // Handle navigation from navbar
  useEffect(() => {
    const handleNavigation = () => {
      const hash = window.location.hash;
      if (hash === '#about') scrollToSection(aboutSectionRef);
      else if (hash === '#projects') scrollToSection(projectsSectionRef);
      else if (hash === '#skills') scrollToSection(skillsSectionRef);
      else if (hash === '#hackathons') scrollToSection(hackathonsSectionRef);
      else if (hash === '#certificates') scrollToSection(certificatesSectionRef);
      else if (hash === '#contact') scrollToSection(contactSectionRef);
    };
    
    // Run on initial load and when hash changes
    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
    
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);

  return (
    <div className={`${geistSans.className} ${geistMono.className} font-[family-name:var(--font-geist-sans)]`}>
      <Head>
        <title>Portfolio | Sayandip Jana</title>
        <meta name="description" content="Personal portfolio showcasing my projects, skills, and achievements" />
        <meta property="og:title" content="Sayandip Jana | Portfolio" />
        <meta property="og:description" content="Explore the work of Sayandip Jana - Developer, Designer, Innovator" />
        <meta property="og:image" content="/MyPhoto.jpeg" />
        <meta name="theme-color" content="#000000" />
      </Head>
      
      <div className="relative overflow-x-hidden">
        <Navbar />
        
        {isClient && (
          <>
            <CustomCursor />
            <ClickEffect />
            <FloatingElements count={8} intensity={0.1} />
            <PremiumParticles intensity={0.7} />
            <DynamicBackground intensity={0.6} />
            <CanvasRevealEffect active={true} cornerParticles={true} containerClassName="fixed inset-0 pointer-events-none z-10" />
          </>
        )}
        
        {/* Animated Background with particles and gradients */}
        <AnimatedBackground intensity={0.6} particleCount={40} />
        
        {/* Main content */}
        <div 
          ref={mainRef}
          className={`main-content ${theme === 'dark' ? 'text-white' : 'text-black'}`}
          style={{ position: 'relative' }}
        >
          {/* Hero section with parallax effects */}
          <div className="h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-8 sm:py-4 md:py-2 lg:py-0 section-container">
            {/* Premium visual elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 w-full h-1 opacity-20"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-1 opacity-20"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
              />
              <motion.div 
                className="absolute top-0 left-0 w-1 h-full opacity-20"
                style={{ background: `linear-gradient(180deg, transparent, ${accentColor}, transparent)` }}
              />
              <motion.div 
                className="absolute top-0 right-0 w-1 h-full opacity-20"
                style={{ background: `linear-gradient(180deg, transparent, ${accentColor}, transparent)` }}
              />
            </div>
            {/* Decorative corner elements */}
            <motion.div 
              className="absolute top-[10%] left-[10%] w-24 h-24 opacity-20"
              style={{ 
                borderWidth: '1px 0 0 1px',
                borderStyle: 'solid',
                borderColor: accentColor,
                borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute bottom-[10%] right-[10%] w-20 h-20 opacity-20"
              style={{ 
                borderWidth: '0 1px 1px 0',
                borderStyle: 'solid',
                borderColor: accentColor,
                borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%'
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Additional decorative elements */}
            <motion.div 
              className="absolute top-[20%] right-[15%] w-16 h-16 opacity-15"
              style={{ 
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: `${accentColor}70`,
                borderRadius: '50%',
                borderLeftWidth: '0px',
                borderBottomWidth: '0px'
              }}
              animate={{ rotate: 180 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute bottom-[20%] left-[15%] w-12 h-12 opacity-15"
              style={{ 
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: `${accentColor}70`,
                borderRadius: '50%',
                borderRightWidth: '0px',
                borderTopWidth: '0px'
              }}
              animate={{ rotate: -180 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />
            {/* Animated text with parallax effect */}
            <div className="mb-12 content-block">
              <AnimatedText scrollProgress={scrollValue} />
            </div>
            
            {/* Glassmorphic profile with scroll animations */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
              style={{ 
                transform: 'perspective(1000px) rotateX(5deg)',
                transformStyle: 'preserve-3d'
              }}
              whileHover={{ 
                scale: 1.05,
                rotateX: 0,
                transition: { duration: 0.3 }
              }}
            >
              {/* Subtle animated circle around the profile */}
              <motion.div 
                className="absolute -inset-3 rounded-full opacity-30"
                style={{ 
                  borderWidth: '1px',
                  borderStyle: 'dashed',
                  borderColor: `${accentColor}80`
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Use the original profile component but make it bigger */}
              <div style={{ transform: 'scale(1.15)' }}>
                <GlassmorphicProfile scrollProgress={scrollValue} />
              </div>
            </motion.div>
            
            {/* Scroll indicator with premium styling */}
            <motion.div 
              className="absolute bottom-10 flex flex-col items-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ opacity: 1 - scrollValue * 2 }}
              onClick={scrollToWallpaper}
            >
              <p className="text-sm mb-2 opacity-70">Scroll to explore</p>
              
              {/* Premium scroll indicator */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.2 }}
              >
                <motion.div 
                  className="absolute -inset-2 rounded-full opacity-40"
                  style={{ 
                    background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
                  }}
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-bounce"
                  style={{ filter: `drop-shadow(0 0 3px ${accentColor})` }}
                >
                  <path 
                    d="M12 5L12 19M12 19L19 12M12 19L5 12" 
                    stroke={accentColor}
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </div>
          {/* Wallpaper section */}
          <div 
            ref={wallpaperSectionRef}
            id="explore" 
            className="min-h-screen flex items-center justify-center relative section-container"
            style={{ marginTop: '20px' }}
          >
            {/* Video background */}
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 z-0"
              >
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src="/LiveWallpaper.mp4"
                    muted
                    loop
                    playsInline
                    autoPlay
                    onLoadedData={() => {
                      console.log('LiveWallpaper loaded successfully');
                      setVideoLoaded(true);
                    }}
                  />
                  <div 
                    className="absolute inset-0 z-10" 
                    style={{
                      background: `linear-gradient(to bottom, 
                        rgba(0,0,0,0.7) 0%, 
                        rgba(0,0,0,0.4) 40%, 
                        ${accentColor}10 60%, 
                        rgba(0,0,0,0.7) 100%
                      )`
                    }}
                  />
                  
                  {/* Animated particles overlay */}
                  <div className="absolute inset-0 z-5 opacity-30">
                    {Array(20).fill(0).map((_, i) => (
                      <motion.div
                        key={`particle-${i}`}
                        className="absolute rounded-full"
                        style={{
                          width: 2 + Math.random() * 6,
                          height: 2 + Math.random() * 6,
                          backgroundColor: i % 3 === 0 ? accentColor : '#ffffff',
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          opacity: 0.3 + Math.random() * 0.4,
                          boxShadow: i % 5 === 0 ? `0 0 10px ${accentColor}` : 'none'
                        }}
                        animate={{
                          y: [0, -30, 0],
                          x: [0, Math.random() * 20 - 10, 0],
                          opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{
                          duration: 3 + Math.random() * 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: Math.random() * 5
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
            </AnimatePresence>
            
            {/* Content */}
            <motion.div 
              className="w-full max-w-4xl mx-auto px-4 text-center z-20 content-block"
              style={{ 
                opacity: 1, // Always visible
                y: 0 // No transform based on scroll
              }}
            >
              <motion.div className="relative inline-block" ref={welcomeTitleRef}>
                {/* Enhanced decorative elements around the title */}
                <motion.div 
                  className="absolute -top-8 -left-8 w-16 h-16 opacity-40"
                  style={{ 
                    borderWidth: '2px 0 0 2px',
                    borderStyle: 'solid',
                    borderColor: accentColor,
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                    boxShadow: `0 0 15px ${accentColor}40`
                  }}
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ 
                    rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
                <motion.div 
                  className="absolute -bottom-8 -right-8 w-16 h-16 opacity-40"
                  style={{ 
                    borderWidth: '0 2px 2px 0',
                    borderStyle: 'solid',
                    borderColor: accentColor,
                    borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%',
                    boxShadow: `0 0 15px ${accentColor}40`
                  }}
                  animate={{ rotate: -360, scale: [1, 1.1, 1] }}
                  transition={{ 
                    rotate: { duration: 18, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
                
                <motion.h2 
                  className="text-4xl md:text-6xl font-bold mb-6 relative" 
                  style={{ 
                    color: '#ffffff',
                    textShadow: `0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px ${accentColor}, 0 0 30px ${accentColor}80`,
                    fontWeight: 800,
                    letterSpacing: '0.5px'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Welcome to My World
                </motion.h2>
              </motion.div>
              <motion.p 
                ref={welcomeTextRef}
                className="text-xl mb-8" 
                style={{ 
                  color: '#ffffff',
                  textShadow: `0 0 15px ${accentColor}80, 0 0 10px rgba(255, 255, 255, 0.5)`,
                  fontWeight: 500
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Explore my work, skills, and journey through this interactive experience
              </motion.p>
              
              {/* Spacing */}
              <div className="mb-8"></div>
              
              {/* Glassmorphic cards for navigation */}
              <div ref={cardGridRef} className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {[
                  { title: 'Projects', icon: <FiCode size={32} />, path: '/#projects' },
                  { title: 'Skills', icon: <FiAward size={32} />, path: '/#skills' },
                  { title: 'About Me', icon: <FiUser size={32} />, path: '/#about' }
                ].map((item, index) => (
                  <motion.a
                    key={item.title}
                    href={item.path}
                    className="glassmorphic-card p-8 flex flex-col items-center hover-3d"
                    style={{ boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2), 0 0 10px ${accentColor}20` }}
                    initial="hidden"
                    animate={cardGridInView ? "visible" : "hidden"}
                    variants={{
                      hidden: { opacity: 0, y: 80, scale: 0.95 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        scale: 1,
                        transition: { 
                          duration: 0.8, 
                          delay: index * 0.15,
                          ease: [0.25, 0.1, 0.25, 1.0]
                        }
                      }
                    }}
                    whileHover={{ 
                      y: -10, 
                      boxShadow: `0 15px 40px rgba(0, 0, 0, 0.3), 0 0 20px ${accentColor}40` 
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div 
                      className="text-4xl mb-4 p-4 rounded-full relative" 
                      style={{ color: accentColor }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {/* Animated ring around icon */}
                      <motion.div 
                        className="absolute inset-0 rounded-full -z-10"
                        style={{ 
                          border: `1px solid ${accentColor}40`,
                          boxShadow: `inset 0 0 10px ${accentColor}20, 0 0 10px ${accentColor}20`
                        }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {item.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: `${accentColor}40` }} />
                    <p className="text-sm opacity-70">Explore my {item.title.toLowerCase()}</p>
                  </motion.a>
                ))}
              </div>
              
              {/* Additional navigation cards */}
              <div ref={additionalCardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-10 md:mt-12 max-w-2xl mx-auto">
                {[
                  { title: 'Certificates', icon: <FiFileText size={28} />, path: '/#certificates' },
                  { title: 'Hackathons', icon: <FaTrophy size={24} />, path: '/#hackathons' }
                ].map((item, index) => (
                  <motion.a
                    key={item.title}
                    href={item.path}
                    className="glassmorphic-card p-6 flex items-center gap-4 hover-3d"
                    style={{ boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2), 0 0 10px ${accentColor}20` }}
                    initial="hidden"
                    animate={additionalCardsInView ? "visible" : "hidden"}
                    variants={{
                      hidden: { opacity: 0, y: 60, scale: 0.95 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        scale: 1,
                        transition: { 
                          duration: 0.8, 
                          delay: 0.2 + index * 0.15,
                          ease: [0.25, 0.1, 0.25, 1.0]
                        }
                      }
                    }}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: `0 15px 40px rgba(0, 0, 0, 0.3), 0 0 20px ${accentColor}40` 
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div 
                      className="p-3 rounded-full relative" 
                      style={{ 
                        color: accentColor,
                        backgroundColor: `${accentColor}20`,
                        boxShadow: `0 0 10px ${accentColor}30`
                      }}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      {/* Pulse effect */}
                      <motion.div 
                        className="absolute inset-0 rounded-full -z-10"
                        style={{ backgroundColor: `${accentColor}10` }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {item.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm opacity-70">View my {item.title.toLowerCase()}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
    
              {/* Explore Portfolio button with ultra-premium design */}
              <div className="mt-16 relative">
                <motion.div
                  className="absolute -inset-2 rounded-full opacity-60"
                  style={{ 
                    background: `radial-gradient(circle, ${accentColor}80 0%, transparent 70%)`,
                    filter: 'blur(10px)'
                  }}
                  animate={{ 
                    opacity: [0.4, 0.7, 0.4],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
                
                {/* Additional pulsing ring */}
                <motion.div
                  className="absolute -inset-4 rounded-full opacity-30"
                  style={{ 
                    border: `1px solid ${accentColor}70`,
                  }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
                <motion.a
                  href="#contact"
                  className="inline-block px-10 py-4 rounded-full font-medium overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, ${accentColor}90, ${accentColor}70)`,
                    boxShadow: `0 10px 25px rgba(0,0,0,0.2), 0 0 10px ${accentColor}40`
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: `0 15px 30px rgba(0,0,0,0.3), 0 0 15px ${accentColor}60` 
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {/* Animated shine effect */}
                  <motion.div 
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                      transform: 'translateX(-100%)'
                    }}
                    animate={{ x: ['0%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <span className="text-white text-lg font-medium flex items-center gap-2 relative z-10">
                    Get in Touch
                    <motion.span
                      animate={{ y: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <FiArrowDown />
                    </motion.span>
                  </span>
                </motion.a>
              </div>
            </motion.div>
          </div>
          
          {/* About Section */}
          <AboutPage sectionRef={aboutSectionRef} />
          
          {/* Projects Section */}
          <ProjectsPage sectionRef={projectsSectionRef} />
          
          {/* Skills Section */}
          <SkillsPage sectionRef={skillsSectionRef} />
          
          {/* Hackathons Section */}
          <HackathonsPage sectionRef={hackathonsSectionRef} />
          
          {/* Certificates Section */}
          <CertificatesPage sectionRef={certificatesSectionRef} />
          
          {/* Contact Section */}
          <ContactPage sectionRef={contactSectionRef} />
        </div>
      </div>
    </div>
  );
}