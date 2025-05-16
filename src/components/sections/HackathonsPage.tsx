import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';
import { FiCalendar, FiUsers, FiMapPin, FiLink } from 'react-icons/fi';

interface HackathonsPageProps {
  sectionRef: React.RefObject<HTMLDivElement>;
}

const HackathonsPage: React.FC<HackathonsPageProps> = ({ sectionRef }) => {
  const { theme, accentColor } = useTheme();
  
  const hackathons = [
    {
      name: "Global Health Hackathon",
      position: "1st Place",
      date: "October 2023",
      location: "Virtual",
      team: "Team Hygieia",
      project: "HygieiaAI - AI-powered health prediction system",
      description: "Developed an AI system that predicts potential health issues based on symptoms and medical history, providing early intervention recommendations.",
      link: "https://globalhealthhackathon.com",
      icon: <FaTrophy size={24} color="#FFD700" />
    },
    {
      name: "Climate Tech Challenge",
      position: "2nd Place",
      date: "July 2023",
      location: "San Francisco, CA",
      team: "EcoInnovators",
      project: "EcoTrack - Carbon footprint monitoring platform",
      description: "Created a platform that helps users track their carbon footprint and suggests personalized sustainable alternatives to reduce environmental impact.",
      link: "https://climatetechchallenge.org",
      icon: <FaMedal size={24} color="#C0C0C0" />
    },
    {
      name: "FinTech Innovation Hackathon",
      position: "Best UI/UX Design",
      date: "March 2023",
      location: "New York, NY",
      team: "FinVision",
      project: "FinVision - Financial analytics dashboard",
      description: "Designed an intuitive financial analytics dashboard that visualizes spending patterns and provides personalized budget recommendations.",
      link: "https://fintechhackathon.com",
      icon: <FaAward size={24} color="#CD7F32" />
    }
  ];

  return (
    <div 
      id="hackathons" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative section-container py-20"
      style={{ 
        background: theme === 'dark' ? 'linear-gradient(to bottom, #1a0f2e, #2d1a3e)' : 'linear-gradient(to bottom, #f0e6f5, #f5e6f0)'
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-96 h-96 opacity-10"
          style={{ 
            borderRadius: '40% 60% 60% 40% / 60% 30% 70% 40%',
            background: `radial-gradient(circle, ${accentColor}80, transparent)`,
            filter: 'blur(60px)'
          }}
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 12, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      </div>
      
      {/* Content */}
      <motion.div 
        className="w-full max-w-5xl mx-auto px-4 z-20 content-block"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
          style={{ 
            backgroundImage: `linear-gradient(135deg, #fff 0%, ${accentColor} 50%, #fff 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: `0 0 5px rgba(255, 255, 255, 0.1), 0 0 10px ${accentColor}40`
          }}
        >
          Hackathons
        </motion.h2>
        
        <motion.p 
          className="text-center max-w-2xl mx-auto mb-16 opacity-80"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          A showcase of my competitive coding achievements and hackathon experiences
        </motion.p>
        
        {/* Trophy Banner */}
        <motion.div 
          className="flex justify-center items-center gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
          >
            <FaTrophy size={40} color="#FFD700" />
            <p className="mt-2 font-bold">1st Place</p>
            <p className="text-sm opacity-70">x1</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
          >
            <FaMedal size={40} color="#C0C0C0" />
            <p className="mt-2 font-bold">2nd Place</p>
            <p className="text-sm opacity-70">x1</p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
          >
            <FaAward size={40} color="#CD7F32" />
            <p className="mt-2 font-bold">Special Awards</p>
            <p className="text-sm opacity-70">x1</p>
          </motion.div>
        </motion.div>
        
        {/* Hackathons Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div 
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 transform md:translate-x-[-50%]"
            style={{ backgroundColor: `${accentColor}40` }}
          />
          
          {/* Hackathon Items */}
          {hackathons.map((hackathon, index) => (
            <motion.div 
              key={hackathon.name}
              className="relative mb-16 last:mb-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + (index * 0.2) }}
              viewport={{ once: true }}
            >
              {/* Timeline Dot */}
              <div 
                className="absolute left-[-8px] md:left-1/2 top-0 w-4 h-4 rounded-full md:transform md:translate-x-[-50%]"
                style={{ backgroundColor: accentColor, border: '2px solid white' }}
              />
              
              {/* Content */}
              <div className={`ml-8 md:ml-0 md:w-[45%] ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                <div 
                  className="glassmorphic-card rounded-xl p-6 hover-3d"
                  style={{ 
                    boxShadow: `0 5px 15px rgba(0, 0, 0, 0.1), 0 0 5px ${accentColor}20` 
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{hackathon.name}</h3>
                    <div>{hackathon.icon}</div>
                  </div>
                  
                  <div 
                    className="inline-block px-3 py-1 rounded-full text-sm mb-4"
                    style={{ 
                      backgroundColor: `${accentColor}20`,
                      color: accentColor
                    }}
                  >
                    {hackathon.position}
                  </div>
                  
                  <h4 className="text-lg font-semibold mb-2">{hackathon.project}</h4>
                  <p className="opacity-80 mb-4">{hackathon.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm opacity-70">
                    <div className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      <span>{hackathon.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiMapPin size={14} />
                      <span>{hackathon.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiUsers size={14} />
                      <span>{hackathon.team}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiLink size={14} />
                      <a 
                        href={hackathon.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                        style={{ color: accentColor }}
                      >
                        Event Link
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Call to Action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 opacity-80">Interested in collaborating on a hackathon?</p>
          <motion.a
            href="#contact"
            className="inline-block px-8 py-3 rounded-full font-medium"
            style={{ 
              backgroundColor: accentColor,
              color: 'white',
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.1), 0 0 10px ${accentColor}40`
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 8px 20px rgba(0, 0, 0, 0.15), 0 0 15px ${accentColor}60`
            }}
            transition={{ duration: 0.3 }}
          >
            Let's Connect
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HackathonsPage;
