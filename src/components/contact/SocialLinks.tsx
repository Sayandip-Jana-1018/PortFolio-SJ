import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiCodepen, FiYoutube, FiDribbble, FiBriefcase } from 'react-icons/fi';
import { FaDiscord, FaMedium, FaStackOverflow } from 'react-icons/fa';

interface SocialLinksProps {
  accentColor: string;
  theme: string;
}

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
  color: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ accentColor, theme }) => {
  const socialLinks: SocialLink[] = [
    { 
      name: 'Email', 
      icon: <FiMail size={24} />, 
      url: 'mailto:sayandip.jana24@gmail.com',
      color: accentColor
    },
    { 
      name: 'GitHub', 
      icon: <FiGithub size={24} />, 
      url: 'https://github.com/Sayandip-Jana-1018',
      color: accentColor
    },
    { 
      name: 'LinkedIn', 
      icon: <FiLinkedin size={24} />, 
      url: 'https://www.linkedin.com/in/jsayandip2003/',
      color: accentColor
    },
    { 
      name: 'Twitter', 
      icon: <FiTwitter size={24} />, 
      url: 'https://x.com/51Sayandip',
      color: accentColor
    },
    { 
      name: 'Instagram', 
      icon: <FiInstagram size={24} />, 
      url: 'https://www.instagram.com/lostsoulfm2003/?hl=en',
      color: accentColor
    },
    { 
      name: 'Portfolio', 
      icon: <FiBriefcase size={24} />, 
      url: 'https://sayandipjana.vercel.app',
      color: accentColor
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="h-full flex flex-col items-center">
      <h3 className="text-3xl font-black mb-8 text-center tracking-wide" style={{ color: theme === 'dark' ? '#fff' : '#111', textShadow: theme === 'dark' ? `0 0 15px ${accentColor}60` : `0 2px 10px ${accentColor}30` }}>Socials</h3>
      
      <div className="w-full max-w-md mx-auto">
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 overflow-hidden group"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                border: `1px solid ${accentColor}20`
              }}
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                borderColor: `${link.color}50`,
                boxShadow: `0 15px 35px -10px ${link.color}50`
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Radial gradient hover background */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                style={{ background: `radial-gradient(circle at 50% 50%, ${link.color}15, transparent 70%)` }} 
              />
              
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300 relative z-10 border group-hover:scale-110"
                style={{ 
                  backgroundColor: `${link.color}10`,
                  borderColor: `${link.color}30`,
                  color: link.color,
                  boxShadow: `0 0 15px ${link.color}20 inset`
                }}
              >
                {link.icon}
              </div>
              <span className="text-sm font-bold tracking-wide relative z-10 opacity-90 group-hover:opacity-100 transition-opacity">{link.name}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-auto p-4 rounded-lg text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-sm opacity-70">
          Let's connect and discuss how we can work together to bring your ideas to life!
        </p>
      </motion.div>
    </div>
  );
};

export default SocialLinks;
