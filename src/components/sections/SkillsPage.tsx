import React, { Suspense, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  SiPython, SiTensorflow, SiScikitlearn, SiPandas, SiNumpy, SiOpencv,
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiTailwindcss,
  SiNodedotjs, SiExpress, SiMongodb, SiFlask, SiSupabase,
  SiGit, SiDocker, SiVercel, SiPostgresql,
  SiThreedotjs, SiOpenai, SiStreamlit
} from "react-icons/si";
import { FiCpu, FiLayout, FiServer, FiTool, FiDatabase } from "react-icons/fi";
import SkillBalls from '../skills/SkillBalls';
import SkillStats from '../skills/SkillStats';
import SkillProficiency from '../skills/SkillProficiency';
import BackgroundElements from '../about/BackgroundElements';
import TitleSection from '../about/TitleSection';

interface SkillsPageProps {
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const SkillsPage: React.FC<SkillsPageProps> = ({ sectionRef }) => {
  const { accentColor, theme } = useTheme();

  // Individual refs for each section
  const titleRef = useRef<HTMLDivElement>(null);

  // Individual inView states for each section with different thresholds
  const titleInView = useInView(titleRef, { once: false, amount: 0.5 });

  // Animation variants for fade-in effect
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 80, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Define skill categories with icons - Updated for Data Science & ML focus
  const skillCategories = [
    {
      title: "Generative AI",
      icon: <FiCpu size={24} />,
      skills: [
        { name: "LangChain", icon: <FiTool size={40} />, color: "#3776AB" },
        { name: "LangGraph", icon: <FiServer size={40} />, color: "#F7931E" },
        { name: "CrewAI", icon: <FiCpu size={40} />, color: "#FF6F00" },
        { name: "OpenAI", icon: <SiOpenai size={40} />, color: "#412991" },
        { name: "Gemini", icon: <FiLayout size={40} />, color: "#4169E1" },
        { name: "Claude", icon: <FiTool size={40} />, color: "#D97757" },
        { name: "Vector DBs", icon: <FiDatabase size={40} />, color: "#000000" }
      ]
    },
    {
      title: "Data Science & ML",
      icon: <FiDatabase size={24} />,
      skills: [
        { name: "Python", icon: <SiPython size={40} />, color: "#3776AB" },
        { name: "TensorFlow", icon: <SiTensorflow size={40} />, color: "#FF6F00" },
        { name: "Scikit-Learn", icon: <SiScikitlearn size={40} />, color: "#F7931E" },
        { name: "Pandas", icon: <SiPandas size={40} />, color: "#150458" },
        { name: "NumPy", icon: <SiNumpy size={40} />, color: "#013243" },
        { name: "PowerBI", icon: <FiLayout size={40} />, color: "#F2C811" },
        { name: "Streamlit", icon: <SiStreamlit size={40} />, color: "#FF4B4B" }
      ]
    },
    {
      title: "Full Stack & Databases",
      icon: <FiLayout size={24} />,
      skills: [
        { name: "Next.js", icon: <SiNextdotjs size={40} />, color: "#000000" },
        { name: "React", icon: <SiReact size={40} />, color: "#61DAFB" },
        { name: "TypeScript", icon: <SiTypescript size={40} />, color: "#3178C6" },
        { name: "Node.js", icon: <SiNodedotjs size={40} />, color: "#339933" },
        { name: "FastAPI", icon: <FiServer size={40} />, color: "#009688" },
        { name: "PostgreSQL", icon: <SiPostgresql size={40} />, color: "#4169E1" },
        { name: "MongoDB", icon: <SiMongodb size={40} />, color: "#47A248" },
        { name: "Supabase", icon: <SiSupabase size={40} />, color: "#3ECF8E" }
      ]
    },
    {
      title: "DevOps & Cloud",
      icon: <FiServer size={24} />,
      skills: [
        { name: "Docker", icon: <SiDocker size={40} />, color: "#2496ED" },
        { name: "Kubernetes", icon: <FiTool size={40} />, color: "#326CE5" },
        { name: "Jenkins", icon: <FiTool size={40} />, color: "#D33833" },
        { name: "AWS", icon: <FiServer size={40} />, color: "#FF9900" },
        { name: "GitHub Actions", icon: <SiGit size={40} />, color: "#2088FF" },
        { name: "Prometheus", icon: <FiDatabase size={40} />, color: "#E6522C" },
        { name: "Grafana", icon: <FiLayout size={40} />, color: "#F46800" },
        { name: "Vercel", icon: <SiVercel size={40} />, color: "#000000" }
      ]
    }
  ];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="min-h-screen py-20 relative overflow-hidden"
      style={{
        background: theme === 'dark' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(5px) saturate(150%)',
        WebkitBackdropFilter: 'blur(5px) saturate(150%)',
        borderTop: `0.5px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
        borderBottom: `0.5px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
      }}
    >
      {/* Dynamic background elements */}
      < BackgroundElements accentColor={accentColor} theme={theme} />
      <div className="container mx-auto px-4 relative z-10">
        {/* Title Section with Typing Effect */}
        <motion.div
          ref={titleRef}
          initial="hidden"
          animate={titleInView ? "visible" : "hidden"}
          variants={fadeInUpVariant}
        >
          <TitleSection
            accentColor={accentColor}
            theme={theme}
            title="Skills & Expertise"
            subtitlePrefix="I specialize in"
            subtitles={[
              'Machine Learning',
              'Data Science',
              'Full Stack Development',
              'AI Applications'
            ]}
          />
        </motion.div>

        <motion.p
          className="text-xl text-center max-w-3xl mx-auto mb-16 opacity-80"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          A Data Science enthusiast with strong foundations in ML, AI, and Full Stack Development
        </motion.p>

        {/* 3D Skill Balls */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <div
                className="animate-pulse text-center p-4 rounded-lg"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <p className="text-lg font-medium">Loading 3D Skills...</p>
              </div>
            </div>
          }>
            <SkillBalls />
          </Suspense>
        </motion.div>

        {/* Skill Stats */}
        <SkillStats />

        {/* Skill Proficiency Bars */}
        <SkillProficiency />

        {/* Call to action */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-4">Want to work together?</h3>
          <p className="text-lg opacity-80 mb-6 max-w-2xl mx-auto">
            I'm always open to discussing ML projects, data science collaborations, or opportunities to build innovative AI solutions.
          </p>
          <motion.a
            href="#contact"
            className="btn-primary px-8 py-4 rounded-full inline-block"
            style={{ backgroundColor: accentColor }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>
      </div>
    </section >
  );
};

export default SkillsPage;