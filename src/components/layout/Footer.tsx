import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import Link from 'next/link';

const Footer: React.FC = () => {
  const { theme, accentColor } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-10 ${
      theme === 'dark' ? 'bg-black-900' : 'bg-black-100'
    }`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <motion.div 
              className="text-2xl font-bold mb-4"
              style={{ color: accentColor }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link href="/">
                Portfolio
              </Link>
            </motion.div>
            <p className="opacity-80 mb-4 max-w-md">
              A creative full-stack developer specializing in building exceptional digital experiences 
              with a focus on interactive web applications and AI solutions.
            </p>
            <div className="flex space-x-4">
              {['GitHub', 'LinkedIn', 'Twitter', 'Instagram'].map((platform) => (
                <motion.a
                  key={platform}
                  href={`https://${platform.toLowerCase()}.com/yourusername`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  {platform}
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Projects', 'Hackathons', 'Skills', 'Certificates', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`#${item.toLowerCase()}`}
                    className="opacity-70 hover:opacity-100 transition-opacity hover:translate-x-1 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center opacity-70">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>hello@yourname.com</span>
              </li>
              <li className="flex items-center opacity-70">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>Silicon Valley, California</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Divider */}
        <div 
          className="h-px my-8 opacity-20"
          style={{ backgroundColor: accentColor }}
        ></div>
        
        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-70">
            © {currentYear} Your Name. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <motion.button
              whileHover={{ y: -3 }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-2 rounded-full ${
                theme === 'dark' ? 'bg-black-800' : 'bg-black-200'
              }`}
              aria-label="Scroll to top"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5"></path>
                <path d="M5 12l7-7 7 7"></path>
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
