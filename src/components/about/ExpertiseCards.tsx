import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiUser, FiTarget } from 'react-icons/fi';

interface ExpertiseCardsProps {
  accentColor: string;
  theme: string;
}

const ExpertiseCards: React.FC<ExpertiseCardsProps> = ({ accentColor, theme }) => {
  const cards = [
    { 
      title: 'Web Development', 
      icon: <FiCode size={24} />, 
      description: 'Building responsive and performant web applications with modern frameworks and technologies.' 
    },
    { 
      title: 'UI/UX Design', 
      icon: <FiUser size={24} />, 
      description: 'Creating intuitive and beautiful user interfaces with a focus on user experience and accessibility.' 
    },
    { 
      title: 'Problem Solving', 
      icon: <FiTarget size={24} />, 
      description: 'Finding elegant solutions to complex problems through analytical thinking and creativity.' 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full">
      {cards.map((card, index) => (
        <motion.div 
          key={card.title}
          className="skill-item glassmorphic-card p-6 rounded-xl hover-3d"
          whileHover={{ 
            y: -10, 
            boxShadow: `0 15px 30px rgba(0, 0, 0, 0.15), 0 0 15px ${accentColor}30` 
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 15,
            delay: index * 0.1 
          }}
        >
          <div 
            className="w-12 h-12 flex items-center justify-center rounded-full mb-4"
            style={{ 
              backgroundColor: `${accentColor}20`,
              color: accentColor
            }}
          >
            {card.icon}
          </div>
          <h4 className="text-xl font-semibold mb-2">{card.title}</h4>
          <p className="opacity-70">{card.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ExpertiseCards;
