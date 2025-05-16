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
      year: '2023',
      title: 'Senior Developer',
      company: 'Tech Innovators Inc.',
      description: 'Leading development of cutting-edge web applications using Next.js and React.'
    },
    {
      year: '2021',
      title: 'Full Stack Developer',
      company: 'Digital Solutions Ltd.',
      description: 'Developed robust full-stack applications with Node.js and React.'
    },
    {
      year: '2019',
      title: 'Frontend Developer',
      company: 'Creative Web Agency',
      description: 'Created responsive and interactive user interfaces using modern JavaScript frameworks.'
    },
    {
      year: '2018',
      title: 'Junior Developer',
      company: 'StartUp Ventures',
      description: 'Started professional journey building web applications with JavaScript and CSS.'
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
        Experience
      </h4>
      
      <div className="space-y-4">
        {timeline.map((item, index) => (
          <motion.div 
            key={item.year}
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
