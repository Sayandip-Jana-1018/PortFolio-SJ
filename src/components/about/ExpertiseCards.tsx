import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiCpu, FiDatabase } from 'react-icons/fi';
import { FaJava } from 'react-icons/fa';

interface ExpertiseCardsProps {
  accentColor: string;
  theme: string;
}

const ExpertiseCards: React.FC<ExpertiseCardsProps> = ({ accentColor, theme }) => {
  const cards = [
    {
      title: 'Java',
      icon: <FaJava size={32} />,
      description: 'Building robust enterprise applications, microservices, and high-performance backend systems.'
    },
    {
      title: 'Data Science & ML',
      icon: <FiDatabase size={32} />,
      description: 'Analyzing complex datasets and building predictive models with TensorFlow, Scikit-Learn, and Pandas.'
    },
    {
      title: 'Generative AI',
      icon: <FiCpu size={32} />,
      description: 'Developing intelligent systems using OpenAI, LangChain, and advanced prompt engineering techniques.'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          className="skill-item glassmorphic-card p-6 rounded-xl hover-3d flex flex-col items-center text-center"
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
            className="w-16 h-16 flex items-center justify-center rounded-full mb-4"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentColor
            }}
          >
            {card.icon}
          </div>
          <h4 className="text-xl font-semibold mb-3">{card.title}</h4>
          <p className="opacity-70 leading-relaxed">{card.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ExpertiseCards;
