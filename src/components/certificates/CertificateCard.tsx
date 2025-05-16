import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { FiZoomIn, FiAward, FiCalendar, FiUser } from 'react-icons/fi';
import { Certificate } from '../../data/certificatesData';

interface CertificateCardProps {
  certificate: Certificate;
  index: number;
  accentColor: string;
  theme: string;
  onSelect: (certificate: Certificate) => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ 
  certificate, 
  index, 
  accentColor, 
  theme,
  onSelect 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Mouse movement for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform mouse movement to rotation
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  
  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 100);
    y.set(yPct * 100);
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="rounded-xl overflow-hidden h-full glassmorphic-card"
        style={{ 
          background: theme === 'dark' 
            ? 'rgba(20, 20, 30, 0.75)' 
            : 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: isHovered
            ? `0 20px 40px rgba(0, 0, 0, 0.2), 0 0 20px ${accentColor}40`
            : `0 10px 30px rgba(0, 0, 0, 0.15), 0 0 10px ${accentColor}20`,
          border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
          transformStyle: "preserve-3d",
          transform: !isMobile && isHovered ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : "none",
          transition: "transform 0.2s ease-out, box-shadow 0.3s ease-out"
        }}
        animate={{
          y: isHovered ? -10 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => {
          if (isMobile) {
            e.preventDefault();
          }
          onSelect(certificate);
        }}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <motion.div
            className="absolute inset-0"
            style={{ 
              transformStyle: "preserve-3d",
              transform: !isMobile && isHovered ? "translateZ(20px)" : "none",
            }}
            transition={{ duration: 0.7 }}
          >
            <Image 
              src={certificate.image} 
              alt={certificate.title} 
              fill 
              className="object-cover transition-transform duration-700" 
              style={{ 
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />
            
            {/* Shiny overlay effect */}
            <motion.div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, transparent, ${accentColor}10, transparent)`,
                opacity: isHovered ? 1 : 0,
              }}
              animate={{
                backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
                opacity: isHovered ? [0, 0.5, 0] : 0
              }}
              transition={{
                duration: 1.5,
                repeat: isHovered ? Infinity : 0,
                repeatType: 'reverse'
              }}
            />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-3 left-3 z-10"
            style={{ 
              transformStyle: "preserve-3d",
              transform: !isMobile && isHovered ? "translateZ(30px)" : "none",
            }}
          >
            <motion.span 
              className="px-2 py-1 text-xs rounded-full text-white flex items-center gap-1"
              style={{ 
                backgroundColor: accentColor,
                boxShadow: isHovered ? `0 5px 15px ${accentColor}80` : 'none'
              }}
              animate={{ scale: isHovered ? 1.1 : 1 }}
            >
              <FiAward size={12} />
              {certificate.category}
            </motion.span>
          </motion.div>
          
          <motion.button
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: `${accentColor}`,
              backdropFilter: 'blur(5px)',
              transformStyle: "preserve-3d",
              transform: isHovered ? "translateZ(30px)" : "none",
              boxShadow: isHovered ? '0 5px 15px rgba(0,0,0,0.2)' : 'none'
            }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(certificate);
            }}
          >
            <FiZoomIn color="white" size={16} />
          </motion.button>
        </div>
        
        <motion.div 
          className="p-5 text-center"
          style={{ 
            transformStyle: "preserve-3d",
            transform: !isMobile && isHovered ? "translateZ(20px)" : "none",
          }}
        >
          <h3 className="text-lg font-bold mb-2 line-clamp-1">{certificate.title}</h3>
          
          <div className="flex items-center justify-center gap-2 text-sm opacity-80 mb-3">
            <div className="flex items-center gap-1">
              <FiUser size={14} style={{ color: accentColor }} />
              <span>{certificate.issuer}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-current opacity-30"></div>
            <div className="flex items-center gap-1">
              <FiCalendar size={14} style={{ color: accentColor }} />
              <span>{certificate.date}</span>
            </div>
          </div>
          
          <p className="text-sm opacity-80 line-clamp-2">{certificate.description}</p>
        </motion.div>
        <motion.div 
          className="absolute inset-0 rounded-xl opacity-0"
          style={{ 
            background: `linear-gradient(135deg, ${accentColor}10, ${accentColor}30)`,
            boxShadow: `0 0 30px ${accentColor}30 inset`
          }}
          whileHover={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default CertificateCard;
