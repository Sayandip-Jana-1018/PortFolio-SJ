import React from 'react';
import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';

interface ExperienceTimelineProps {
  accentColor: string;
  theme: string;
}

const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ accentColor, theme }) => {
  const timeline = [
    {
      year: '2025',
      title: 'TechForge \'25 - 2nd Runner Up',
      company: 'National Level Hackathon',
      description: 'Built HygieiaAI - Multi-Agent Health Platform with 94% disease prediction accuracy'
    },
    {
      year: '2024',
      title: 'ML Training - LPU',
      company: 'Lovely Professional University',
      description: 'Applied ML techniques to healthcare datasets, built multi-disease prediction system'
    },
    {
      year: '2024',
      title: 'Inter-University Hackathon Winner',
      company: 'Multiple Hackathons',
      description: 'Won multiple inter-university hackathons with AI/ML projects'
    },
    {
      year: '2021',
      title: 'B.Tech CSE - Started',
      company: 'Lovely Professional University',
      description: 'Began journey in Computer Science with focus on Data Science & Machine Learning'
    }
  ];

  return (
    <motion.div
      className="mt-8 glassmorphic-card p-6 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span style={{ color: accentColor }}><FiAward /></span>
        Journey & Achievements
      </h4>

      <div className="space-y-4">
        {timeline.map((item, index) => (
          <motion.div
            key={item.year + item.title}
            className="p-3 border-l-2"
            style={{ borderColor: accentColor }}
            whileHover={{
              x: 5,
              backgroundColor: `${accentColor}15`,
              boxShadow: `0 4px 12px ${accentColor}20`
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + (index * 0.1) }}
          >
            <div className="flex justify-between items-center mb-1">
              <h5 className="font-bold">{item.title}</h5>
              <div
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor
                }}
              >
                {item.year}
              </div>
            </div>
            <p className="text-sm opacity-70">{item.company}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExperienceTimeline;
