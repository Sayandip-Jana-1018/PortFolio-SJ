import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiPhone } from 'react-icons/fi';

interface ContactInfoProps {
  accentColor: string;
  theme: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ accentColor, theme }) => {
  const infoItems = [
    {
      icon: <FiMapPin size={26} />,
      title: 'Location',
      description: 'Kolkata, West Bengal, India',
      delay: 0.2
    },
    {
      icon: <FiClock size={26} />,
      title: 'Working Hours',
      description: 'Mon - Fri: 9:00 AM - 6:00 PM',
      delay: 0.3
    },
    {
      icon: <FiPhone size={26} />,
      title: 'Phone',
      description: '+91 8617005893',
      delay: 0.4
    }
  ];

  return (
    <div className="h-full flex flex-col items-center">
      <h3 className="text-3xl font-black mb-8 text-center tracking-wide" style={{ color: theme === 'dark' ? '#fff' : '#111', textShadow: theme === 'dark' ? `0 0 15px ${accentColor}60` : `0 2px 10px ${accentColor}30` }}>Contact Info</h3>
      
      <div className="space-y-4 w-full max-w-md mx-auto">
        {infoItems.map((item, index) => (
          <motion.div 
            key={item.title}
            className="relative flex items-center gap-5 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-xl p-5 rounded-2xl border border-white/10 overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: item.delay, duration: 0.5, type: 'spring', damping: 20 }}
            whileHover={{ y: -3, borderColor: `${accentColor}50` }}
            style={{ boxShadow: `0 10px 30px -15px rgba(0,0,0,0.5)` }}
          >
            {/* Hover ambient glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 0% 50%, ${accentColor}20, transparent 70%)` }} />
            
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 border relative z-10 transition-colors duration-300"
              style={{ 
                backgroundColor: `${accentColor}10`,
                borderColor: `${accentColor}30`,
                color: accentColor,
                boxShadow: `0 0 20px ${accentColor}20 inset`
              }}
            >
              {item.icon}
            </div>
            <div className="flex flex-col text-left relative z-10">
              <h4 className="font-bold text-lg tracking-wider uppercase opacity-90">{item.title}</h4>
              <p className="opacity-70 text-sm mt-0.5">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-auto p-4 rounded-lg w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm opacity-70 text-center">
          I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
        </p>
      </motion.div>
    </div>
  );
};

export default ContactInfo;
