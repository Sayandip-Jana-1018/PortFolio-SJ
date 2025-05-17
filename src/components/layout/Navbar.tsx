import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useParticles } from '../../context/ParticlesContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { HexColorPicker } from 'react-colorful';
import { FiHome, FiUser, FiCode, FiAward, FiFileText, FiMail, FiMenu, FiX, FiSun, FiMoon, FiSettings, FiBookOpen, FiMic } from 'react-icons/fi';
import MusicPlayer from '../common/MusicPlayer';
import dynamic from 'next/dynamic';
import { FaMedal } from 'react-icons/fa';
import { FaRocket } from 'react-icons/fa';

// Import the VoiceNavigator component directly
import VoiceNavigator from '../common/VoiceNavigator';

// Create a functional VoiceNavigatorButton component
const VoiceNavigatorButton = () => {
  // Handle navigation to sections
  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="relative">
      <VoiceNavigator onNavigate={handleNavigate} />
    </div>
  );
};

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
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme();
  const { cornerParticlesEnabled, toggleCornerParticles } = useParticles();
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDebugger, setShowDebugger] = useState(true); // Start with debugger visible
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Predefined color options
  const colorOptions = [
    '#FF0000', // Vivid Red
    '#D30FFF', // Vivid Purple
    '#39FF00', // Vivid Green
    '#00FFE7', // Vivid Cyan
    '#FFE000', // Vivid Yellow
];

  // Handle scroll events to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      // Add background when scrolled
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
  
  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setColorPickerOpen(false);
      }
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? theme === 'dark' 
            ? 'bg-black/90 backdrop-blur-md shadow-lg' 
            : 'bg-white/90 backdrop-blur-md shadow-lg'
          : theme === 'dark' ? 'bg-black/50 backdrop-blur-sm' : 'bg-white/50 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      style={{ borderBottom: `1px solid ${accentColor}30` }}
    >
      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        .navbar-container {
          max-width: 100%;
          overflow-x: hidden;
        }
      `}</style>
      <div className="container mx-auto px-1 sm:px-2 md:px-4 py-2 flex justify-between items-center navbar-container">
        {/* Logo with functional voice navigation - Optimized for fold phone */}
        <motion.div 
          className="flex items-center shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center">
            {/* Voice navigation microphone button */}
            <motion.div 
              className="mr-2 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: `${accentColor}20`,
                  border: `1px solid ${accentColor}50`,
                  boxShadow: `0 0 5px ${accentColor}30`
                }}
                onClick={() => {
                  // Trigger voice navigation manually
                  const voiceNavigator = document.querySelector('.voice-navigator-button');
                  if (voiceNavigator) {
                    (voiceNavigator as HTMLElement).click();
                  }
                }}
              >
                <FiMic size={18} style={{ color: accentColor }} />
              </div>
              <div className="hidden">
                <VoiceNavigator 
                  onNavigate={(sectionId) => {
                    const element = document.getElementById(sectionId);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                />
              </div>
            </motion.div>
            
            <Link href="/" passHref>
              <div 
                className="relative font-medium cursor-pointer flex items-center gap-1"
                style={{ color: accentColor }}
              >
                <span className="text-base sm:text-lg md:text-xl font-bold">Portfolio</span>
                <div 
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Desktop Navigation - Responsive for fold phones - Icons only on tablet/fold */}
        <nav className="hidden md:flex items-center space-x-3 lg:space-x-6 overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="shrink-0"
            >
              <Link href={item.href} passHref>
                <div className={`relative text-xs lg:text-sm font-medium group cursor-pointer flex items-center gap-1 lg:gap-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${accentColor}15`,
                      border: `1px solid ${accentColor}30`
                    }}
                  >
                    <span className="text-xl" style={{ color: accentColor }}>{item.icon}</span>
                  </div>
                  <span className="hidden lg:inline">{item.name}</span>
                  <span 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
          {/* Music Player - Hidden on small screens */}
          <div className="hidden sm:block">
            <MusicPlayer />
          </div>
          
          {/* Control buttons group - Optimized for fold phones */}
          <div className="flex space-x-2 items-center">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center"
              style={{ 
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                border: `1px solid ${accentColor}30`
              }}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <FiSun style={{ color: accentColor }} size={18} />
              ) : (
                <FiMoon style={{ color: accentColor }} size={18} />
              )}
            </motion.button>
            
            {/* Rocket Toggle Button for Particles */}
            <motion.button
              onClick={toggleCornerParticles}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center"
              style={{ 
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${accentColor}${cornerParticlesEnabled ? '80' : '30'}`,
                boxShadow: cornerParticlesEnabled ? `0 0 8px ${accentColor}40` : 'none'
              }}
              aria-label={cornerParticlesEnabled ? "Turn off particles" : "Turn on particles"}
              title={cornerParticlesEnabled ? "Turn off particles" : "Turn on particles"}
            >
              <FaRocket 
                size={16}
                style={{ 
                  color: cornerParticlesEnabled ? accentColor : '#888888',
                  transform: 'rotate(45deg)'
                }} 
              />
            </motion.button>
            
            {/* Color Picker - Fixed positioning */}
            <div className="relative" style={{ zIndex: 60 }}>
              <motion.button
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center"
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

              {/* Color Picker Dropdown - Fixed positioning */}
              <AnimatePresence>
                {colorPickerOpen && (
                  <motion.div 
                    ref={colorPickerRef}
                    className="fixed p-4 rounded-lg shadow-xl z-[100]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      backdropFilter: 'blur(10px)',
                      backgroundColor: theme === 'dark' ? 'rgba(10, 10, 15, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                      boxShadow: `0 10px 25px rgba(0,0,0,0.2), 0 0 10px ${accentColor}20`,
                      border: `1px solid ${accentColor}30`,
                      width: '220px',
                      top: '60px',
                      right: '10px'
                    }}
                  >
                    <div className="mb-4">
                      <HexColorPicker color={accentColor} onChange={setAccentColor} />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      <p className="text-xs w-full text-center mb-1" style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                        Choose a color
                      </p>
                      {colorOptions.map((color) => (
                        <motion.button
                          key={color}
                          className="w-8 h-8 rounded-full border-2"
                          style={{ 
                            backgroundColor: color,
                            borderColor: color === accentColor ? 'white' : 'transparent',
                            boxShadow: color === accentColor ? `0 0 10px ${color}` : 'none'
                          }}
                          onClick={() => {
                            setAccentColor(color);
                            setColorPickerOpen(false);
                          }}
                          whileHover={{ scale: 1.2, boxShadow: `0 0 15px ${color}` }}
                          whileTap={{ scale: 0.9 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile menu button - Optimized for fold phone */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center ml-1"
              style={{ 
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: mobileMenuOpen ? `${accentColor}20` : theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${mobileMenuOpen ? accentColor : `${accentColor}30`}`,
                boxShadow: mobileMenuOpen ? `0 0 10px ${accentColor}40` : 'none'
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
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className={`md:hidden fixed top-[60px] left-0 right-0 overflow-hidden z-50`}
            style={{ 
              backgroundColor: theme === 'dark' ? 'rgba(10, 10, 15, 0.7)' : 'rgba(255, 255, 255, 0.7)',
              boxShadow: `0 10px 25px rgba(0,0,0,0.2), 0 0 10px ${accentColor}20`,
              borderBottom: `1px solid ${accentColor}30`,
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'
            }}
          >
            <div className="container mx-auto px-2 sm:px-4 py-3">
              {/* Grid layout for mobile menu - 3 cols on very small screens, 4 cols on larger mobile/tablet */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 py-3">
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href} passHref>
                    <motion.div 
                      className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200"
                      style={{ 
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        border: `1px solid ${accentColor}30`,
                        boxShadow: `0 4px 6px rgba(0,0,0,0.1), 0 0 2px ${accentColor}30 inset`
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                      whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                        boxShadow: `0 6px 8px rgba(0,0,0,0.15), 0 0 4px ${accentColor}40 inset`
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-lg mb-1" style={{ color: accentColor }}>{item.icon}</span>
                      <span className="text-[10px] font-medium text-center" style={{ 
                        color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)' 
                      }}>
                        {item.name}
                      </span>
                    </motion.div>
                  </Link>
                ))}
                
                {/* Close button - Added after the navigation items */}
                <motion.div 
                  className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200"
                  style={{ 
                    backgroundColor: `${accentColor}20`,
                    border: `1px solid ${accentColor}40`,
                    boxShadow: `0 4px 6px rgba(0,0,0,0.1), 0 0 2px ${accentColor}30 inset`
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: `${accentColor}30`,
                    boxShadow: `0 6px 8px rgba(0,0,0,0.15), 0 0 4px ${accentColor}40 inset`
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg mb-1" style={{ color: accentColor }}>
                    <FiX />
                  </span>
                  <span className="text-[10px] font-medium text-center" style={{ 
                    color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)' 
                  }}>
                    Close
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Voice navigation is now fully integrated in the button */}
    </motion.header>
  );
};

export default Navbar;
