import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useParticles } from '../../context/ParticlesContext';
import { motion, AnimatePresence } from 'framer-motion';
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
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .navbar-container {
          max-width: 100%;
          overflow-x: hidden;
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
      `}</style>
      <div className="container mx-auto px-1 sm:px-2 md:px-4 py-2 flex justify-between items-center navbar-container">
        {/* Logo */}
        <motion.div 
          className="flex items-center shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
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
        </motion.div>

        {/* Desktop Navigation */}
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

        {/* Control Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
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
            <div className="md:hidden">
              <MusicPlayer/>
            </div>
            <div className="relative" style={{ zIndex: 60 }}>
              <motion.button
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center md:flex hidden"
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
              <motion.button
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center md:hidden flex"
                style={{ 
                  width: '32px',
                  height: '32px',
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
                  <FiSettings style={{ color: accentColor }} size={14} />
                </motion.div>
              </motion.button>
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
                  onClick={() => {}}
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
    </motion.header>
  );
};

export default Navbar;
