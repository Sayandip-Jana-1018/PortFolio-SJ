import React, { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { FiCalendar, FiUsers, FiMapPin, FiLink, FiAward, FiCode } from 'react-icons/fi';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';
import Image from 'next/image';

export interface HackathonProject {
  id: string;
  name: string;
  position: string;
  date: string;
  location: string;
  team: string;
  teamSize: number;
  project: string;
  description: string;
  technologies: string[];
  link: string;
  image: string;
  trophy: 'gold' | 'silver' | 'bronze' | 'special';
}

interface HackathonCardProps {
  hackathon: HackathonProject;
  index: number;
  accentColor: string;
  theme: string;
  isActive?: boolean;
}

const HackathonCard: React.FC<HackathonCardProps> = ({ 
  hackathon, 
  index, 
  accentColor, 
  theme,
  isActive = false
}) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
    setMouseY(e.clientY - rect.top);
  };

  const getTrophyColor = (trophy: string) => {
    switch(trophy) {
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      case 'bronze': return '#CD7F32';
      default: return accentColor;
    }
  };

  const getTrophyIcon = (trophy: string) => {
    switch(trophy) {
      case 'gold': return <FaTrophy size={24} color="#FFD700" />;
      case 'silver': return <FaMedal size={24} color="#C0C0C0" />;
      case 'bronze': return <FaAward size={24} color="#CD7F32" />;
      default: return <FiAward size={24} color={accentColor} />;
    }
  };

  return (
    <motion.div
      className={`glassmorphic-card rounded-2xl overflow-hidden ${isActive ? 'z-10' : 'opacity-90'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: 0
      }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1
      }}
      onMouseMove={handleMouseMove}
      style={{ 
        background: theme === 'dark' 
          ? `rgba(20, 20, 30, 0.75)` 
          : `rgba(255, 255, 255, 0.75)`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: isActive 
          ? `0 10px 30px rgba(0, 0, 0, 0.25), 0 0 20px ${accentColor}40` 
          : `0 5px 15px rgba(0, 0, 0, 0.1), 0 0 5px ${accentColor}20`,
        border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
        position: 'relative'
      }}
    >
      {isActive && (
        <motion.div 
          className="absolute inset-0 opacity-80 pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, ${accentColor}20 0%, transparent 50%)`,
            mixBlendMode: 'plus-lighter'
          }}
        />
      )}
      <div className="relative h-56 w-full overflow-hidden">
        <Image 
          src={hackathon.image} 
          alt={hackathon.name}
          fill
          className="object-cover transition-all duration-700 hover:scale-110 filter brightness-90"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isActive ? 0.5 : 0.7 }}
          style={{ 
            background: `linear-gradient(to top, ${
              theme === 'dark' ? 'rgba(10, 10, 20, 1)' : 'rgba(240, 240, 250, 1)'
            }, transparent 70%)` 
          }}
        />
        <motion.div 
          className="absolute top-4 right-4 p-3 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          style={{ 
            backgroundColor: theme === 'dark' ? 'rgba(10, 10, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            border: `1px solid ${accentColor}40`,
            boxShadow: `0 4px 15px rgba(0, 0, 0, 0.15), 0 0 10px ${accentColor}30`
          }}
          whileHover={{ scale: 1.1 }}
        >
          {getTrophyIcon(hackathon.trophy)}
        </motion.div>
        
        <motion.div 
          className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm font-medium"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          style={{ 
            backgroundColor: `${accentColor}30`,
            color: theme === 'dark' ? 'white' : 'black',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            border: `1px solid ${accentColor}40`
          }}
        >
          {hackathon.position}
        </motion.div>
      </div>

      <div className="p-6 text-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-6"
        >
          <h3 className="text-xl md:text-2xl font-bold line-clamp-2 mb-3">{hackathon.name}</h3>
          <h4 className="text-lg md:text-xl font-semibold mb-3 text-transparent bg-clip-text mx-auto max-w-[90%]" 
            style={{ 
              backgroundImage: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)` 
            }}
          >
            {hackathon.project}
          </h4>
        </motion.div>
        
        <motion.p 
          className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-6 line-clamp-3 mx-auto max-w-[95%]`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {hackathon.description}
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-2 gap-3 text-sm max-w-[90%] mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <motion.div 
            className="flex items-center justify-center gap-2 p-2 rounded-md"
            whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
          >
            <div className="p-1.5 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
              <FiCalendar size={14} color={accentColor} />
            </div>
            <span>{hackathon.date}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center gap-2 p-2 rounded-md"
            whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
          >
            <div className="p-1.5 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
              <FiMapPin size={14} color={accentColor} />
            </div>
            <span>{hackathon.location}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center gap-2 p-2 rounded-md"
            whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
          >
            <div className="p-1.5 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
              <FiUsers size={14} color={accentColor} />
            </div>
            <span>{hackathon.team} ({hackathon.teamSize})</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center gap-2 p-2 rounded-md"
            whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
          >
            <div className="p-1.5 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
              <FiCode size={14} color={accentColor} />
            </div>
            <span>{hackathon.technologies.length} Tech</span>
          </motion.div>
          
          <motion.div 
            className="col-span-2 flex items-center justify-center mt-2"
            whileHover={{ scale: 1.03 }}
          >
            <a 
              href={hackathon.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full w-full justify-center"
              style={{ 
                backgroundColor: `${accentColor}15`,
                color: accentColor,
                border: `1px solid ${accentColor}30`
              }}
            >
              <FiLink size={14} />
              <span>View Event</span>
            </a>
          </motion.div>
        </motion.div>

        {isActive && (
          <motion.div 
            className="mt-6 flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            {hackathon.technologies.map((tech, i) => (
              <motion.span 
                key={i}
                className="px-3 py-1.5 text-xs rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (i * 0.05), duration: 0.3 }}
                whileHover={{ scale: 1.1, backgroundColor: `${accentColor}40` }}
                style={{ 
                  backgroundColor: theme === 'dark' ? `${accentColor}20` : `${accentColor}15`,
                  color: theme === 'dark' ? accentColor : `${accentColor}DD`,
                  border: `1px solid ${accentColor}30`
                }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HackathonCard;
