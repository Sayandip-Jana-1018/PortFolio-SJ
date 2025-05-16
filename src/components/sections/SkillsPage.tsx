import React, { Suspense, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { 
  SiHtml5, SiCss3, SiJavascript, SiTypescript, SiReact, SiRedux,
  SiTailwindcss, SiNextdotjs, SiNodedotjs, SiExpress, SiMongodb,
  SiFirebase, SiPostgresql, SiPython, SiDjango, SiGit,
  SiDocker, SiFigma, SiAmazon, SiThreedotjs, SiVuedotjs,
  SiAngular, SiSvelte, SiGraphql, SiMysql, SiFlutter,
  SiKubernetes, SiJenkins, SiNginx, SiVercel, SiNetlify
} from "react-icons/si";
import { FiCode, FiLayout, FiDatabase, FiServer, FiTool } from "react-icons/fi";
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
  
  // Define skill categories with icons
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <FiLayout size={24} />,
      skills: [
        { name: "HTML5", icon: <SiHtml5 size={40} />, color: "#E34F26" },
        { name: "CSS3", icon: <SiCss3 size={40} />, color: "#1572B6" },
        { name: "JavaScript", icon: <SiJavascript size={40} />, color: "#F7DF1E" },
        { name: "TypeScript", icon: <SiTypescript size={40} />, color: "#3178C6" },
        { name: "React", icon: <SiReact size={40} />, color: "#61DAFB" },
        { name: "Redux", icon: <SiRedux size={40} />, color: "#764ABC" },
        { name: "Tailwind CSS", icon: <SiTailwindcss size={40} />, color: "#06B6D4" },
        { name: "Next.js", icon: <SiNextdotjs size={40} />, color: "#000000" }
      ]
    },
    {
      title: "Backend Development",
      icon: <FiServer size={24} />,
      skills: [
        { name: "Node.js", icon: <SiNodedotjs size={40} />, color: "#339933" },
        { name: "Express", icon: <SiExpress size={40} />, color: "#000000" },
        { name: "MongoDB", icon: <SiMongodb size={40} />, color: "#47A248" },
        { name: "PostgreSQL", icon: <SiPostgresql size={40} />, color: "#4169E1" },
        { name: "Python", icon: <SiPython size={40} />, color: "#3776AB" },
        { name: "Django", icon: <SiDjango size={40} />, color: "#092E20" },
        { name: "GraphQL", icon: <SiGraphql size={40} />, color: "#E10098" }
      ]
    },
    {
      title: "DevOps & Tools",
      icon: <FiTool size={24} />,
      skills: [
        { name: "Git", icon: <SiGit size={40} />, color: "#F05032" },
        { name: "Docker", icon: <SiDocker size={40} />, color: "#2496ED" },
        { name: "AWS", icon: <SiAmazon size={40} />, color: "#FF9900" },
        { name: "Kubernetes", icon: <SiKubernetes size={40} />, color: "#326CE5" },
        { name: "Vercel", icon: <SiVercel size={40} />, color: "#000000" },
        { name: "Netlify", icon: <SiNetlify size={40} />, color: "#00C7B7" }
      ]
    },
    {
      title: "Frameworks & Libraries",
      icon: <FiCode size={24} />,
      skills: [
        { name: "Vue.js", icon: <SiVuedotjs size={40} />, color: "#4FC08D" },
        { name: "Angular", icon: <SiAngular size={40} />, color: "#DD0031" },
        { name: "Svelte", icon: <SiSvelte size={40} />, color: "#FF3E00" },
        { name: "Flutter", icon: <SiFlutter size={40} />, color: "#02569B" },
        { name: "Three.js", icon: <SiThreedotjs size={40} />, color: "#000000" }
      ]
    }
  ];

  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className="min-h-screen py-20 relative overflow-hidden"
      style={{ 
        background: theme === 'dark' 
          ? `linear-gradient(135deg, #000000, #0a0a18, ${accentColor}40)` 
          : `linear-gradient(135deg, #ffffff, #f0f0f5, ${accentColor}20)`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
            {/* Dynamic background elements */}
            <BackgroundElements accentColor={accentColor} theme={theme} />   
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
              'Web Development',
              'Frontend Technologies',
              'Backend Systems',
              'Modern Frameworks'
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
          A comprehensive overview of my technical skills and areas of expertise
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
            I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
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
    </section>
  );
};

export default SkillsPage;