import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiCpu, FiTarget } from 'react-icons/fi';

interface ExpertiseCardsProps {
  accentColor: string;
  theme: string;
}

const ExpertiseCards: React.FC<ExpertiseCardsProps> = ({ accentColor, theme }) => {
  const cards = [
    {
      title: 'Machine Learning',
      icon: <FiCpu size={24} />,
      description: 'Building predictive models with TensorFlow, Scikit-Learn, and XGBoost for healthcare and NLP applications.'
    },
    {
      title: 'AI Applications',
      icon: <FiCode size={24} />,
      description: 'Developing intelligent systems with OpenAI, LangChain, MediaPipe, and computer vision for real-world solutions.'
    },
    {
      title: 'Full Stack Development',
      icon: <FiTarget size={24} />,
      description: 'Creating end-to-end web applications with React, Next.js, Node.js, and Flask for seamless user experiences.'
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
