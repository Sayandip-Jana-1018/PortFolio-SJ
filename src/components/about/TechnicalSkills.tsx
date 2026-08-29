import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiPieChart } from 'react-icons/fi';
import {
  SiPython, SiScikitlearn, SiPandas, SiNumpy,
  SiReact, SiNextdotjs, SiTypescript, SiJavascript,
  SiNodedotjs, SiMongodb, SiTensorflow, SiDocker, SiOpenai
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import SkillsCharts from './SkillsCharts';

interface TechnicalSkillsProps {
  accentColor: string;
  theme: string;
}

const TechnicalSkills: React.FC<TechnicalSkillsProps> = ({ accentColor, theme }) => {
  const skills = [
    { name: 'Java', icon: <FaJava />, proficiency: 95 },
    { name: 'Data Science', icon: <SiPandas />, proficiency: 92 },
    { name: 'Gen AI', icon: <SiOpenai />, proficiency: 90 },
    { name: 'Machine Learning', icon: <SiTensorflow />, proficiency: 88 },
    { name: 'Full Stack', icon: <SiNextdotjs />, proficiency: 85 },
    { name: 'Python', icon: <SiPython />, proficiency: 95 },
    { name: 'Docker / DevOps', icon: <SiDocker />, proficiency: 88 },
    { name: 'Scikit-Learn', icon: <SiScikitlearn />, proficiency: 85 }
  ];

  return (
    <>
      <motion.div
        className="glassmorphic-card p-6 rounded-xl mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h4 className="text-xl font-semibold mb-6 flex items-center justify-center gap-2">
          <span style={{ color: accentColor }}><FiStar /></span>
          Core Technical Skills
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
