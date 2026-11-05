import React, { Suspense, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
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

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="cv-auto min-h-screen py-20 relative overflow-hidden"
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