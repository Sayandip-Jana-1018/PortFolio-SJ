import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  skills: string[];
}

const SkillTimeline: React.FC = () => {
  const { theme, accentColor } = useTheme();
  
  const timelineItems: TimelineItem[] = [
    {
      year: "2019",
      title: "Started Learning Web Development",
      description: "Began my journey with HTML, CSS, and JavaScript fundamentals.",
      skills: ["HTML", "CSS", "JavaScript"]
    },
    {
      year: "2020",
      title: "Frontend Framework Exploration",
      description: "Learned React and started building interactive web applications.",
      skills: ["React", "Redux", "Responsive Design"]
    },
    {
      year: "2021",
      title: "Full Stack Development",
      description: "Expanded into backend development with Node.js and databases.",
      skills: ["Node.js", "Express", "MongoDB", "REST APIs"]
    },
    {
      year: "2022",
      title: "Advanced Technologies",
      description: "Mastered TypeScript and Next.js for production-ready applications.",
      skills: ["TypeScript", "Next.js", "GraphQL", "PostgreSQL"]
    },
    {
      year: "2023",
      title: "Modern Web Techniques",
      description: "Focused on performance optimization and modern web standards.",
      skills: ["Web Performance", "PWAs", "Serverless", "AWS"]
    },
    {
      year: "2024",
      title: "Creative Development",
      description: "Exploring creative coding with Three.js and advanced animations.",
      skills: ["Three.js", "WebGL", "Framer Motion", "GSAP"]
    }
  ];
  
  return (
    <div className="mt-24 mb-16">
      <motion.h3
        className="text-3xl font-bold mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Learning Journey
      </motion.h3>
      
      <div className="relative">
        {/* Timeline center line */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 rounded-full"
          style={{ backgroundColor: `${accentColor}40` }}
        />
        
        {timelineItems.map((item, index) => (
          <motion.div
            key={item.year}
            className={`relative flex items-center mb-16 ${
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            }`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Timeline dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
              <div 
                className="w-6 h-6 rounded-full border-4"
                style={{ 
                  backgroundColor: theme === 'dark' ? '#111' : '#fff',
                  borderColor: accentColor
                }}
              />
            </div>
            
            {/* Content */}
            <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
              <div 
                className={`p-6 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-gray-900/50 backdrop-blur-md' 
                    : 'bg-white/70 backdrop-blur-md'
                } shadow-xl border border-opacity-20 ${
                  theme === 'dark' ? 'border-white/10' : 'border-black/10'
                }`}
                style={{
                  boxShadow: `0 10px 30px rgba(0,0,0,0.1), 0 0 10px ${accentColor}20`
                }}
              >
                <div 
                  className="text-sm font-bold mb-2 inline-block px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${accentColor}20`,
                    color: accentColor
                  }}
                >
                  {item.year}
                </div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-sm opacity-80 mb-4">{item.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span 
                      key={skill}
                      className={`text-xs px-2 py-1 rounded-full ${
                        theme === 'dark' 
                          ? 'bg-gray-800' 
                          : 'bg-gray-200'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Empty space for the other side */}
            <div className="w-5/12" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillTimeline;
