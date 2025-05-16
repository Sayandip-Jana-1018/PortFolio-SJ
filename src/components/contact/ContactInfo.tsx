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
      icon: <FiMapPin size={22} />,
      title: 'Location',
      description: 'Kolkata, West Bengal, India',
      delay: 0.2
    },
    {
      icon: <FiClock size={22} />,
      title: 'Working Hours',
      description: 'Mon - Fri: 9:00 AM - 6:00 PM',
      delay: 0.3
    },
    {
      icon: <FiPhone size={22} />,
      title: 'Phone',
      description: '+91 8617005893',
      delay: 0.4
    }
  ];

  return (
    <div className="h-full flex flex-col items-center">
      <h3 className="text-2xl font-bold mb-6 text-center">Contact Information</h3>
      
      <div className="space-y-5 w-full max-w-md mx-auto">
        {infoItems.map((item, index) => (
          <motion.div 
            key={item.title}
            className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: item.delay, duration: 0.5 }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: `${accentColor}30` }}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ 
                backgroundColor: `${accentColor}20`,
                color: accentColor
              }}
            >
              {item.icon}
            </div>
            <div>
              <h4 className="font-medium">{item.title}</h4>
              <p className="opacity-70 text-sm">{item.description}</p>
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
