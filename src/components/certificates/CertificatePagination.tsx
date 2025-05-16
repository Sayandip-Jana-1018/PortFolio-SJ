import React from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface CertificatePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  accentColor: string;
  theme: string;
}

const CertificatePagination: React.FC<CertificatePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  accentColor,
  theme
}) => {
  if (totalPages <= 1) return null;
  
  return (
    <motion.div 
      className="flex justify-center mt-12 gap-2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <motion.button
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ 
          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          opacity: currentPage === 0 ? 0.5 : 1,
          cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
        }}
        whileHover={currentPage > 0 ? { scale: 1.1, backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)' } : {}}
        whileTap={currentPage > 0 ? { scale: 0.9 } : {}}
        onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <FiChevronLeft />
      </motion.button>
      
      {Array.from({ length: totalPages }).map((_, index) => (
        <motion.button
          key={index}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: currentPage === index 
              ? accentColor 
              : theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            color: currentPage === index 
              ? theme === 'dark' ? '#111' : '#fff' 
              : 'inherit',
            boxShadow: currentPage === index ? `0 0 10px ${accentColor}60` : 'none'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPageChange(index)}
        >
          {index + 1}
        </motion.button>
      ))}
      
      <motion.button
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ 
          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          opacity: currentPage === totalPages - 1 ? 0.5 : 1,
          cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer'
        }}
        whileHover={currentPage < totalPages - 1 ? { scale: 1.1, backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)' } : {}}
        whileTap={currentPage < totalPages - 1 ? { scale: 0.9 } : {}}
        onClick={() => currentPage < totalPages - 1 && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        <FiChevronRight />
      </motion.button>
    </motion.div>
  );
};

export default CertificatePagination;
