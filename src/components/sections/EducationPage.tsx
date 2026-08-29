import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import TitleSection from '../about/TitleSection';
import { FiCalendar, FiMapPin, FiAward } from 'react-icons/fi';
import BackgroundElements from '../about/BackgroundElements';

// Education data
const educationData = [
  {
    image: '/images/lpu.png',
    title: "Bachelor of Technology",
    institution: "Lovely Professional University",
    period: "2023 - 2027",
    cgpa: "CGPA - 9.11",
    description: "Pursuing Engineering with a focus on comprehensive technical skills and innovation.",
    achievements: [
      "Consistent academic excellence",
      "Active participation in tech communities",
      "Focus on Full Stack Development"
    ],
    color: "#4b7bff"
  },
  {
    image: '/images/cps1.jpg',
    title: "Secondary Education (10th)",
    institution: "Contai Public School",
    period: "Completed",
    cgpa: "Score: 96.2%",
    description: "Built a strong foundation in Science and Mathematics.",
    achievements: [
      "School Topper",
      "Excellence in Mathematics",
      "Active in co-curricular activities"
    ],
    color: "#4CAF50"
  },
  {
    image: '/images/cps2.jpg',
    title: "Higher Secondary (12th)",
    institution: "Contai Public School",
    period: "Completed",
    cgpa: "Score: 94.75%",
    description: "Specialized in Science stream with focus on Computer Science.",
    achievements: [
      "Distinction in Physics & Chemistry",
      "Computer Science excellence",
      "Merit holder"
    ],
    color: "#ff5757" // Swapped color to differentiate
  }
];

// Spotlight Card Component
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  accentColor: string;
  theme: 'dark' | 'light';
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className = "", accentColor, theme }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className={`relative border rounded-3xl overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      style={{
        background: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.2)', // Very translucent
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(20px) saturate(180%)', // Strong blur + saturation for premium glass
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.2)`, // Enhanced depth
        transformStyle: 'preserve-3d',
      }}
      whileHover={{
        y: -5,
        boxShadow: `0 20px 40px -10px ${accentColor}30`,
        rotateX: 2,
        rotateY: 2,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${accentColor}25,
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
};

// 3D Circle Component
const Education3DCircle: React.FC<{ imageSrc: string; accentColor: string }> = ({ imageSrc, accentColor }) => {
  return (
    <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] flex items-center justify-center mx-auto">
      {/* 3D Glassmorphic Layers */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: `2px solid ${accentColor}40`,
          background: `radial-gradient(circle, transparent 60%, ${accentColor}15 100%)`,
          boxShadow: `0 0 25px ${accentColor}30`,
          transform: 'perspective(800px) rotateX(10deg) scale(0.9)',
        }}
        animate={{
          rotateX: [10, 15, 10],
          scale: [0.9, 0.95, 0.9],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-4 rounded-full"
        style={{
          border: `1px solid ${accentColor}30`,
          background: `radial-gradient(circle, transparent 70%, ${accentColor}20 100%)`,
          transform: 'perspective(800px) rotateX(-5deg)',
        }}
        animate={{
          rotateX: [-5, 5, -5],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Image Container with Glass Effect */}
      <motion.div
        className="relative w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-full overflow-hidden z-10"
        style={{
          boxShadow: `0 0 20px ${accentColor}40`,
          border: `2px solid ${accentColor}60`
        }}
        whileHover={{ scale: 1.05 }}
      >
        <Image
          src={imageSrc}
          alt="Education Logo"
          fill
          sizes="(max-width: 768px) 150px, 180px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none" />
      </motion.div>
    </div>
  );
};

const EducationPage: React.FC<{ sectionRef: React.RefObject<HTMLDivElement> }> = ({ sectionRef }) => {
  const { theme, accentColor } = useTheme();
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: false, margin: "-100px 0px" });

  return (
    <section
      ref={sectionRef}
      className="min-h-screen relative overflow-hidden py-20"
      id="education"
      style={{
        background: theme === 'dark' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(5px) saturate(150%)',
        WebkitBackdropFilter: 'blur(5px) saturate(150%)',
        borderTop: `0.5px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
        borderBottom: `0.5px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
      }}
    >
      <BackgroundElements accentColor={accentColor} theme={theme} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={titleRef}
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <TitleSection
            accentColor={accentColor}
            theme={theme}
            title="Education Journey"
            subtitlePrefix="My"
            subtitles={["Academic Path", "Milestones", "Qualifications"]}
          />
        </motion.div>

        <div className="flex flex-col gap-16">
          {educationData.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch gap-6 lg:gap-10 perspective-1000`}
            >
              {/* Image Card Side */}
              <div className="w-full lg:w-1/3 flex">
                <SpotlightCard accentColor={item.color} theme={theme} className="w-full h-full flex items-center justify-center p-8">
                  <Education3DCircle imageSrc={item.image} accentColor={item.color} />
                </SpotlightCard>
              </div>

              {/* Text Card Side */}
              <div className="w-full lg:w-2/3 flex">
                <SpotlightCard accentColor={item.color} theme={theme} className="w-full h-full p-8 md:p-10 flex flex-col justify-center">
                  <h3 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: item.color }}>
                    {item.title}
                  </h3>
                  <h4 className={`text-xl md:text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {item.institution}
                  </h4>

                  <div className="flex flex-wrap gap-6 mb-8">
                    <span className="flex items-center gap-2 text-lg opacity-90 font-medium" style={{ color: theme === 'dark' ? '#eee' : '#333' }}>
                      <FiCalendar className="text-xl" style={{ color: item.color }} /> {item.period}
                    </span>
                    <span className="flex items-center gap-2 text-lg font-bold" style={{ color: item.color }}>
                      <FiAward className="text-xl" /> {item.cgpa}
                    </span>
                  </div>

                  <p className={`text-lg mb-8 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {item.achievements.map((ach, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:bg-opacity-20"
                        style={{
                          borderColor: `${item.color}40`,
                          background: `${item.color}10`,
                          color: theme === 'dark' ? '#eee' : '#333'
                        }}
                      >
                        {ach}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationPage;
