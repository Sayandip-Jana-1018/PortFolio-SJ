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
      icon: <FiMail size={20} />, 
      url: 'mailto:contact@example.com',
      color: accentColor
    },
    { 
      name: 'GitHub', 
      icon: <FiGithub size={20} />, 
      url: 'https://github.com/yourusername',
      color: accentColor
    },
    { 
      name: 'LinkedIn', 
      icon: <FiLinkedin size={20} />, 
      url: 'https://linkedin.com/in/yourusername',
      color: accentColor
    },
    { 
      name: 'Twitter', 
      icon: <FiTwitter size={20} />, 
      url: 'https://twitter.com/yourusername',
      color: accentColor
    },
    { 
      name: 'Instagram', 
      icon: <FiInstagram size={20} />, 
      url: 'https://instagram.com/yourusername',
      color: accentColor
    },
    { 
      name: 'CodePen', 
      icon: <FiCodepen size={20} />, 
      url: 'https://codepen.io/yourusername',
      color: accentColor
    },
    { 
      name: 'YouTube', 
      icon: <FiYoutube size={20} />, 
      url: 'https://youtube.com/c/yourusername',
      color: accentColor
    },
    { 
      name: 'Dribbble', 
      icon: <FiDribbble size={20} />, 
      url: 'https://dribbble.com/yourusername',
      color: accentColor
    },
    { 
      name: 'Discord', 
      icon: <FaDiscord size={20} />, 
      url: 'https://discord.com/users/yourusername',
      color: accentColor
    },
    { 
      name: 'Medium', 
      icon: <FaMedium size={20} />, 
      url: 'https://medium.com/@yourusername',
      color: accentColor
    },
    { 
      name: 'Stack OF', 
      icon: <FaStackOverflow size={20} />, 
      url: 'https://stackoverflow.com/users/yourusername',
      color: accentColor
    },
    { 
      name: 'Portfolio', 
      icon: <FiBriefcase size={20} />, 
      url: 'https://yourportfolio.com',
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
      <h3 className="text-2xl font-bold mb-6 text-center">Connect With Me</h3>
      
      <div className="w-full max-w-md mx-auto">
        <motion.div 
          className="grid grid-cols-4 gap-2 sm:gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {socialLinks.slice(0, 4).map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${accentColor}20`
              }}
              variants={itemVariants}
              whileHover={{ 
                y: -3, 
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)',
                boxShadow: `0 8px 20px -5px ${link.color}40`,
                border: `1px solid ${link.color}40`
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: `${link.color}20`,
                  color: link.color
                }}
              >
                {link.icon}
              </div>
              <span className="text-xs font-medium mt-1">{link.name}</span>
            </motion.a>
          ))}
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-4 gap-2 sm:gap-3 mt-2 sm:mt-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {socialLinks.slice(4, 8).map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${accentColor}20`
              }}
              variants={itemVariants}
              whileHover={{ 
                y: -3, 
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)',
                boxShadow: `0 8px 20px -5px ${link.color}40`,
                border: `1px solid ${link.color}40`
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: `${link.color}20`,
                  color: link.color
                }}
              >
                {link.icon}
              </div>
              <span className="text-xs font-medium mt-1">{link.name}</span>
            </motion.a>
          ))}
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-4 gap-2 sm:gap-3 mt-2 sm:mt-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {socialLinks.slice(8, 12).map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${accentColor}20`
              }}
              variants={itemVariants}
              whileHover={{ 
                y: -3, 
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)',
                boxShadow: `0 8px 20px -5px ${link.color}40`,
                border: `1px solid ${link.color}40`
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: `${link.color}20`,
                  color: link.color
                }}
              >
                {link.icon}
              </div>
              <span className="text-xs font-medium mt-1">{link.name}</span>
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
