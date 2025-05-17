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
            ? 'bg-black-900/80 backdrop-blur-md shadow-lg' 
            : 'bg-white/80 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center navbar-container">
        {/* Logo */}
        <motion.div 
          className="text-xl sm:text-xl md:text-2xl ml-0 sm:-ml-8 md:-ml-16 font-bold flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/" passHref>
            <div 
              className="relative font-medium cursor-pointer flex items-center gap-2"
              style={{ color: accentColor }}
            >
              <div className="mr-2">
                <VoiceNavigatorButton />
              </div>
              <span className="text-xl sm:text-xl md:text-2xl font-bold">Portfolio</span>
              <div 
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link href={item.href} passHref>
                <div className={`relative text-sm font-medium group cursor-pointer flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  <span className="text-lg" style={{ color: accentColor }}>{item.icon}</span>
                  {item.name}
                  <span 
                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Music Player */}
          <MusicPlayer />
          
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hidden md:block rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <FiSun className="text-yellow-300" size={20} />
            ) : (
              <FiMoon className="text-indigo-600" size={20} />
            )}
          </motion.button>
          
          {/* Rocket Toggle Button for Particles */}
          <motion.button
            onClick={toggleCornerParticles}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full border-2 flex items-center justify-center glow"
            style={{ 
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              borderColor: cornerParticlesEnabled ? accentColor : '#888888',
              boxShadow: cornerParticlesEnabled ? `0 0 10px ${accentColor}60` : 'none'
            }}
            aria-label={cornerParticlesEnabled ? "Turn off particles" : "Turn on particles"}
            title={cornerParticlesEnabled ? "Turn off particles" : "Turn on particles"}
          >
            <FaRocket 
              style={{ 
                color: cornerParticlesEnabled ? accentColor : '#888888',
                transform: 'rotate(45deg)'
              }} 
            />
          </motion.button>
          
          {/* Color Picker */}
          <div className="relative">
            <motion.button
              onClick={() => setColorPickerOpen(!colorPickerOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center glow"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderColor: accentColor,
                boxShadow: `0 0 10px ${accentColor}40`
              }}
              aria-label="Change accent color"
            >
              <motion.div
                animate={{ rotate: colorPickerOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiSettings style={{ color: accentColor }} />
              </motion.div>
            </motion.button>

            {/* Color Picker Dropdown */}
            <AnimatePresence>
              {colorPickerOpen && (
                <motion.div 
                  ref={colorPickerRef}
                  className={`absolute right-0 mt-2 p-4 rounded-lg shadow-xl z-50 glassmorphic-card ${theme === 'dark' ? 'bg-black-800/90' : 'bg-white/90'}`}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4">
                    <HexColorPicker color={accentColor} onChange={setAccentColor} />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    <p className="text-xs w-full text-center mb-1">{theme === 'light' ? 'Choose a color' : 'Choose a color'}</p>
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

          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden p-2 rounded-full"
            style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <FiX size={20} style={{ color: accentColor}} /> : <FiMenu size={20} style={{ color: accentColor}} />}
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={`md:hidden overflow-hidden ${theme === 'dark' ? 'bg-black-900/95' : 'bg-white-900/95'} backdrop-blur-md`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4 items-center" style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link href={item.href} passHref>
                      <div 
                        className="flex items-center justify-center gap-3 p-2 rounded-lg hover:bg-black-100 dark:hover:bg-black-800 transition-colors w-full"
                        style={{ color: theme === 'dark' ? 'white' : 'black' }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="text-xl" style={{ color: accentColor }}>{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Voice navigation is now fully integrated in the button */}
    </motion.header>
  );
};

export default Navbar;
