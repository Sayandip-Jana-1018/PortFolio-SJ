import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiLayers, FiHeart, FiTarget } from 'react-icons/fi';

interface StatsSectionProps {
  accentColor: string;
  theme: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({ accentColor, theme }) => {
  const stats = [
    { value: '5+', label: 'Years Experience', icon: <FiAward /> },
    { value: '30+', label: 'Projects Completed', icon: <FiLayers /> },
    { value: '15+', label: 'Happy Clients', icon: <FiHeart /> },
    { value: '99%', label: 'Success Rate', icon: <FiTarget /> }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 w-full">
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.label}
          className="stat-item glassmorphic-card p-4 rounded-xl text-center hover-3d"
          whileHover={{ 
            y: -5, 
            boxShadow: `0 10px 20px rgba(0, 0, 0, 0.1), 0 0 10px ${accentColor}30` 
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 15,
            delay: 0.1 + (index * 0.1)
          }}
        >
          <motion.div 
            className="text-2xl mb-2"
            style={{ color: accentColor }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ 
              duration: 2, 
              delay: index * 0.2, 
              repeat: Infinity, 
              repeatDelay: 8
            }}
          >
            {stat.icon}
          </motion.div>
          <div 
            className="text-2xl font-bold mb-1"
            style={{ color: accentColor }}
          >
            {stat.value}
          </div>
          <p className="text-sm opacity-70">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsSection;
