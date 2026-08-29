import Navbar from "../components/layout/Navbar";
import { useTheme } from "../context/ThemeContext";
import { useParticles } from "../context/ParticlesContext";
import Head from "next/head";
import { useEffect, useRef, useState, memo, useCallback } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import dynamic from "next/dynamic";

// Performance: Dynamic imports for heavy components
const MoltenMetal = dynamic(() => import("../components/common/MoltenMetal"), { ssr: false });
// Only fetched once the reader actually picks the scroll backdrop, so the
// 13MB frame set costs nothing to anyone who stays on the shader.
const ScrollFrames = dynamic(() => import("../components/common/ScrollFrames"), { ssr: false });
const CanvasRevealEffect = dynamic(() => import("../components/common/CanvasRevealEffect"), { ssr: false });

import { FiAward, FiCode, FiUser, FiFileText, FiArrowDown, FiArrowRight } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import GlassmorphicProfile from "../components/home/GlassmorphicProfile";
import AnimatedText from "../components/home/AnimatedText";
import CustomCursor from "../components/common/CustomCursor";
import ClickEffect from "../components/common/ClickEffect";
import ScrollProgress from "../components/common/ScrollProgress";
import SectionTransition from "../components/common/SectionTransition";
import MaskedHeading from "../components/common/MaskedHeading";
import TouchRipple from "../components/common/TouchRipple";
import GlowCard from "../components/common/GlowCard";

// Performance: Memoize heavy section components
import AboutPageBase from "../components/sections/AboutPage";
import ProjectsPageBase from "../components/sections/ProjectsPage";
import SkillsPageBase from "../components/sections/SkillsPage";
import HackathonsPageBase from "../components/sections/HackathonsPage";
import CertificatesPageBase from "../components/sections/CertificatesPage";
import ContactPageBase from "../components/sections/ContactPage";
import EducationPageBase from "../components/sections/EducationPage";

const AboutPage = memo(AboutPageBase);
const ProjectsPage = memo(ProjectsPageBase);
const SkillsPage = memo(SkillsPageBase);
const HackathonsPage = memo(HackathonsPageBase);
const CertificatesPage = memo(CertificatesPageBase);
const ContactPage = memo(ContactPageBase);
const EducationPage = memo(EducationPageBase);



// Throttle utility for scroll performance
const throttle = <T extends (...args: any[]) => void>(fn: T, wait: number): T => {
  let lastTime = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn(...args);
    }
  }) as T;
};

// Theme-aware MoltenMetal colors
const getMoltenColors = (accentColor: string, theme: string) => {
  if (theme === 'dark') {
    return {
      color1: accentColor, // Use selected theme color
      color2: accentColor, // Removed pink/violet, use theme color for base
      color3: '#ffffff', // Pure white for caustic streaks
      brightness: 1.3,
      blackPoint: 0.05,
      opacity: 1.0,
      scale: 4,
      glow: 1.6,
    };
  }
  // Light mode -> "Aurora" style
  return {
    color1: accentColor,
    color2: '#000000', // Changed to black based on user feedback
    color3: '#000000', // Changed to black for dark streaks
    brightness: 1.1, 
    blackPoint: 0.02,
    opacity: 0.9,
    scale: 3.5,
    glow: 1.3,
  };
};

export default function Home() {
  const { theme, accentColor, backgroundMode } = useTheme();
  const { cornerParticlesEnabled, toggleCornerParticles } = useParticles();
  const [isClient, setIsClient] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const wallpaperSectionRef = useRef<HTMLDivElement>(null);

  // Refs for scroll-triggered animations
  const welcomeTitleRef = useRef<HTMLDivElement>(null);
  const welcomeTextRef = useRef<HTMLDivElement>(null);
  const cardGridRef = useRef<HTMLDivElement>(null);
  const additionalCardsRef = useRef<HTMLDivElement>(null);

  const welcomeTitleInView = useInView(welcomeTitleRef, { once: false, amount: 0.5 });
  const welcomeTextInView = useInView(welcomeTextRef, { once: false, amount: 0.4 });
  const cardGridInView = useInView(cardGridRef, { once: false, amount: 0.3 });
  const additionalCardsInView = useInView(additionalCardsRef, { once: false, amount: 0.2 });

  // Scroll progress
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ['start start', 'end end']
  });

  const scrollProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const isScrollBg = backgroundMode === 'scroll';



  // Client-side initialization
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Section refs
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const projectsSectionRef = useRef<HTMLDivElement>(null);
  const skillsSectionRef = useRef<HTMLDivElement>(null);
  const educationSectionRef = useRef<HTMLDivElement>(null);
  const hackathonsSectionRef = useRef<HTMLDivElement>(null);
  const certificatesSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);

  // Scroll to section function
  const scrollToSection = useCallback((sectionRef: React.RefObject<HTMLDivElement | null>) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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
    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
    return () => window.removeEventListener('hashchange', handleNavigation);
  }, [scrollToSection]);

  // Get theme-aware molten metal colors
  const moltenColors = getMoltenColors(accentColor, theme);

  // Beautiful smooth 3D text shadow for depth and pop effect on Welcome heading
  const welcomeTextShadow3D = `
    1px 1px 1px rgba(0,0,0,0.9),
    2px 2px 2px rgba(0,0,0,0.8),
    3px 3px 2px rgba(0,0,0,0.7),
    4px 4px 3px rgba(0,0,0,0.6),
    5px 5px 3px rgba(0,0,0,0.5),
    6px 6px 4px rgba(0,0,0,0.4),
    8px 8px 15px rgba(0,0,0,0.9),
    12px 12px 35px rgba(0,0,0,0.7),
    0 0 40px ${accentColor}a0,
    0 0 80px ${accentColor}60
  `;

  // Fade-in animation variant
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 80, scale: 0.95 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };

  return (
    <div className="font-sans antialiased">
      <Head>
        <title>Portfolio | Sayandip Jana</title>
        <meta name="description" content="Personal portfolio showcasing my projects, skills, and achievements" />
        <meta property="og:title" content="Sayandip Jana | Portfolio" />
        <meta property="og:description" content="Explore the work of Sayandip Jana - Data Science Enthusiast, ML Developer, Innovator" />
        <meta property="og:image" content="/images/profile_photo.jpg" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <div className="relative overflow-x-hidden">
        <Navbar />

        {isClient && (
          <>
            <CustomCursor />
            <ClickEffect />
            <TouchRipple />

            {/* Global background — Theme-driven, no cursor interaction.
                Two backdrops, one slot: the generative shader, or the film
                scrubbed by scroll. Only one is mounted at a time so the other
                is neither drawing nor holding decoded frames in memory. */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              {isScrollBg ? (
                <ScrollFrames
                  theme={theme}
                  accentColor={accentColor}
                  handoffRef={contactSectionRef}
                  tailSrc="/bg-frames/tail.webp"
                />
              ) : (
                <MoltenMetal
                  color1={moltenColors.color1}
                  color2={moltenColors.color2}
                  color3={moltenColors.color3}
                  speed={0.35}
                  scale={moltenColors.scale || 4}
                  detail={3}
                  glow={moltenColors.glow || 1.6}
                  coreSize={0.1}
                  swirl={1}
                  fold={-0.2}
                  blackPoint={moltenColors.blackPoint}
                  brightness={moltenColors.brightness}
                  colorMode={theme === 'dark' ? 'molten' : 'frost'}
                  grain={true}
                  grainIntensity={0.03}
                  mouseInteraction={false}
                  mouseStrength={0}
                  opacity={moltenColors.opacity}
                />
              )}
            </div>

            {/* Corner Particles Overlay */}
            <CanvasRevealEffect
              cornerParticles={cornerParticlesEnabled}
              onToggleCornerParticles={toggleCornerParticles}
              containerClassName="fixed inset-0 pointer-events-none z-20"
              active={true}
            />
          </>
        )}

        {/* Scroll progress indicator */}
        <ScrollProgress />
        <SectionTransition />

        {/* Main content */}
        <div
          ref={mainRef}
          className={`main-content ${theme === 'dark' ? 'text-white' : 'text-black'}`}
          style={{ position: 'relative', background: 'transparent' }}
        >
          {/* ═══════════════════ HERO SECTION ═══════════════════ */}
          <div className="h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 section-container text-white">
            {/* Glassmorphic frosted overlay for readability without hiding the background completely */}
            <div className="absolute inset-0 z-[1]" style={{
              background: theme === 'dark'
                ? `radial-gradient(ellipse at 50% 30%, ${accentColor}08, rgba(0,0,0,0.4) 70%)`
                : `radial-gradient(ellipse at 50% 30%, ${accentColor}05, rgba(255,255,255,0.2) 70%)`,
            }} />

            {/* Decorative corner elements */}
            <div
              className="absolute top-[10%] left-[10%] w-24 h-24 opacity-15 z-[2]"
              style={{
                borderWidth: '1px 0 0 1px', borderStyle: 'solid', borderColor: accentColor,
                borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
              }}
            />
            <div
              className="absolute bottom-[10%] right-[10%] w-20 h-20 opacity-15 z-[2]"
              style={{
                borderWidth: '0 1px 1px 0', borderStyle: 'solid', borderColor: accentColor,
                borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%'
              }}
            />

            {/* Animated text with parallax.
                On the scroll backdrop the film already shows a face, so the
                circular portrait below is dropped and the name takes the centre
                of the frame instead. It then travels on its own depth plane —
                rising and pushing in faster than the footage behind it — so the
                figure in the plate reads as standing in front of the type
                rather than behind a caption. The mask feathers the name's lower
                edge into the plate, which is what sells the occlusion. */}
            {isScrollBg ? (
              // Dropped down to sit across the collar rather than over the face.
              // The outer div does the static placement, the inner one does the
              // scroll travel, so the two never fight over `transform`.
              //
              // There is NO mask here any more. Masking the type was an attempt
              // to fake occlusion and it just sliced the letters in half — a
              // single video frame carries no matte, so nothing can cut the name
              // around a silhouette. Depth comes from the name travelling on its
              // own plane instead: it rises and pushes in faster than the plate
              // behind it, which is what parallax actually is.
              <div
                className="content-block relative z-[3]"
                style={{ transform: 'translateY(clamp(150px, 21vh, 290px))' }}
              >
                <AnimatedText scrollProgress={scrollProgress} variant="film" />
              </div>
            ) : (
              <div className="mb-12 content-block relative z-[3]">
                <AnimatedText scrollProgress={scrollProgress} />
              </div>
            )}

            {/* Glassmorphic profile — the film supplies the portrait in scroll mode */}
            {!isScrollBg && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-[3]"
                style={{ transform: 'perspective(1000px) rotateX(5deg)', transformStyle: 'preserve-3d' }}
                whileHover={{ scale: 1.05, rotateX: 0, transition: { duration: 0.3 } }}
              >
                <motion.div
                  className="absolute -inset-3 rounded-full opacity-30"
                  style={{ borderWidth: '1px', borderStyle: 'dashed', borderColor: `${accentColor}80` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                />
                <div style={{ transform: 'scale(1.15)' }}>
                  <GlassmorphicProfile scrollProgress={scrollProgress} />
                </div>
              </motion.div>
            )}

            {/* Scroll indicator and Explore Button */}
            <motion.div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-[20]"
            >
              <motion.a
                href="#explore"
                className="btn-glassmorphic px-6 py-2 mb-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 text-white text-sm"
                style={{ backgroundColor: accentColor, boxShadow: `0 0 15px ${accentColor}60` }}
                whileHover={{ scale: 1.05, boxShadow: `0 10px 25px rgba(0,0,0,0.2), 0 0 20px ${accentColor}90` }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore Portfolio</span>
              </motion.a>
              
              <motion.div
                className="flex flex-col items-center cursor-pointer"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <p className="text-xs uppercase tracking-widest mb-1 opacity-70" style={{
                  color: theme === 'dark' ? '#ffffff' : '#000000', fontWeight: 500
                }}>
                  Scroll to explore
                </p>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-bounce opacity-70"
                  style={{ filter: `drop-shadow(0 0 3px ${accentColor})` }}>
                  <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke={accentColor} strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* ═══════════════════ EXPLORE / WALLPAPER SECTION ═══════════════════ */}
          <div
            ref={wallpaperSectionRef}
            id="explore"
            className="min-h-screen flex items-center justify-center relative section-container"
            style={{ marginTop: '20px' }}
          >
            {/* Video background with WebM */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
              className="absolute inset-0 z-0">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                muted loop playsInline autoPlay
              >
                {/* WebM only. The 8.4MB MP4 fallback existed for browsers that
                    have supported WebM for a decade; it now lives in assets/
                    and no longer ships. */}
                <source src="/media/LiveWallpaper.webm" type="video/webm" />
              </video>
              <div className="absolute inset-0 z-10" style={{
                background: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, ${accentColor}10 60%, rgba(0,0,0,0.7) 100%)`
              }} />
            </motion.div>

            {/* Content */}
            <motion.div className="w-full max-w-4xl mx-auto px-4 text-center z-20 content-block"
              style={{ opacity: 1, y: 0 }}>

              {/* MaskedHeading for Welcome */}
              <div ref={welcomeTitleRef} className="mb-8">
                <MaskedHeading
                  text="Welcome to My Portfolio"
                  tag="h2"
                  mediaType="video"
                  src="/media/LiveWallpaper.webm"
                  fillScale={1.3}
                  parallax={20}
                  reveal="rise"
                  trigger="view"
                  textScale={0.08}
                  lineHeight={1.3}
                  fontSize="clamp(2.5rem, 8vw, 4.5rem)"
                />
              </div>

              <motion.p
                ref={welcomeTextRef}
                className="text-xl mb-8"
                style={{
                  color: '#ffffff',
                  textShadow: theme === 'dark' ? `0 0 15px ${accentColor}80, 0 0 10px rgba(255, 255, 255, 0.5)` : 'none',
                  fontWeight: 500
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Explore my work, skills, and journey through this interactive experience
              </motion.p>

              <div className="mb-8" />

              {/* Navigation GlowCards with glassmorphism */}
              <div ref={cardGridRef} className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {[
                  { title: 'Projects', icon: <FiCode size={32} />, path: '/#projects' },
                  { title: 'Skills', icon: <FiAward size={32} />, path: '/#skills' },
                  { title: 'About Me', icon: <FiUser size={32} />, path: '/#about' }
                ].map((item, index) => (
                  <GlowCard key={item.title} glowColor={accentColor} className="rounded-2xl">
                    <motion.div
                      onClick={() => {
                        const el = document.getElementById(item.path.replace('/#', ''));
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`glass-card glass-shine p-8 flex flex-col items-center cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                      initial="hidden"
                      animate={cardGridInView ? "visible" : "hidden"}
                      variants={{
                        hidden: { opacity: 0, y: 80, scale: 0.95 },
                        visible: {
                          opacity: 1, y: 0, scale: 1,
                          transition: { duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1.0] }
                        }
                      }}
                      whileHover={{ y: -10, boxShadow: `0 15px 40px rgba(0, 0, 0, 0.3), 0 0 20px ${accentColor}40` }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div className="text-4xl mb-4 p-4 rounded-full relative" style={{ color: theme === 'dark' ? '#ffffff' : '#000000', textShadow: `0 0 15px ${accentColor}80` }}
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                        <motion.div className="absolute inset-0 rounded-full -z-10"
                          style={{ border: `1px solid ${accentColor}60`, boxShadow: `inset 0 0 15px ${accentColor}30, 0 0 15px ${accentColor}30` }}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                        {item.icon}
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-2 z-10 relative" style={{ fontFamily: 'var(--font-title)' }}>{item.title}</h3>
                      <div className="w-12 h-1 rounded-full mb-4 z-10 relative" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
                      <p className="text-sm opacity-80 z-10 relative">Explore my {item.title.toLowerCase()}</p>
                    </motion.div>
                  </GlowCard>
                ))}
              </div>

              {/* Additional nav cards */}
              <div ref={additionalCardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-10 md:mt-12 max-w-2xl mx-auto">
                {[
                  { title: 'Certificates', icon: <FiFileText size={28} />, path: '/#certificates' },
                  { title: 'Hackathons', icon: <FaTrophy size={24} />, path: '/#hackathons' }
                ].map((item, index) => (
                  <GlowCard key={item.title} glowColor={accentColor} className="rounded-2xl">
                    <motion.div
                      onClick={() => {
                        const el = document.getElementById(item.path.replace('/#', ''));
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`glass-card glass-shine p-6 flex items-center justify-between cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                      initial="hidden"
                      animate={additionalCardsInView ? "visible" : "hidden"}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.5 + (index * 0.1) } }
                      }}
                      whileHover={{ scale: 1.03, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white glass-thin"
                          style={{ boxShadow: `0 0 10px ${accentColor}30` }}>
                          <div className="text-3xl relative z-10" style={{ color: theme === 'dark' ? '#ffffff' : '#000000', textShadow: `0 0 10px ${accentColor}80` }}>{item.icon}</div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold z-10 relative" style={{ fontFamily: 'var(--font-title)' }}>{item.title}</h3>
                          <p className="text-sm opacity-80 z-10 relative">View my {item.title.toLowerCase()}</p>
                        </div>
                      </div>
                      <FiArrowRight className="text-xl opacity-70 transition-transform group-hover:translate-x-2 z-10 relative" style={{ color: accentColor }} />
                    </motion.div>
                  </GlowCard>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-16 relative">
                <motion.div className="absolute -inset-2 rounded-full opacity-60"
                  style={{ background: `radial-gradient(circle, ${accentColor}80 0%, transparent 70%)`, filter: 'blur(10px)' }}
                  animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                <motion.div className="absolute -inset-4 rounded-full opacity-30"
                  style={{ border: `1px solid ${accentColor}70` }}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                <motion.a
                  href="#contact"
                  className="inline-block px-10 py-4 rounded-full font-medium overflow-hidden glass-btn"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}90, ${accentColor}70)`,
                    boxShadow: `0 10px 25px rgba(0,0,0,0.2), 0 0 10px ${accentColor}40`
                  }}
                  whileHover={{ scale: 1.05, boxShadow: `0 15px 30px rgba(0,0,0,0.3), 0 0 15px ${accentColor}60` }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.div className="absolute inset-0 w-full h-full"
                    style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`, transform: 'translateX(-100%)' }}
                    animate={{ x: ['0%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }} />
                  <span className="text-white text-lg font-medium flex items-center gap-2 relative z-10">
                    Get in Touch
                    <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <FiArrowDown />
                    </motion.span>
                  </span>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* ═══════════════════ SECTION PAGES ═══════════════════ */}

          {/* About Section */}
          <AboutPage sectionRef={aboutSectionRef} />

          {/* Projects Section */}
          <ProjectsPage sectionRef={projectsSectionRef} />

          {/* Skills Section */}
          <SkillsPage sectionRef={skillsSectionRef} />

          {/* Education Section */}
          <EducationPage sectionRef={educationSectionRef} />

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