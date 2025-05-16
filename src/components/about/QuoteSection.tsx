import React from 'react';
import { motion } from 'framer-motion';

interface QuoteSectionProps {
  accentColor: string;
  theme: string;
}

const QuoteSection: React.FC<QuoteSectionProps> = ({ accentColor, theme }) => {
  return (
    <motion.div 
      className="mt-8 glassmorphic-card p-6 rounded-xl text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <blockquote className="text-lg italic opacity-90 relative">
        <div 
          className="absolute -left-2 -top-2 text-3xl opacity-50"
          style={{ color: accentColor }}
        >
          "
        </div>
        <p className="px-6">
          I believe that great design combined with clean code creates experiences that not only look good but also function flawlessly.
        </p>
        <div 
          className="absolute -right-2 -bottom-2 text-3xl opacity-50"
          style={{ color: accentColor }}
        >
          "
        </div>
      </blockquote>
    </motion.div>
  );
};

export default QuoteSection;
