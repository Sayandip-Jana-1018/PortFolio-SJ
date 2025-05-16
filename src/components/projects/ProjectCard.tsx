import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiGithub, FiExternalLink, FiCode } from 'react-icons/fi';
import TerminalCodePreview from './TerminalCodePreview';

interface ProjectCardProps {
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
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, accentColor, theme, index }) => {
  const [showTerminal, setShowTerminal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="relative h-full" onClick={() => showTerminal && setShowTerminal(false)}>
      {/* Normal Card View */}
      {/* Always render the card, but conditionally show/hide the terminal */}
      <AnimatePresence mode="wait" initial={false}>
        {true && (
          <motion.div 
            ref={cardRef}
            className="relative glassmorphic-card rounded-xl overflow-hidden h-full"
            style={{ 
              boxShadow: `0 10px 30px rgba(0, 0, 0, 0.15), 0 0 10px ${accentColor}20`,
              willChange: 'transform', // Optimize for animations
              position: 'relative',
              zIndex: 5
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ 
              boxShadow: `0 20px 40px rgba(0, 0, 0, 0.2), 0 0 20px ${accentColor}40`,
              scale: 1.05,
              y: -10,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
            {/* Project Image with Overlay */}
            <div className="relative h-56 overflow-hidden">
              <Image 
                src={project.image} 
                alt={project.title}
                fill
                style={{ objectFit: 'cover' }}
                quality={90}
              />
              
              {/* Gradient overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-b"
                style={{ 
                  background: `linear-gradient(to bottom, 
                    rgba(0,0,0,0.2) 0%, 
                    rgba(0,0,0,0.6) 80%, 
                    ${accentColor}20 100%
                  )`
                }}
              />
              
              {/* Category badge */}
              <div 
                className="absolute top-4 left-4 px-3 py-1 text-xs rounded-full backdrop-blur-sm"
                style={{ 
                  backgroundColor: `${accentColor}80`,
                  color: 'white',
                  border: `1px solid ${accentColor}`,
                  boxShadow: `0 0 10px ${accentColor}50`
                }}
              >
                {project.category}
              </div>
              
              {/* Project title */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{project.title}</h3>
              </div>
            </div>
            
            {/* Project Info */}
            <div className="p-6">
              <p className="mb-4 opacity-90 text-sm line-clamp-3">{project.description}</p>
              
              {/* Key Features */}
              <div className="mb-4">
                <h4 className="text-xs uppercase tracking-wider opacity-70 mb-2">Key Features</h4>
                <ul className="text-xs space-y-1 ml-4 list-disc opacity-80">
                  {project.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
              
              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-6">
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
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <motion.a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-full relative z-20"
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
                    <FiGithub size={18} />
                  </motion.a>
                  
                  <motion.a 
                    href={project.live} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-full relative z-20"
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
                    <FiExternalLink size={18} />
                  </motion.a>
                </div>
                
                <motion.button
                  className="text-xs flex items-center gap-1 px-3 py-1 rounded-full relative z-20"
                  style={{ 
                    border: `1px solid ${accentColor}40`,
                    color: accentColor,
                    cursor: 'pointer'
                  }}
                  whileHover={{ 
                    backgroundColor: accentColor,
                    color: 'white',
                    scale: 1.05,
                    boxShadow: `0 0 10px ${accentColor}60`
                  }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTerminal(true);
                  }}
                >
                  <FiCode size={12} /> View Code
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Terminal View */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div 
            className="absolute top-0 left-0 w-full h-full glassmorphic-card rounded-xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ zIndex: 10 }}
          >
            <div className="absolute top-0 right-0 z-50 m-2">
              <button 
                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                onClick={() => setShowTerminal(false)}
              >
                ×
              </button>
            </div>
            <TerminalCodePreview 
              code={project.codeSnippet}
              language={project.codeLanguage}
              accentColor={accentColor}
              isVisible={showTerminal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectCard;
