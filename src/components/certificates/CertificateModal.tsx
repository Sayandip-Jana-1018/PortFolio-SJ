import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { FiDownload, FiShare2, FiX, FiAward, FiCalendar, FiUser, FiCheck, FiExternalLink } from 'react-icons/fi';
import { Certificate } from '../../data/certificatesData';

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
  onDownload?: (imageUrl: string, title: string) => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ 
  certificate, 
  isOpen, 
  onClose,
  accentColor,
  onDownload
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Mouse parallax effect values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform mouse movement to subtle movement
  const imageX = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const imageY = useTransform(mouseY, [-0.5, 0.5], [-15, 15]);
  
  // Check if device is mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Handle mouse move for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current || isMobile) return;
    const rect = modalRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };
  
  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);
  
  // Show details after modal is visible and ensure modal is centered on mobile
  useEffect(() => {
    if (isOpen) {
      // Show details after a delay
      const detailsTimer = setTimeout(() => {
        setShowDetails(true);
      }, 500);
      
      // For mobile devices, ensure the modal is centered in the viewport
      if (isMobile && modalRef.current) {
        const scrollTimer = setTimeout(() => {
          modalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Add a class to prevent body scrolling when modal is open
          document.body.style.overflow = 'hidden';
        }, 300);
        
        return () => {
          clearTimeout(detailsTimer);
          clearTimeout(scrollTimer);
        };
      }
      
      return () => clearTimeout(detailsTimer);
    } else {
      setShowDetails(false);
      // Re-enable body scrolling when modal is closed
      document.body.style.overflow = '';
    }
  }, [isOpen, isMobile]);
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 100 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 100,
      transition: { duration: 0.3 }
    }
  };
  
  const detailsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.5 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({ 
      opacity: 1, 
      scale: 1, 
      transition: { delay: 0.3 + (i * 0.1), duration: 0.3 } 
    }),
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };
  
  return (
    <AnimatePresence>
      {isOpen && certificate && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(15px)'
          }}
          onTouchStart={() => {
            // Ensure modal is visible on mobile by scrolling to it
            if (isMobile && modalRef.current) {
              setTimeout(() => {
                modalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }
          }}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <motion.div
            ref={modalRef}
            className="relative max-w-5xl w-full rounded-xl overflow-hidden my-auto"
            style={{
              maxHeight: isMobile ? '90vh' : 'none',
              margin: isMobile ? '10px auto' : 'auto'
            }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseMove={handleMouseMove}
          >
            {/* Certificate Image with Parallax Effect */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{
                  x: isMobile ? 0 : imageX,
                  y: isMobile ? 0 : imageY,
                }}
              >
                <Image 
                  src={certificate.image} 
                  alt={certificate.title} 
                  fill 
                  className="object-contain" 
                  priority
                />
              </motion.div>
              
              {/* Animated gradient overlay */}
              <motion.div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, transparent, ${accentColor}20, transparent)`,
                  boxShadow: `0 0 50px ${accentColor}30 inset`
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
              
              {/* Floating particles */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 6 + 2,
                    height: Math.random() * 6 + 2,
                    backgroundColor: `${accentColor}${Math.floor(Math.random() * 50 + 50)}`,
                    filter: 'blur(1px)',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    zIndex: 5
                  }}
                  animate={{
                    x: [0, Math.random() * 50 - 25],
                    y: [0, Math.random() * 50 - 25],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
              ))}
            </div>
            
            {/* Action Buttons - more visible and accessible on mobile */}
            <div className="absolute top-4 right-4 flex gap-2 sm:gap-3 z-20">
              <motion.button
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: accentColor,
                  backdropFilter: 'blur(10px)',
                  boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px ${accentColor}80`
                }}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={0}
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  boxShadow: `0 5px 25px rgba(0, 0, 0, 0.3), 0 0 10px ${accentColor}40`
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (certificate && onDownload) {
                    onDownload(certificate.image, certificate.title);
                  } else if (certificate) {
                    // Fallback download method if onDownload prop is not provided
                    const link = document.createElement('a');
                    link.href = certificate.image;
                    link.download = `${certificate.title.replace(/\s+/g, '-').toLowerCase()}-certificate.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
              >
                <FiDownload color="#ffffff" size={20} style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }} />
              </motion.button>
              
              {certificate.credentialUrl && (
                <motion.button
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                  }}
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={1}
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    boxShadow: `0 5px 25px rgba(0, 0, 0, 0.3), 0 0 10px ${accentColor}40`
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    window.open(certificate.credentialUrl, '_blank');
                  }}
                >
                  <FiExternalLink color="white" size={20} />
                </motion.button>
              )}
              
              <motion.button
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: accentColor,
                  backdropFilter: 'blur(10px)',
                  boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3), 0 0 15px ${accentColor}80`
                }}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={2}
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  boxShadow: `0 5px 25px rgba(0, 0, 0, 0.3), 0 0 10px ${accentColor}40`
                }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                <FiX color="#ffffff" size={20} style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }} />
              </motion.button>
            </div>
            
            {/* Certificate Details */}
            <AnimatePresence>
              {showDetails && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white"
                  style={{ 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.7) 60%, transparent)',
                    backdropFilter: 'blur(8px)'
                  }}
                  variants={detailsVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-3">
                      <span 
                        className="px-3 py-1 text-xs rounded-full text-white flex items-center gap-1"
                        style={{ backgroundColor: accentColor }}
                      >
                        <FiCheck size={12} />
                        <span>Verified</span>
                      </span>
                      
                      <span 
                        className="px-3 py-1 text-xs rounded-full text-white flex items-center gap-1"
                        style={{ backgroundColor: `${accentColor}90` }}
                      >
                        <FiAward size={12} />
                        <span>{certificate.category}</span>
                      </span>
                    </div>
                    
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">{certificate.title}</h2>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm opacity-90 mb-2 sm:mb-4">
                      <div className="flex items-center gap-2">
                        <FiUser size={16} style={{ color: accentColor }} />
                        <span>{certificate.issuer}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FiCalendar size={16} style={{ color: accentColor }} />
                        <span>{certificate.date}</span>
                      </div>
                      
                      {certificate.credentialUrl && (
                        <a 
                          href={certificate.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:underline"
                          style={{ color: accentColor }}
                        >
                          <FiExternalLink size={16} />
                          <span>View Credential</span>
                        </a>
                      )}
                    </div>
                    
                    <p className="text-sm sm:text-base opacity-90 leading-relaxed line-clamp-3 sm:line-clamp-none">{certificate.description}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CertificateModal;
