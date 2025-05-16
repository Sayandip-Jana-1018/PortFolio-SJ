import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaTrophy, FaMedal, FaAward, FaUsers, FaCode, FaLightbulb } from 'react-icons/fa';

interface HackathonStatsProps {
  accentColor: string;
  theme: string;
  stats: {
    firstPlace: number;
    secondPlace: number;
    specialAwards: number;
    totalHackathons: number;
    projectsBuilt: number;
    teamsLed: number;
  };
}

const HackathonStats: React.FC<HackathonStatsProps> = ({ accentColor, theme, stats }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
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
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  const statItems = [
    {
      label: "First Place",
      value: stats.firstPlace,
      icon: <FaTrophy size={28} color="#FFD700" />,
      color: "#FFD700"
    },
    {
      label: "Second Place",
      value: stats.secondPlace,
      icon: <FaMedal size={28} color="#C0C0C0" />,
      color: "#C0C0C0"
    },
    {
      label: "Special Awards",
      value: stats.specialAwards,
      icon: <FaAward size={28} color="#CD7F32" />,
      color: "#CD7F32"
    },
    {
      label: "Total Hackathons",
      value: stats.totalHackathons,
      icon: <FaCode size={28} color={accentColor} />,
      color: accentColor
    },
    {
      label: "Projects Built",
      value: stats.projectsBuilt,
      icon: <FaLightbulb size={28} color={accentColor} />,
      color: accentColor
    },
    {
      label: "Teams Led",
      value: stats.teamsLed,
      icon: <FaUsers size={28} color={accentColor} />,
      color: accentColor
    }
  ];
  
  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className="w-full py-10"
    >
      <motion.h3 
        className="text-2xl font-bold mb-8 text-center"
        variants={itemVariants}
      >
        Hackathon Achievements
      </motion.h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="glassmorphic-card rounded-xl p-4 flex flex-col items-center text-center"
            style={{ 
              background: theme === 'dark' 
                ? `rgba(30, 30, 40, 0.7)` 
                : `rgba(255, 255, 255, 0.7)`,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.1), 0 0 5px ${item.color}40`
            }}
            whileHover={{ 
              y: -5, 
              boxShadow: `0 8px 20px rgba(0, 0, 0, 0.15), 0 0 10px ${item.color}60` 
            }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{ 
                background: `radial-gradient(circle, ${item.color}20 0%, transparent 70%)` 
              }}
            >
              {item.icon}
            </div>
            
            <motion.span 
              className="text-3xl font-bold"
              style={{ color: item.color }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.3 + (index * 0.1),
                type: "spring"
              }}
            >
              {item.value}
            </motion.span>
            
            <span className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HackathonStats;
