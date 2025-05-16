import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, FiUsers, FiMapPin, FiLink, FiAward, FiCode, 
  FiGithub, FiTool, FiTarget, FiCpu, FiStar, FiTrendingUp 
} from 'react-icons/fi';
import { 
  FaTrophy, FaMedal, FaAward, FaLightbulb, FaRocket, 
  FaCode, FaLaptopCode, FaRegLightbulb 
} from 'react-icons/fa';
import { HackathonProject } from './HackathonCard';

interface HackathonTimelineProps {
  hackathons: HackathonProject[];
  accentColor: string;
  theme: string;
}

const HackathonTimeline: React.FC<HackathonTimelineProps> = ({ 
  hackathons, 
  accentColor, 
  theme 
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedHackathon, setSelectedHackathon] = useState<string | null>(null);
  
  // Create refs for each hackathon item
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Initialize refs array
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, hackathons.length);
  }, [hackathons.length]);
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const getTrophyColor = (trophy: string) => {
    switch(trophy) {
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      case 'bronze': return '#CD7F32';
      default: return accentColor;
    }
  };

  const getTrophyIcon = (trophy: string, size = 24) => {
    switch(trophy) {
      case 'gold': return <FaTrophy size={size} color="#FFD700" />;
      case 'silver': return <FaMedal size={size} color="#C0C0C0" />;
      case 'bronze': return <FaAward size={size} color="#CD7F32" />;
      default: return <FiAward size={size} color={accentColor} />;
    }
  };

  // Get a random icon for each technology
  const getTechIcon = (index: number) => {
    const icons = [
      <FiCode key="code" />, 
      <FiCpu key="cpu" />, 
      <FaLaptopCode key="laptop" />, 
      <FiTool key="tool" />, 
      <FiGithub key="github" />,
      <FiTarget key="target" />
    ];
    return icons[index % icons.length];
  };

  // Sort hackathons by date (most recent first)
  const sortedHackathons = [...hackathons].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  
  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="w-full py-16"
    >
      <motion.div 
        className="flex items-center justify-center gap-3 mb-12"
        variants={itemVariants}
      >
        <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-current opacity-50"></div>
        <h3 className="text-2xl md:text-3xl font-bold text-center flex items-center gap-3">
          <FaRocket 
            className="text-transparent bg-clip-text" 
            style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)` }} 
          />
          <span>Hackathon Journey</span>
          <FaLightbulb 
            className="text-transparent bg-clip-text" 
            style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}80, ${accentColor})` }} 
          />
        </h3>
        <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-current opacity-50"></div>
      </motion.div>
      
      <div className="relative">
        {/* Timeline Line with animated gradient */}
        <motion.div 
          className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 md:transform md:translate-x-[-50%] z-0"
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{ 
            background: `linear-gradient(to bottom, 
              transparent 0%, 
              ${accentColor}40 15%, 
              ${accentColor} 50%, 
              ${accentColor}40 85%, 
              transparent 100%
            )`,
            boxShadow: `0 0 15px ${accentColor}40`
          }}
        />
        
        {/* Hackathon Items */}
        {sortedHackathons.map((hackathon, index) => (
          <motion.div 
            key={hackathon.id}
            className="relative mb-24 last:mb-0 hackathon-timeline-item"
            ref={(el) => {
              if (el) itemRefs.current[index] = el;
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2 * index,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedHackathon(selectedHackathon === hackathon.id ? null : hackathon.id)}
          >
            {/* Timeline Dot with Pulse Effect */}
            <motion.div 
              className="absolute left-[-8px] md:left-1/2 top-10 md:transform md:translate-x-[-50%] z-10 timeline-dot"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ 
                delay: 0.3 + (index * 0.2), 
                duration: 0.5,
                type: "spring" 
              }}
            >
              <motion.div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: theme === 'dark' ? '#1a1a2e' : '#ffffff',
                  border: `2px solid ${accentColor}`,
                  boxShadow: `0 0 10px ${accentColor}80`
                }}
                animate={{ 
                  boxShadow: [
                    `0 0 5px ${accentColor}40`,
                    `0 0 15px ${accentColor}80`,
                    `0 0 5px ${accentColor}40`
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {getTrophyIcon(hackathon.trophy, 14)}
              </motion.div>
            </motion.div>
            
            {/* Content */}
            <div className={`ml-8 md:ml-0 md:w-[45%] ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
              <motion.div 
                className="glassmorphic-card rounded-xl overflow-hidden"
                style={{ 
                  background: theme === 'dark' 
                    ? `rgba(20, 20, 30, 0.75)` 
                    : `rgba(255, 255, 255, 0.75)`,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: `0 5px 20px rgba(0, 0, 0, 0.15), 0 0 10px ${accentColor}20`,
                  border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`
                }}
                initial={{ opacity: 0, y: 50, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0, 
                  x: 0,
                  boxShadow: selectedHackathon === hackathon.id
                    ? `0 10px 30px rgba(0, 0, 0, 0.25), 0 0 20px ${accentColor}60`
                    : `0 5px 20px rgba(0, 0, 0, 0.15), 0 0 10px ${accentColor}20`
                }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ 
                  delay: 0.5 + (index * 0.2),
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: `0 15px 30px rgba(0, 0, 0, 0.2), 0 0 15px ${accentColor}40` 
                }}
              >
                {/* Header with gradient background */}
                <div 
                  className="relative h-32 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}10)`
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='[http://www.w3.org/2000/svg'%3E%3Cg](http://www.w3.org/2000/svg'%3E%3Cg) fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${accentColor.slice(1)}' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                    animate={{
                      backgroundPosition: ['0px 0px', '60px 60px'],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 + (index * 0.2), duration: 0.5 }}
                      className="flex items-center justify-center mb-2"
                    >
                      {getTrophyIcon(hackathon.trophy, 28)}
                    </motion.div>
                    <motion.h3 
                      className="text-xl font-bold mb-1"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + (index * 0.2), duration: 0.5 }}
                    >
                      {hackathon.name}
                    </motion.h3>
                    <motion.div 
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.9 + (index * 0.2), duration: 0.5 }}
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
                </div>
                
                <div className="p-6">
                  <motion.h4 
                    className="text-lg font-semibold mb-3 text-transparent bg-clip-text text-center" 
                    style={{ 
                      backgroundImage: `linear-gradient(135deg, ${accentColor}, ${accentColor}80)` 
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.0 + (index * 0.2), duration: 0.5 }}
                  >
                    {hackathon.project}
                  </motion.h4>
                  
                  <motion.p 
                    className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-5 text-center`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.1 + (index * 0.2), duration: 0.5 }}
                  >
                    {hackathon.description}
                  </motion.p>
                  
                  <motion.div 
                    className="grid grid-cols-2 gap-3 text-sm mb-5"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 + (index * 0.2), duration: 0.5 }}
                  >
                    <div className="flex items-center justify-center gap-2 p-2 rounded-md">
                      <div className="p-1.5 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                        <FiCalendar size={14} color={accentColor} />
                      </div>
                      <span>{hackathon.date}</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 p-2 rounded-md">
                      <div className="p-1.5 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                        <FiMapPin size={14} color={accentColor} />
                      </div>
                      <span>{hackathon.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 p-2 rounded-md">
                      <div className="p-1.5 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                        <FiUsers size={14} color={accentColor} />
                      </div>
                      <span>{hackathon.team} ({hackathon.teamSize})</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 p-2 rounded-md">
                      <div className="p-1.5 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                        <FiTrendingUp size={14} color={accentColor} />
                      </div>
                      <span>{hackathon.technologies.length} Technologies</span>
                    </div>
                  </motion.div>
                  
                  {/* Technologies */}
                  <AnimatePresence>
                    {selectedHackathon === hackathon.id && (
                      <motion.div 
                        className="flex flex-wrap gap-2 justify-center mb-5"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {hackathon.technologies.map((tech, i) => (
                          <motion.span 
                            key={i}
                            className="px-3 py-1.5 text-xs rounded-full flex items-center gap-1.5"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: 0.1 + (i * 0.05), duration: 0.3 }}
                            whileHover={{ scale: 1.1, backgroundColor: `${accentColor}40` }}
                            style={{ 
                              backgroundColor: theme === 'dark' ? `${accentColor}20` : `${accentColor}15`,
                              color: theme === 'dark' ? accentColor : `${accentColor}DD`,
                              border: `1px solid ${accentColor}30`
                            }}
                          >
                            {getTechIcon(i)}
                            <span>{tech}</span>
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* View Event Link */}
                  <motion.div 
                    className="flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 + (index * 0.2), duration: 0.5 }}
                  >
                    <motion.a
                      href={hackathon.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{ 
                        backgroundColor: `${accentColor}15`,
                        color: accentColor,
                        border: `1px solid ${accentColor}30`
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: `${accentColor}25`,
                        boxShadow: `0 5px 15px rgba(0, 0, 0, 0.1), 0 0 10px ${accentColor}30`
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiLink size={16} />
                      <span>View Event</span>
                    </motion.a>
                  </motion.div>
                  
                  {/* Expand/Collapse Button */}
                  <motion.div 
                    className="flex justify-center mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 + (index * 0.2), duration: 0.5 }}
                  >
                    <motion.button
                      className="text-xs opacity-60 hover:opacity-100 flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedHackathon(selectedHackathon === hackathon.id ? null : hackathon.id);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {selectedHackathon === hackathon.id ? (
                        <>
                          <FiStar size={12} />
                          <span>Show Less</span>
                        </>
                      ) : (
                        <>
                          <FiStar size={12} />
                          <span>Show More</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </div>
                
                {/* Connecting lines for visual effect */}
                {index < sortedHackathons.length - 1 && (
                  <motion.div
                    className={`hidden md:block absolute ${index % 2 === 0 ? 'right-[-30px]' : 'left-[-30px]'} bottom-[-40px] w-[30px] h-[80px]`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1.5 + (index * 0.2), duration: 0.5 }}
                    style={{
                      borderRight: index % 2 === 0 ? `1px dashed ${accentColor}40` : 'none',
                      borderLeft: index % 2 === 1 ? `1px dashed ${accentColor}40` : 'none',
                      borderBottom: `1px dashed ${accentColor}40`
                    }}
                  />
                )}
              </motion.div>
            </div>
            
            {/* Year marker for significant time gaps */}
            {index > 0 && 
              new Date(hackathon.date).getFullYear() !== new Date(sortedHackathons[index-1].date).getFullYear() && (
              <motion.div
                className="absolute left-0 md:left-1/2 md:transform md:translate-x-[-50%] top-[-20px] z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + (index * 0.2), duration: 0.5 }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ 
                    backgroundColor: theme === 'dark' ? '#1a1a2e' : '#ffffff',
                    border: `2px solid ${accentColor}`,
                    boxShadow: `0 0 15px ${accentColor}60`,
                    color: accentColor
                  }}
                >
                  {new Date(hackathon.date).getFullYear()}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
        
        {/* Timeline End Cap */}
        <motion.div
          className="absolute left-0 md:left-1/2 md:transform md:translate-x-[-50%] bottom-[-30px] z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + (sortedHackathons.length * 0.2), duration: 0.5 }}
        >
          <motion.div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: theme === 'dark' ? '#1a1a2e' : '#ffffff',
              border: `2px solid ${accentColor}`,
              boxShadow: `0 0 15px ${accentColor}60`
            }}
            animate={{ 
              boxShadow: [
                `0 0 5px ${accentColor}40`,
                `0 0 20px ${accentColor}80`,
                `0 0 5px ${accentColor}40`
              ]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <FaRegLightbulb size={18} color={accentColor} />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Call to Action */}
      <motion.div
        className="mt-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 + (sortedHackathons.length * 0.2), duration: 0.8 }}
      >
        <motion.p 
          className="text-lg mb-5 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 + (sortedHackathons.length * 0.2), duration: 0.8 }}
        >
          Interested in collaborating on the next big hackathon project? Let's combine our skills and create something amazing!
        </motion.p>
        
        <motion.a
          href="#contact"
          className="inline-block px-8 py-3 rounded-full font-medium relative overflow-hidden group"
          style={{ 
            backgroundColor: accentColor,
            color: 'white',
            boxShadow: `0 5px 15px rgba(0, 0, 0, 0.1), 0 0 10px ${accentColor}40`
          }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: `0 8px 25px rgba(0, 0, 0, 0.15), 0 0 15px ${accentColor}60`
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <FaRocket size={16} />
            <span>Let's Build Together</span>
          </span>
          <motion.div 
            className="absolute inset-0 w-0 bg-white bg-opacity-20"
            initial={{ width: 0 }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          />
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default HackathonTimeline;