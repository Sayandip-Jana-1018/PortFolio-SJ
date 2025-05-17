import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss, SiNodedotjs, SiMongodb, SiPython } from 'react-icons/si';
import SkillsCharts from './SkillsCharts';

interface TechnicalSkillsProps {
  accentColor: string;
  theme: string;
}

const TechnicalSkills: React.FC<TechnicalSkillsProps> = ({ accentColor, theme }) => {
  const skills = [
    { name: 'React', icon: <SiReact />, proficiency: 95 },
    { name: 'Next.js', icon: <SiNextdotjs />, proficiency: 90 },
    { name: 'TypeScript', icon: <SiTypescript />, proficiency: 85 },
    { name: 'JavaScript', icon: <SiJavascript />, proficiency: 95 },
    { name: 'Tailwind CSS', icon: <SiTailwindcss />, proficiency: 90 },
    { name: 'Node.js', icon: <SiNodedotjs />, proficiency: 85 },
    { name: 'MongoDB', icon: <SiMongodb />, proficiency: 80 },
    { name: 'Python', icon: <SiPython />, proficiency: 75 }
  ];

  return (
    <>
      <motion.div 
        className="glassmorphic-card p-6 rounded-xl mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span style={{ color: accentColor }}><FiStar /></span>
          Technical Skills
        </h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6">
          {skills.slice(0, 8).map((skill, index) => (
            <motion.div 
              key={skill.name}
              className="flex flex-col items-center text-center"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
            >
              <motion.div 
                className="text-3xl mb-2"
                style={{ color: accentColor }}
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
              >
                {skill.icon}
              </motion.div>
              <div className="text-sm font-medium">{skill.name}</div>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full" 
                  style={{ 
                    width: `${skill.proficiency}%`,
                    backgroundColor: accentColor
                  }}
                ></div>
              </div>
              <div className="text-xs mt-1">{skill.proficiency}%</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Add the skills charts */}
      <SkillsCharts accentColor={accentColor} theme={theme} />
    </>
  );
};

export default TechnicalSkills;
