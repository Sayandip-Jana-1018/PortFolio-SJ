import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '../../context/ThemeContext';
import { FiAward, FiChevronLeft, FiChevronRight, FiX, FiZoomIn, FiDownload, FiShare2 } from 'react-icons/fi';

// Define certificate data structure
interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  category: string;
  description: string;
  credentialUrl?: string;
}

const certificates: Certificate[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: `Certificate ${i + 1}`,
  issuer: ['Coursera', 'Udemy', 'edX', 'freeCodeCamp', 'LinkedIn Learning', 'Google', 'Microsoft'][i % 7],
  date: `${2020 + Math.floor(i / 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`,
  image: `/certificates/certificate${i + 1}.jpeg`,
  category: ['Web Development', 'Data Science', 'UI/UX Design', 'Cloud Computing', 'Machine Learning'][i % 5],
  description: 'This certificate validates expertise in advanced concepts and practical applications in the field.',
  credentialUrl: i % 3 === 0 ? 'https://example.com/credential' : undefined
}));

const CertificatesSection: React.FC = () => {
  const { theme, accentColor } = useTheme();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [visibleCertificates, setVisibleCertificates] = useState<Certificate[]>(certificates);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const certificatesPerPage = 6;
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  
  // Mouse parallax effect values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Handle mouse move for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };
  
  // Category filters
  const categories = ['All', ...Array.from(new Set(certificates.map(cert => cert.category)))];
  
  // Filter certificates by category
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (activeCategory === 'All') {
        setVisibleCertificates(certificates);
      } else {
        setVisibleCertificates(certificates.filter(cert => cert.category === activeCategory));
      }
      setCurrentPage(0);
      setIsLoading(false);
    }, 500);
  }, [activeCategory]);
  
  // Calculate pagination
  const totalPages = Math.ceil(visibleCertificates.length / certificatesPerPage);
  const currentCertificates = visibleCertificates.slice(
    currentPage * certificatesPerPage,
    (currentPage + 1) * certificatesPerPage
  );
  
  // Handle click outside fullscreen view
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fullscreenRef.current && !fullscreenRef.current.contains(e.target as Node)) {
        setIsFullscreen(false);
      }
    };
    
    if (isFullscreen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFullscreen]);
  
  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        setSelectedCertificate(null);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);
  
  // Animation variants
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
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -10,
      boxShadow: `0 20px 40px rgba(0, 0, 0, 0.2), 0 0 20px ${accentColor}40`,
      transition: { type: "spring", stiffness: 300, damping: 15 }
    },
    tap: { scale: 0.98 }
  };
  
  const fullscreenVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };
  
  // Parallax effect transformations
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
  const translateX = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  const translateY = useTransform(mouseY, [-0.5, 0.5], [-10, 10]);
  
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient borders */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-2 opacity-60"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, 
            boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}50`
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-full h-2 opacity-60"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`, 
            boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}50`
          }}
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Floating particles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              backgroundColor: `${accentColor}${Math.floor(Math.random() * 50 + 30)}`,
              filter: 'blur(2px)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-current opacity-50"></div>
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <FiAward className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)` }} />
              <span>Certifications</span>
            </h2>
            <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-current opacity-50"></div>
          </div>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Professional certifications and achievements that validate my expertise and knowledge
          </p>
        </motion.div>
        
        {/* Category Filters */}
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
              onClick={() => setActiveCategory(category)}
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
        
        {/* Certificates Grid */}
        <div 
          ref={containerRef} 
          className="relative" 
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                className="flex justify-center items-center py-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative w-16 h-16">
                  <motion.div 
                    className="absolute inset-0 rounded-full"
                    style={{ borderWidth: 3, borderColor: `${accentColor} transparent ${accentColor} transparent` }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="certificates-grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                {currentCertificates.map((certificate, index) => (
                  <motion.div
                    key={certificate.id}
                    className="relative"
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    custom={index}
                    viewport={{ once: false, margin: "-50px" }}
                    style={{ 
                      perspective: 1000,
                      transformStyle: "preserve-3d"
                    }}
                  >
                    <motion.div
                      className="rounded-xl overflow-hidden h-full glassmorphic-card"
                      style={{ 
                        background: theme === 'dark' 
                          ? 'rgba(20, 20, 30, 0.75)' 
                          : 'rgba(255, 255, 255, 0.75)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: `0 10px 30px rgba(0, 0, 0, 0.15), 0 0 10px ${accentColor}20`,
                        border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                        transformStyle: "preserve-3d",
                        rotateX: rotateX,
                        rotateY: rotateY
                      }}
                      onClick={() => {
                        setSelectedCertificate(certificate);
                        setIsFullscreen(true);
                      }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                        <motion.div
                          className="absolute inset-0"
                          style={{ 
                            x: translateX,
                            y: translateY
                          }}
                        >
                          <Image 
                            src={certificate.image} 
                            alt={certificate.title} 
                            fill 
                            className="object-cover transition-transform duration-700 hover:scale-110" 
                          />
                        </motion.div>
                        <div className="absolute bottom-3 left-3 z-10">
                          <span 
                            className="px-2 py-1 text-xs rounded-full text-white"
                            style={{ backgroundColor: accentColor }}
                          >
                            {certificate.category}
                          </span>
                        </div>
                        <motion.button
                          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(5px)'
                          }}
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCertificate(certificate);
                            setIsFullscreen(true);
                          }}
                        >
                          <FiZoomIn color="white" size={16} />
                        </motion.button>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold mb-1 line-clamp-1">{certificate.title}</h3>
                        <p className="text-sm opacity-70 mb-3">{certificate.issuer} • {certificate.date}</p>
                        <p className="text-sm opacity-80 line-clamp-2">{certificate.description}</p>
                      </div>
                      <div 
                        className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
                        style={{ 
                          background: `linear-gradient(135deg, ${accentColor}10, ${accentColor}30)`,
                          boxShadow: `0 0 30px ${accentColor}30 inset`,
                          opacity: 0
                        }}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pagination */}
          {totalPages > 1 && (
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
                onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
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
                      : 'inherit'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(index)}
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
                onClick={() => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                <FiChevronRight />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Fullscreen Certificate View */}
      <AnimatePresence>
        {isFullscreen && selectedCertificate && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={fullscreenRef}
              className="relative max-w-5xl w-full rounded-xl overflow-hidden"
              variants={fullscreenVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image 
                  src={selectedCertificate.image} 
                  alt={selectedCertificate.title} 
                  fill 
                  className="object-contain" 
                  priority
                />
              </div>
              
              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(5px)'
                  }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    // Download functionality would go here
                    alert('Download functionality would be implemented here');
                  }}
                >
                  <FiDownload color="white" />
                </motion.button>
                
                {selectedCertificate.credentialUrl && (
                  <motion.button
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(5px)'
                    }}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      window.open(selectedCertificate.credentialUrl, '_blank');
                    }}
                  >
                    <FiShare2 color="white" />
                  </motion.button>
                )}
                
                <motion.button
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(5px)'
                  }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsFullscreen(false);
                    setSelectedCertificate(null);
                  }}
                >
                  <FiX color="white" />
                </motion.button>
              </div>
              
              <div 
                className="absolute bottom-0 left-0 right-0 p-6 text-white"
                style={{ 
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  backdropFilter: 'blur(5px)'
                }}
              >
                <h2 className="text-2xl font-bold mb-2">{selectedCertificate.title}</h2>
                <p className="opacity-90 mb-1">{selectedCertificate.issuer} • {selectedCertificate.date}</p>
                <p className="opacity-80">{selectedCertificate.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CertificatesSection;
