import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import SkillProgressBar from './SkillProgressBar';
import { FiCpu, FiLayout, FiServer, FiDatabase, FiCode, FiActivity } from 'react-icons/fi';

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
      title: "Java & Core",
      skills: [
        { name: "Java", level: 95 },
        { name: "Python", level: 92 },
        { name: "TypeScript / JS", level: 90 },
        { name: "C/C++", level: 85 },
        { name: "SQL", level: 88 }
      ]
    },
    {
      title: "Data Science",
      skills: [
        { name: "Pandas", level: 92 },
        { name: "NumPy", level: 90 },
        { name: "Matplotlib", level: 85 },
        { name: "Time Series", level: 88 },
        { name: "Data Viz", level: 90 }
      ]
    },
    {
      title: "Generative AI",
      skills: [
        { name: "OpenAI / Gemini", level: 90 },
        { name: "LangChain / RAG", level: 85 },
        { name: "Prompt Eng.", level: 92 },
        { name: "CrewAI", level: 80 },
        { name: "Vector DBs", level: 85 }
      ]
    },
    {
      title: "Machine Learning",
      skills: [
        { name: "Scikit-Learn", level: 90 },
        { name: "TensorFlow", level: 85 },
        { name: "Predictive Models", level: 92 },
        { name: "OpenCV", level: 78 },
        { name: "NLP", level: 85 }
      ]
    },
    {
      title: "Full Stack & DevOps",
      skills: [
        { name: "React / Next.js", level: 88 },
        { name: "Node.js / FastAPI", level: 85 },
        { name: "Supabase / SQL", level: 88 },
        { name: "Docker / K8s", level: 80 },
        { name: "Git / CI/CD", level: 90 }
      ]
    }
  ];

  const icons = [
    <FiCode key="code" size={20} style={{ color: accentColor }} />,
    <FiDatabase key="db" size={20} style={{ color: accentColor }} />,
    <FiCpu key="genai" size={20} style={{ color: accentColor }} />,
    <FiActivity key="ml" size={20} style={{ color: accentColor }} />,
    <FiLayout key="layout" size={20} style={{ color: accentColor }} />
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
          Technical expertise in Machine Learning, Data Science, and Full Stack Development
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {skillGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            className="p-6 rounded-2xl glassmorphic-card relative overflow-hidden"
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
                {icons[groupIndex]}
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
