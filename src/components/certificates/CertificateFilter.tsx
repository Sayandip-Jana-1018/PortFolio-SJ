import React from 'react';
import { motion } from 'framer-motion';

interface CertificateFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  accentColor: string;
  theme: string;
}

const CertificateFilter: React.FC<CertificateFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  accentColor,
  theme
}) => {
  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-3 mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {categories.map((category, index) => (
        <motion.button
          key={category}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeCategory === category 
              ? 'bg-gradient-to-r shadow-lg scale-105' 
              : 'bg-opacity-10 hover:bg-opacity-20'
          }`}
          style={{ 
            background: activeCategory === category 
              ? `linear-gradient(135deg, ${accentColor}, ${accentColor}80)` 
              : theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            color: activeCategory === category 
              ? theme === 'dark' ? '#111' : '#fff'
              : 'inherit',
            boxShadow: activeCategory === category 
              ? `0 4px 15px ${accentColor}40` 
              : 'none'
          }}
          onClick={() => onCategoryChange(category)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 + 0.3 }}
        >
          {category}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default CertificateFilter;
