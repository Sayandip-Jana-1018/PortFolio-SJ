import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Highlight from 'react-highlight';
import 'highlight.js/styles/atom-one-dark.css';

interface TerminalCodePreviewProps {
  code: string[];
  language: string;
  accentColor: string;
  isVisible: boolean;
  onClose?: () => void;
  theme: string;
}

const TerminalCodePreview: React.FC<TerminalCodePreviewProps> = ({ 
  code, 
  language, 
  accentColor,
  isVisible,
  onClose,
  theme
}) => {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  
  // Reset the typing animation when the component becomes visible
  useEffect(() => {
    if (isVisible) {
      setTypedLines([]);
      setCurrentLineIndex(0);
      setCurrentCharIndex(0);
    }
  }, [isVisible]);
  
  // Typing effect
  useEffect(() => {
    if (!isVisible || currentLineIndex >= code.length) return;
    
    const currentLine = code[currentLineIndex];
    
    if (currentCharIndex < currentLine.length) {
      // Still typing current line
      const timer = setTimeout(() => {
        setTypedLines(prev => {
          const newLines = [...prev];
          if (newLines.length <= currentLineIndex) {
            newLines.push(currentLine.substring(0, currentCharIndex + 1));
          } else {
            newLines[currentLineIndex] = currentLine.substring(0, currentCharIndex + 1);
          }
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, 15 + Math.random() * 30); // Variable typing speed
      
      return () => clearTimeout(timer);
    } else {
      // Move to next line
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, code, currentLineIndex, currentCharIndex]);
  
  return (
    <motion.div 
      className="w-full h-full rounded-xl overflow-hidden backdrop-blur-xl terminal-wrapper flex flex-col"
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(15, 20, 30, 0.95)' : 'rgba(255, 255, 255, 0.85)',
        border: `1px solid ${theme === 'dark' ? accentColor + '40' : accentColor + '60'}`,
        boxShadow: theme === 'dark' 
          ? `0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 20px ${accentColor}30, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          : `0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 30px ${accentColor}30, inset 0 1px 0 rgba(255, 255, 255, 1)`,
        zIndex: 50
      }}
    >
      {/* Terminal header */}
      <div className={`px-4 py-3 flex items-center gap-2 border-b ${theme === 'dark' ? 'border-white/10 bg-black/30' : 'border-black/10 bg-white/40'} backdrop-blur-md`}>
        <div className="flex space-x-2">
          <div 
            className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:opacity-80 shadow-sm" 
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) onClose();
            }}
          ></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
        </div>
        <div className={`text-xs text-center flex-grow uppercase tracking-wider font-bold opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {language}
        </div>
      </div>
      
      {/* Terminal content */}
      <div 
        className="p-4 md:p-6 flex-grow overflow-y-auto font-mono text-sm md:text-base leading-relaxed" 
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          color: theme === 'dark' ? '#e2e8f0' : '#1e293b'
        }}
      >
        <div className="whitespace-pre-wrap break-words w-full">
          <style jsx global>{`
            .hljs { 
              overflow-x: hidden !important; 
              word-wrap: break-word !important; 
              white-space: pre-wrap !important;
              background: transparent !important;
              padding: 0 !important;
            }  
            ::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
          `}</style>
          <Highlight className={language}>
            {typedLines.join('\n')}
          </Highlight>
        </div>
        
        {/* Blinking cursor */}
        {currentLineIndex < code.length && (
          <motion.span 
            className="inline-block w-2 h-4 ml-1"
            style={{ backgroundColor: accentColor, opacity: 0.8 }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default TerminalCodePreview;
