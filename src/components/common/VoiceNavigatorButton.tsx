import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { FiMic } from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Dynamically import VoiceNavigator to avoid SSR issues with browser APIs
const VoiceNavigator = dynamic(() => import('./VoiceNavigator'), {
  ssr: false
});

// No props needed as we're not using className anymore
interface VoiceNavigatorButtonProps {}

const VoiceNavigatorButton: React.FC<VoiceNavigatorButtonProps> = () => {
  const { accentColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle navigation to sections
  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };
  
  return (
    <>
      <motion.button
        className="flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        aria-label="Voice Navigator"
      >
        <motion.div
          className="relative"
          initial={{ scale: 1 }}
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration: 2 
          }}
        >
          <FiMic size={20} color={accentColor} />
          <motion.div 
            className="absolute -inset-1 rounded-full"
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{ 
              opacity: 0,
              scale: 1.5,
            }}
            transition={{ 
              repeat: Infinity,
              duration: 1.5
            }}
            style={{ border: `1px solid ${accentColor}` }}
          />
        </motion.div>
      </motion.button>
      
      {/* Voice Navigator Modal */}
      {isOpen && (
        <VoiceNavigator 
          onNavigate={handleNavigate} 
        />
      )}
    </>
  );
};

export default VoiceNavigatorButton;
