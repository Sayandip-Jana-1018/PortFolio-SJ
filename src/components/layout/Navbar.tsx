import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme, PREMIUM_ACCENTS } from '../../context/ThemeContext';
import { useParticles } from '../../context/ParticlesContext';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { HexColorPicker } from 'react-colorful';
import { FiHome, FiUser, FiCode, FiAward, FiFileText, FiMail, FiMenu, FiX, FiSun, FiMoon, FiSettings, FiBookOpen } from 'react-icons/fi';
import MusicPlayer from '../common/MusicPlayer';
import dynamic from 'next/dynamic';
import { FaMedal } from 'react-icons/fa';
import { FaRocket } from 'react-icons/fa';

const navItems = [
  { name: 'Home', href: '/#', icon: <FiHome /> },
  { name: 'About', href: '/#about', icon: <FiUser /> },
  { name: 'Projects', href: '/#projects', icon: <FiCode /> },
  { name: 'Skills', href: '/#skills', icon: <FiAward /> },
  { name: 'Education', href: '/#education', icon: <FiBookOpen /> },
  { name: 'Hackathons', href: '/#hackathons', icon: <FaMedal /> },
  { name: 'Certificates', href: '/#certificates', icon: <FiFileText /> },
  { name: 'Contact', href: '/#contact', icon: <FiMail /> },
];

const Navbar: React.FC = () => {
  const { theme, toggleTheme, accentColor, setAccentColor, backgroundMode, setBackgroundMode } = useTheme();
  const { cornerParticlesEnabled, toggleCornerParticles } = useParticles();
  const [scrolled, setScrolled] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showDebugger, setShowDebugger] = useState(true); // Start with debugger visible
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLDivElement>(null);

  // Predefined color options
  const colorOptions = [
    '#FF0000', // Vivid Red
    '#D30FFF', // Vivid Purple
    '#39FF00', // Vivid Green
    '#FFE000', // Vivid Yellow
  ];

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Only update React state when we cross the 50px threshold
    const isScrolled = latest > 50;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  });

  // Close mobile menu when changing routes
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close color picker when clicking outside (exclude button clicks)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Don't close if clicking the settings button or inside the color picker
      if (
        (colorPickerRef.current && colorPickerRef.current.contains(target)) ||
        (settingsButtonRef.current && settingsButtonRef.current.contains(target))
      ) {
        return;
      }
      setColorPickerOpen(false);
    };

    // Close color picker on scroll
    const handleScroll = () => {
      if (colorPickerOpen) {
        setColorPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [colorPickerOpen]);

  return (
    <motion.header
      className={`fixed left-0 right-0 z-50 mx-auto w-full transition-all duration-300 ${scrolled
        ? theme === 'dark'
          ? 'bg-black/60 backdrop-blur-xl shadow-2xl shadow-black/50 top-0'
          : 'bg-white/70 backdrop-blur-xl shadow-xl shadow-black/5 top-0'
        : theme === 'dark' ? 'bg-black/10 backdrop-blur-sm top-0' : 'bg-white/30 backdrop-blur-sm top-0'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        y: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }}
      style={{ 
        borderBottom: scrolled ? `1px solid ${accentColor}30` : `1px solid ${accentColor}20`
      }}
    >
      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .navbar-container {
          max-width: 100%;
          overflow-x: visible;
        }
        .mobile-menu {
          background: ${theme === 'dark' ? 'rgba(25, 25, 35, 0.1)' : 'rgba(245, 245, 250, 0.1)'} !important;
          -webkit-backdrop-filter: blur(12px) saturate(120%) !important;
          backdrop-filter: blur(12px) saturate(120%) !important;
          box-shadow: 0 8px 32px 0 ${theme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)'} !important;
          border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'} !important;
          color: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)'} !important;
          position: relative;
          z-index: 1000;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          will-change: transform, backdrop-filter, -webkit-backdrop-filter;
        }
        /* Custom Color Picker Styles */
        .react-colorful { width: 100% !important; height: 160px !important; }
        @media (min-width: 768px) {
          .react-colorful { height: 180px !important; }
        }
        .react-colorful__saturation { border-radius: 16px 16px 0 0 !important; }
        .react-colorful__hue { height: 14px !important; border-radius: 0 0 16px 16px !important; margin-top: -1px !important; }
        .react-colorful__last-control { border-radius: 0 0 16px 16px !important; }
        .react-colorful__pointer { width: 18px !important; height: 18px !important; border-width: 2px !important; }
      `}</style>
      <div className={`px-4 sm:px-6 navbar-container w-full h-full flex items-center justify-between gap-4 md:gap-8 transition-all duration-300 ${scrolled ? 'py-2.5 sm:py-3' : 'py-3 sm:py-4'}`}>
        {/* Logo */}
        <motion.div
          className="flex items-center shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/" passHref>
            <div
              className="relative font-medium cursor-pointer flex items-center gap-1.5"
              style={{ color: accentColor }}
            >
              <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tight" style={{ textShadow: `0 2px 10px ${accentColor}40` }}>Portfolio</span>
              <div
                className="h-2 w-2 rounded-full animate-pulse shadow-lg"
                style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
              />
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center overflow-x-auto no-scrollbar gap-2 lg:gap-4">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              layout
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0"
            >
              <Link href={item.href} passHref>
                <motion.div 
                  layout
                  className={`relative rounded-full text-xs lg:text-sm font-medium group cursor-pointer flex items-center transition-colors duration-300 ${scrolled ? 'px-1.5 py-1.5' : 'px-3 py-2'} ${theme === 'dark' ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-black/60 hover:text-black hover:bg-black/5'}`}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                      boxShadow: `inset 0 0 0 1px ${accentColor}30`
                    }}
                  >
                    <span className="text-sm">{item.icon}</span>
                  </div>
                  <span 
                    className="hidden lg:block tracking-wide overflow-hidden whitespace-nowrap min-w-0 ml-2.5 opacity-90 group-hover:opacity-100 transition-opacity"
                  >
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Control Buttons */}
        <div className="flex items-center shrink-0 gap-3 sm:gap-4 md:gap-5">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden md:block">
              <MusicPlayer />
            </div>
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center justify-center"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                border: `1px solid ${accentColor}30`
              }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun style={{ color: accentColor }} size={18} />
              ) : (
                <FiMoon style={{ color: accentColor }} size={18} />
              )}
            </motion.button>
            <motion.button
              onClick={toggleCornerParticles}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center justify-center"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${accentColor}${cornerParticlesEnabled ? '80' : '30'}`,
                boxShadow: cornerParticlesEnabled ? `0 0 8px ${accentColor}40` : 'none'
              }}
              aria-label={cornerParticlesEnabled ? "Turn off particles" : "Turn on particles"}
            >
              <FaRocket
                size={16}
                style={{
                  color: cornerParticlesEnabled ? accentColor : '#888888',
                  transform: 'rotate(45deg)'
                }}
              />
            </motion.button>
            {/* Mobile: Hidden Music Player, Settings toggles panel, Menu toggles menu */}
            <div className="hidden">
              <MusicPlayer />
            </div>
            <div ref={settingsButtonRef} className="relative z-50">
              {/* Desktop Gear */}
              <motion.button
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center justify-center"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: colorPickerOpen
                    ? `${accentColor}20`
                    : theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${colorPickerOpen ? accentColor : `${accentColor}50`}`,
                  boxShadow: colorPickerOpen ? `0 0 8px ${accentColor}40` : `0 0 8px ${accentColor}30`
                }}
                aria-label="Change accent color"
              >
                <motion.div
                  animate={{ rotate: colorPickerOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiSettings style={{ color: accentColor }} size={16} />
                </motion.div>
              </motion.button>

              {/* Mobile Gear - Increased size/spacing */}
              <motion.button
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex md:hidden items-center justify-center"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: colorPickerOpen
                    ? `${accentColor}20`
                    : theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${colorPickerOpen ? accentColor : `${accentColor}50`}`,
                  boxShadow: colorPickerOpen ? `0 0 8px ${accentColor}40` : `0 0 8px ${accentColor}30`
                }}
                aria-label="Change accent color"
              >
                <motion.div
                  animate={{ rotate: colorPickerOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiSettings style={{ color: accentColor }} size={16} />
                </motion.div>
              </motion.button>
            </div>
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center ml-1"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: mobileMenuOpen ? `${accentColor}20` : theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${mobileMenuOpen ? accentColor : `${accentColor}30`}`,
                boxShadow: mobileMenuOpen ? `0 0 10px ${accentColor}40` : 'none',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? (
                <FiX size={18} style={{ color: accentColor }} />
              ) : (
                <FiMenu size={18} style={{ color: accentColor }} />
              )}
            </motion.button>
          </div>

        </div>
      </div>

      {/* Mobile menu with glassmorphic design */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 top-0 pt-[60px] z-[1000] mobile-menu"
            style={{
              background: 'transparent',
              pointerEvents: 'auto',
              height: '35vh'
            }}
          >
            <div className="absolute inset-0 overflow-y-auto">
              <div className="container mx-auto px-2 sm:px-4 py-3 relative" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 py-3">
                  {navItems.map((item) => (
                    <Link key={item.name} href={item.href} passHref>
                      <motion.div
                        className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200"
                        style={{
                          backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)',
                          border: `1px solid ${accentColor}30`,
                          boxShadow: `0 4px 6px rgba(0,0,0,0.1), 0 0 2px ${accentColor}30 inset`,
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)'
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.35)',
                          boxShadow: `0 6px 8px rgba(0,0,0,0.15), 0 0 4px ${accentColor}40 inset`
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-base mb-1" style={{ color: accentColor }}>{item.icon}</span>
                        <span className="text-[9px] font-medium text-center" style={{
                          color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'
                        }}>
                          {item.name}
                        </span>
                      </motion.div>
                    </Link>
                  ))}
                  <motion.div
                    className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)',
                      border: `1px solid ${accentColor}30`,
                      boxShadow: `0 4px 6px rgba(0,0,0,0.1), 0 0 2px ${accentColor}30 inset`,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                    onClick={toggleTheme}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.35)',
                      boxShadow: `0 6px 8px rgba(0,0,0,0.15), 0 0 4px ${accentColor}40 inset`
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-base mb-1" style={{ color: accentColor }}>
                      {theme === 'dark' ? <FiSun /> : <FiMoon />}
                    </span>
                    <span className="text-[9px] font-medium text-center" style={{
                      color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'
                    }}>
                      {theme === 'dark' ? 'Light' : 'Dark'}
                    </span>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)',
                      border: `1px solid ${accentColor}30`,
                      boxShadow: `0 4px 6px rgba(0,0,0,0.1), 0 0 2px ${accentColor}30 inset`,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                    onClick={() => { }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.35)',
                      boxShadow: `0 6px 8px rgba(0,0,0,0.15), 0 0 4px ${accentColor}40 inset`
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-base mb-1" style={{ color: accentColor }}>
                      <MusicPlayer small={true} />
                    </div>
                    <span className="text-[9px] font-medium text-center" style={{
                      color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'
                    }}>
                      Music
                    </span>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200"
                    style={{
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)',
                      border: `1px solid ${accentColor}${cornerParticlesEnabled ? '60' : '30'}`,
                      boxShadow: cornerParticlesEnabled ? `0 4px 8px ${accentColor}30, 0 0 4px ${accentColor}30 inset` : `0 4px 6px rgba(0,0,0,0.1), 0 0 2px ${accentColor}30 inset`,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                    onClick={toggleCornerParticles}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.35)',
                      boxShadow: `0 6px 8px rgba(0,0,0,0.15), 0 0 4px ${accentColor}40 inset`
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-base mb-1" style={{ color: cornerParticlesEnabled ? accentColor : '#888888' }}>
                      <FaRocket style={{ transform: 'rotate(45deg)' }} />
                    </span>
                    <span className="text-[9px] font-medium text-center" style={{
                      color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'
                    }}>
                      Particles
                    </span>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200"
                    style={{
                      backgroundColor: `${accentColor}20`,
                      border: `1px solid ${accentColor}40`,
                      boxShadow: `0 4px 6px rgba(0,0,0,0.1), 0 0 2px ${accentColor}30 inset`,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: `${accentColor}30`,
                      boxShadow: `0 6px 8px rgba(0,0,0,0.15), 0 0 4px ${accentColor}40 inset`
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-base mb-1" style={{ color: accentColor }}>
                      <FiX />
                    </span>
                    <span className="text-[9px] font-medium text-center" style={{
                      color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'
                    }}>
                      Close
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Color Picker Modal - Rendered via Portal to ensure it is ALWAYS on top */}
      {mounted && createPortal(
        <AnimatePresence>
          {colorPickerOpen && (
            <>
              {/* Backdrop for explicit click-outside handling */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9990]"
                onClick={() => setColorPickerOpen(false)}
              />

              <motion.div
                ref={colorPickerRef}
                className="fixed z-[9999] w-[240px] md:w-[300px] rounded-3xl" // Slightly smaller mobile width
                initial={{ opacity: 0, scale: 0.9, y: 10 }} // Removed rotateX/perspective to fix rendering artifacts
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{
                  top: '64px',
                  right: '16px', // Standardized spacing
                }}
              >
                <div
                  className="p-4 rounded-3xl relative overflow-hidden"
                  style={{
                    backdropFilter: 'blur(40px) saturate(180%)', // High blur + saturation for "glass"
                    backgroundColor: theme === 'dark' ? 'rgba(30, 30, 35, 0.6)' : 'rgba(255, 255, 255, 0.65)', // More transparent
                    boxShadow: `
                      0 20px 50px -12px rgba(0,0,0,0.5),
                      0 0 0 1px ${theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)'},
                      inset 0 1px 0 0 ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.9)'}
                    `, // "Shiny" top border highlight
                    border: 'none', // Handled by box-shadow
                  }}
                >
                  {/* Shiny Gradient Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                      background: `linear-gradient(135deg, ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)'} 0%, rgba(255,255,255,0) 100%)`
                    }}
                  />

                  {/* Modal Header */}
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200/5 relative z-10" style={{ borderColor: `${accentColor}20` }}>
                    <h3 className="font-bold text-[10px] md:text-xs tracking-wider uppercase flex items-center gap-2" style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
                      <FiSettings className="animate-spin-slow" style={{ color: accentColor }} size={14} />
                      Theme Settings
                    </h3>
                    <button
                      onClick={() => setColorPickerOpen(false)}
                      className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    >
                      <FiX size={14} style={{ color: theme === 'dark' ? '#fff' : '#000' }} />
                    </button>
                  </div>

                  {/* Backdrop switch — a sliding segmented control. The pill is
                      one shared layoutId, so Framer tweens it between the two
                      halves instead of cross-fading two separate pills. */}
                  <div className="mb-4 relative z-10">
                    <div
                      className="relative grid grid-cols-2 rounded-full p-1"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.06)',
                        boxShadow: `inset 0 1px 2px rgba(0,0,0,${theme === 'dark' ? 0.5 : 0.12})`,
                      }}
                    >
                      {(['metal', 'scroll'] as const).map((mode) => {
                        const active = backgroundMode === mode;
                        return (
                          <button
                            key={mode}
                            onClick={() => setBackgroundMode(mode)}
                            aria-pressed={active}
                            className="relative py-2 rounded-full text-[10px] md:text-[11px] font-semibold tracking-[0.14em] uppercase focus:outline-none transition-colors duration-300"
                            style={{
                              color: active
                                ? (theme === 'dark' ? '#fff' : '#fff')
                                : (theme === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)'),
                            }}
                          >
                            {active && (
                              <motion.span
                                layoutId="bg-mode-pill"
                                className="absolute inset-0 rounded-full"
                                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                style={{
                                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`,
                                  boxShadow: `0 4px 14px -4px ${accentColor}cc, inset 0 1px 0 0 rgba(255,255,255,0.35)`,
                                }}
                              />
                            )}
                            <span className="relative z-10">
                              {mode === 'metal' ? 'Metal' : 'Scroll'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Picker with Seamless integration */}
                  <div className="mb-4 flex justify-center relative z-10">
                    <div
                      className="w-full rounded-xl overflow-hidden shadow-lg"
                      style={{
                        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)'}`
                      }}
                    >
                      <HexColorPicker color={accentColor} onChange={setAccentColor} />
                    </div>
                  </div>

                  {/* Premium Presets - Tighter Grid */}
                  <div className="relative z-10">
                    <div className="grid grid-cols-5 gap-2 md:gap-3 justify-items-center">
                      {PREMIUM_ACCENTS.map((color) => (
                        <motion.button
                          key={color.value}
                          onClick={() => setAccentColor(color.value)}
                          whileHover={{ scale: 1.15, rotate: 180 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-full focus:outline-none relative transition-shadow duration-300"
                          style={{
                            backgroundColor: color.value,
                            boxShadow: accentColor === color.value
                              ? `0 0 0 2px ${theme === 'dark' ? '#fff' : '#000'}, 0 0 15px ${color.value}80`
                              : `0 4px 6px rgba(0,0,0,0.1)`
                          }}
                          title={color.name}
                        >
                          {accentColor === color.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center text-white text-[10px]"
                            >
                              ✓
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.header >
  );
};

export default Navbar;
