import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiGithub, FiExternalLink, FiCode, FiAward } from 'react-icons/fi';
import TerminalCodePreview from './TerminalCodePreview';

interface FeaturedProjectProps {
  project: {
    title: string;
    description: string;
    image: string;
    technologies: string[];
    github: string;
    live: string;
    category: string;
    codeSnippet: string[];
    codeLanguage: string;
    features: string[];
    screenshots?: string[];
    featured?: boolean;
  };
  accentColor: string;
  theme: string;
}

const FeaturedProject: React.FC<FeaturedProjectProps> = ({ project, accentColor, theme }) => {
  const [showTerminal, setShowTerminal] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Carousel effect for screenshots
  useEffect(() => {
    if (!project.screenshots || project.screenshots.length <= 1 || showTerminal) return;
    
    const interval = setInterval(() => {
      setCurrentScreenshot(prev => 
        prev === project.screenshots!.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [project.screenshots, showTerminal]);
  
  return (
    <div className="relative col-span-1 md:col-span-2 lg:col-span-2 h-full max-w-5xl mx-auto w-full min-h-[480px]" onClick={() => showTerminal && setShowTerminal(false)}>
      {/* Normal Card View */}
      {/* Always render the card, but conditionally show/hide the terminal */}
      <AnimatePresence mode="wait" initial={false}>
        {true && (
          <motion.div 
            ref={cardRef}
            className="relative glassmorphic-card rounded-xl overflow-hidden h-full flex flex-col"
            style={{ 
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.15), 0 0 10px ${accentColor}20`,
              willChange: 'transform', // Optimize for animations
              position: 'relative',
              zIndex: 5
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false, margin: "-50px" }}
            whileHover={{ 
              boxShadow: `0 20px 40px rgba(0, 0, 0, 0.2), 0 0 20px ${accentColor}40`,
              scale: 1.02,
              y: -5,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 h-full flex-grow">
              {/* Left side - Image carousel or Project Image */}
              <div className="relative h-72 md:h-full min-h-[300px] overflow-hidden">
                {project.screenshots && project.screenshots.length > 0 ? (
                  <>
                    {project.screenshots.map((screenshot, index) => (
                      <motion.div
                        key={screenshot}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: currentScreenshot === index ? 1 : 0,
                          scale: currentScreenshot === index ? 1 : 1.1
                        }}
                        transition={{ duration: 0.7 }}
                      >
                        <Image 
                          src={screenshot} 
                          alt={`${project.title} screenshot ${index + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          quality={90}
                        />
                      </motion.div>
                    ))}
                    
                    {/* Screenshot indicators */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                      {project.screenshots.map((_, index) => (
                        <button
                          key={index}
                          className="w-2 h-2 rounded-full"
                          style={{ 
                            backgroundColor: currentScreenshot === index ? 'white' : 'rgba(255,255,255,0.5)',
                            boxShadow: currentScreenshot === index ? `0 0 5px ${accentColor}` : 'none'
                          }}
                          onClick={() => setCurrentScreenshot(index)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0">
                    <Image 
                      src={project.image} 
                      alt={project.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      quality={90}
                    />
                  </div>
                )}
                
                {/* Featured badge */}
                <div 
                  className="absolute top-4 left-4 px-3 py-1 text-xs rounded-full backdrop-blur-sm flex items-center gap-1 z-10"
                  style={{ 
                    backgroundColor: `${accentColor}90`,
                    color: 'white',
                    border: `1px solid ${accentColor}`,
                    boxShadow: `0 0 15px ${accentColor}70`
                  }}
                >
                  <FiAward size={12} /> FEATURED PROJECT
                </div>
                
                {/* Category badge */}
                <div 
                  className="absolute top-4 right-4 px-3 py-1 text-xs rounded-full backdrop-blur-sm z-10"
                  style={{ 
                    backgroundColor: `${accentColor}80`,
                    color: 'white',
                    border: `1px solid ${accentColor}`,
                    boxShadow: `0 0 10px ${accentColor}50`
                  }}
                >
                  {project.category}
                </div>
                
                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0 md:hidden bg-gradient-to-b"
                  style={{ 
                    background: `linear-gradient(to bottom, 
                      rgba(0,0,0,0.2) 0%, 
                      rgba(0,0,0,0.6) 80%, 
                      ${accentColor}20 100%
                    )`
                  }}
                />
              </div>
              
              {/* Right side - Project info */}
              <div className="p-6 flex flex-col h-full justify-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">{project.title}</h2>
                <p className="mb-6 opacity-90 text-sm md:text-base leading-relaxed">{project.description}</p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.technologies.map(tech => (
                    <span 
                      key={tech}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        color: accentColor,
                        border: `1px solid ${accentColor}30`
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                  <div className="flex space-x-4">
                    <motion.a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full relative z-20"
                      style={{ 
                        backgroundColor: `${accentColor}20`,
                        color: accentColor,
                        cursor: 'pointer'
                      }}
                      whileHover={{ 
                        backgroundColor: accentColor,
                        color: 'white',
                        scale: 1.1,
                        rotate: 5
                      }}
                      transition={{ duration: 0.2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.github, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <FiGithub size={20} />
                    </motion.a>
                    
                    <motion.a 
                      href={project.live} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full relative z-20"
                      style={{ 
                        backgroundColor: `${accentColor}20`,
                        color: accentColor,
                        cursor: 'pointer'
                      }}
                      whileHover={{ 
                        backgroundColor: accentColor,
                        color: 'white',
                        scale: 1.1,
                        rotate: -5
                      }}
                      transition={{ duration: 0.2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.live, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <FiExternalLink size={20} />
                    </motion.a>
                  </div>
                  
                  <motion.button
                    className="text-sm flex items-center gap-2 px-5 py-2.5 rounded-full relative z-20 font-medium"
                    style={{ 
                      border: `1px solid ${accentColor}40`,
                      color: accentColor,
                      cursor: 'pointer',
                      backgroundColor: `${accentColor}10`
                    }}
                    whileHover={{ 
                      backgroundColor: accentColor,
                      color: 'white',
                      scale: 1.05,
                      boxShadow: `0 0 15px ${accentColor}60`
                    }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTerminal(true);
                    }}
                  >
                    <FiCode size={18} /> View Code
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Terminal View - In-Card Modal */}
            <AnimatePresence>
              {showTerminal && (
                <motion.div 
                  className="absolute inset-0 z-50 rounded-xl overflow-hidden shadow-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TerminalCodePreview 
                    code={project.codeSnippet}
                    language={project.codeLanguage}
                    accentColor={accentColor}
                    isVisible={showTerminal}
                    onClose={() => setShowTerminal(false)}
                    theme={theme}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Invisible overlay to catch clicks outside the card */}
      {showTerminal && (
        <div 
          className="fixed inset-0 z-40"
          onClick={(e) => {
            e.stopPropagation();
            setShowTerminal(false);
          }}
        />
      )}

    </div>
  );
};

export default FeaturedProject;
