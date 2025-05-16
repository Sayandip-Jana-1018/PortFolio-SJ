import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import SkillProgressBar from './SkillProgressBar';
import { FiLayout, FiServer, FiTool } from 'react-icons/fi';

interface SkillGroup {
  title: string;
  skills: {
    name: string;
    level: number;
  }[];
}

const SkillProficiency: React.FC = () => {
  const { theme, accentColor } = useTheme();
  
  const skillGroups: SkillGroup[] = [
    {
      title: "Frontend Development",
      skills: [
        { name: "HTML/CSS", level: 95 },
        { name: "JavaScript", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "React", level: 92 },
        { name: "Next.js", level: 88 },
        { name: "Tailwind CSS", level: 90 },
      ]
    },
    {
      title: "Backend Development",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Express", level: 82 },
        { name: "MongoDB", level: 80 },
        { name: "PostgreSQL", level: 75 },
        { name: "Python", level: 70 },
      ]
    },
    {
      title: "Tools & Others",
      skills: [
        { name: "Git/GitHub", level: 90 },
        { name: "Docker", level: 70 },
        { name: "CI/CD", level: 75 },
        { name: "AWS", level: 65 },
        { name: "Figma", level: 80 },
      ]
    }
  ];

  return (
    <div className="mt-24 max-w-8xl mx-auto">
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false }}
      >
        <motion.h3
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: false }}
        >
          Skill Proficiency
        </motion.h3>
        <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: accentColor }}></div>
        <p className="mt-4 text-lg opacity-80 max-w-2xl mx-auto">
          A detailed breakdown of my technical expertise and proficiency levels
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            className={`p-8 rounded-2xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-md' 
                : 'bg-gradient-to-br from-white/90 to-gray-100/70 backdrop-blur-md'
            } shadow-xl border border-opacity-20 ${
              theme === 'dark' ? 'border-white/10' : 'border-black/10'
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: groupIndex * 0.2 }}
            viewport={{ once: false, margin: "-100px" }}
            whileHover={{ 
              boxShadow: `0 20px 40px rgba(0,0,0,0.2), 0 0 15px ${accentColor}30`,
              transform: 'translateY(-5px)'
            }}
          >
            <div className="flex items-center mb-8">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                style={{ 
                  backgroundColor: `${accentColor}20`,
                  border: `2px solid ${accentColor}`
                }}
              >
                {groupIndex === 0 && <FiLayout size={20} style={{ color: accentColor }} />}
                {groupIndex === 1 && <FiServer size={20} style={{ color: accentColor }} />}
                {groupIndex === 2 && <FiTool size={20} style={{ color: accentColor }} />}
              </div>
              <h4 
                className="text-xl font-bold" 
                style={{ color: accentColor }}
              >
                {group.title}
              </h4>
            </div>
            
            <div>
              {group.skills.map((skill, skillIndex) => (
                <SkillProgressBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  index={skillIndex}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillProficiency;
