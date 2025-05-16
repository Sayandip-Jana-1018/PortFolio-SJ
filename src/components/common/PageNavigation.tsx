import React from 'react';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

interface PageNavigationProps {
  prevPage?: string;
  nextPage?: string;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ prevPage, nextPage }) => {
  const { accentColor } = useTheme();
  
  return (
    <div className="fixed bottom-8 w-full flex justify-center items-center space-x-8 z-50">
      {prevPage && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href={prevPage} passHref>
            <div className="px-6 py-3 rounded-full flex items-center space-x-2 cursor-pointer" 
                 style={{ backgroundColor: accentColor }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-white font-medium">Previous</span>
            </div>
          </Link>
        </motion.div>
      )}
      
      {nextPage && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href={nextPage} passHref>
            <div className="px-6 py-3 rounded-full flex items-center space-x-2 cursor-pointer"
                 style={{ backgroundColor: accentColor }}>
              <span className="text-white font-medium">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default PageNavigation;
