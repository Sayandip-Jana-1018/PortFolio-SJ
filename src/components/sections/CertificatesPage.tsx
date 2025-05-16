import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { FiAward, FiCalendar, FiExternalLink } from 'react-icons/fi';
import Image from 'next/image';

interface CertificatesPageProps {
  sectionRef: React.RefObject<HTMLDivElement>;
}

const CertificatesPage: React.FC<CertificatesPageProps> = ({ sectionRef }) => {
  const { theme, accentColor } = useTheme();
  
  const certificates = [
    {
      title: "Advanced React and Redux",
      issuer: "Udemy",
      date: "September 2023",
      image: "/certificates/certificate1.jpeg",
      link: "https://udemy.com/certificate/123",
      description: "Comprehensive course covering advanced React patterns, Redux state management, middleware, and modern application architecture."
    },
    {
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "July 2023",
      image: "/certificates/certificate2.jpeg",
      link: "https://aws.amazon.com/certification/123",
      description: "Professional certification validating expertise in designing distributed systems on AWS, including security, reliability, and cost optimization."
    },
    {
      title: "TensorFlow Developer Certificate",
      issuer: "Google",
      date: "March 2023",
      image: "/certificates/certificate3.jpeg",
      link: "https://tensorflow.org/certificate/123",
      description: "Certification demonstrating proficiency in building and training neural networks using TensorFlow for various machine learning applications."
    },
    {
      title: "UI/UX Design Fundamentals",
      issuer: "Interaction Design Foundation",
      date: "January 2023",
      image: "/certificates/certificate4.jpeg",
      link: "https://interaction-design.org/certificate/123",
      description: "Course covering user-centered design principles, wireframing, prototyping, and usability testing methodologies."
    }
  ];

  return (
    <div 
      id="certificates" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative section-container py-20"
      style={{ 
        background: theme === 'dark' ? 'linear-gradient(to bottom, #2d1a3e, #1a1a2e)' : 'linear-gradient(to bottom, #f5e6f0, #e6e6f0)'
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-96 h-96 opacity-10"
          style={{ 
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            background: `radial-gradient(circle, ${accentColor}80, transparent)`,
            filter: 'blur(60px)'
          }}
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 12, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      </div>
      
      {/* Content */}
      <motion.div 
        className="w-full max-w-6xl mx-auto px-4 z-20 content-block"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
          style={{ 
            backgroundImage: `linear-gradient(135deg, #fff 0%, ${accentColor} 50%, #fff 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: `0 0 5px rgba(255, 255, 255, 0.1), 0 0 10px ${accentColor}40`
          }}
        >
          Certificates
        </motion.h2>
        
        <motion.p 
          className="text-center max-w-2xl mx-auto mb-16 opacity-80"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Professional certifications and courses I've completed to enhance my skills
        </motion.p>
        
        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificates.map((certificate, index) => (
            <motion.div 
              key={certificate.title}
              className="glassmorphic-card rounded-xl overflow-hidden hover-3d"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10, 
                boxShadow: `0 15px 30px rgba(0, 0, 0, 0.1), 0 0 15px ${accentColor}30` 
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${certificate.image})`,
                    filter: 'blur(2px)',
                    transform: 'scale(1.05)'
                  }}
                />
                <div className="absolute inset-0" style={{ backgroundColor: `${theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'}` }} />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${accentColor}20`,
                      border: `2px solid ${accentColor}80`
                    }}
                  >
                    <FiAward size={40} style={{ color: accentColor }} />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{certificate.title}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="opacity-80">{certificate.issuer}</span>
                  <div className="flex items-center gap-1 text-sm opacity-70">
                    <FiCalendar size={14} />
                    <span>{certificate.date}</span>
                  </div>
                </div>
                
                <p className="opacity-80 mb-4 text-sm">{certificate.description}</p>
                
                <a 
                  href={certificate.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm mt-4"
                  style={{ color: accentColor }}
                >
                  <FiExternalLink /> View Certificate
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Additional Qualifications */}
        <motion.div 
          className="mt-16 glassmorphic-card rounded-xl p-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold mb-6 text-center">Additional Qualifications</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: "Python Data Structures", issuer: "University of Michigan", date: "2022" },
              { title: "Web Accessibility", issuer: "W3C", date: "2022" },
              { title: "Agile Project Management", issuer: "PMI", date: "2021" },
              { title: "Responsive Web Design", issuer: "freeCodeCamp", date: "2021" },
              { title: "JavaScript Algorithms", issuer: "freeCodeCamp", date: "2021" },
              { title: "Git & GitHub Fundamentals", issuer: "GitHub", date: "2020" }
            ].map((qual, index) => (
              <motion.div 
                key={qual.title}
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: `1px solid ${accentColor}20`
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + (index * 0.05) }}
                viewport={{ once: true }}
                whileHover={{ 
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  borderColor: `${accentColor}40`
                }}
              >
                <h4 className="font-medium mb-1">{qual.title}</h4>
                <div className="flex justify-between text-sm opacity-70">
                  <span>{qual.issuer}</span>
                  <span>{qual.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CertificatesPage;
