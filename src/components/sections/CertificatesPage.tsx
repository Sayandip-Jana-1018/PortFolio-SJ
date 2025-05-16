import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { certificates } from '../../data/certificatesData';
import BackgroundElements from '../about/BackgroundElements';
import TitleSection from '../about/TitleSection';
import CertificateFilter from '../certificates/CertificateFilter';
import CertificateCard from '../certificates/CertificateCard';
import CertificateModal from '../certificates/CertificateModal';
import CertificatePagination from '../certificates/CertificatePagination';
import { Certificate } from '../../data/certificatesData';

const CertificatesPage: React.FC = () => {
  const { theme, accentColor } = useTheme();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [visibleCertificates, setVisibleCertificates] = useState<Certificate[]>(certificates);
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const certificatesPerPage = 6;
  const containerRef = useRef<HTMLDivElement>(null);
  
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
  
  // Handle certificate selection
  const handleCertificateSelect = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };
  
  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCertificate(null), 300); // Delay to allow exit animation
  };
  
  // Function to handle certificate download
  const handleDownloadCertificate = (imageUrl: string, title: string) => {
    // Create an anchor element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-certificate.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section 
      className="min-h-screen flex items-center justify-center relative section-container py-10 overflow-hidden"
      style={{ 
        background: theme === 'dark' 
          ? `linear-gradient(135deg, #000000, #0a0a18, ${accentColor}40)` 
          : `linear-gradient(135deg, #ffffff, #f0f0f5, ${accentColor}20)`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      {/* Background Elements */}
      <BackgroundElements accentColor={accentColor} theme={theme} />
      
      <div className="w-full max-w-7xl mx-auto px-4 z-20 content-block flex flex-col items-center">
        {/* Title Section */}
        <TitleSection 
          accentColor={accentColor} 
          theme={theme}
          title="My Certificates"
          subtitlePrefix="Showcasing my"
          subtitles={[
            'Professional Achievements',
            'Technical Expertise',
            'Learning Journey',
            'Skills & Qualifications'
          ]}
        />
        
        {/* Category Filters */}
        <div className="w-full max-w-3xl mx-auto">
          <CertificateFilter 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            accentColor={accentColor}
            theme={theme}
          />
        </div>
        
        {/* Certificates Grid */}
        <div 
          ref={containerRef} 
          className="relative w-full" 
          onMouseMove={handleMouseMove}
        >
          {isLoading ? (
            <motion.div 
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {currentCertificates.map((certificate, index) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  index={index}
                  accentColor={accentColor}
                  theme={theme}
                  onSelect={handleCertificateSelect}
                />
              ))}
            </div>
          )}
          
          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <CertificatePagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              accentColor={accentColor}
              theme={theme}
            />
          </div>
        </div>
      </div>
      
      {/* Certificate Modal with working download button */}
      <CertificateModal 
        certificate={selectedCertificate}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        accentColor={accentColor}
        onDownload={handleDownloadCertificate}
      />
    </section>
  );
};

export default CertificatesPage;