import React from 'react';
import { motion } from 'framer-motion';

interface ProjectFilterProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  accentColor: string;
  theme: string;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({ 
  categories, 
  activeCategory, 
  setActiveCategory,
  accentColor,
  theme
}) => {
  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-3 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {['All', ...categories].map((category) => (
        <motion.button
          key={category}
          className="px-4 py-2 rounded-full text-sm font-medium relative overflow-hidden"
          style={{ 
            backgroundColor: activeCategory === category ? accentColor : 'transparent',
            color: activeCategory === category ? 'white' : theme === 'dark' ? 'white' : 'black',
            border: `1px solid ${activeCategory === category ? accentColor : accentColor + '40'}`,
            boxShadow: activeCategory === category ? `0 5px 15px ${accentColor}40` : 'none'
          }}
          onClick={() => setActiveCategory(category)}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: activeCategory === category ? accentColor : `${accentColor}20`
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated glow effect on active category */}
          {activeCategory === category && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ 
                boxShadow: [
                  `0 0 5px ${accentColor}50`,
                  `0 0 15px ${accentColor}70`,
                  `0 0 5px ${accentColor}50`
                ]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            />
          )}
          {category}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default ProjectFilter;
