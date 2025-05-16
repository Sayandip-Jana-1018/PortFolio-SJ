import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Highlight from 'react-highlight';
import 'highlight.js/styles/atom-one-dark.css';

interface TerminalCodePreviewProps {
  code: string[];
  language: string;
  accentColor: string;
  isVisible: boolean;
}

const TerminalCodePreview: React.FC<TerminalCodePreviewProps> = ({ 
  code, 
  language, 
  accentColor,
  isVisible
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
      className="absolute top-0 left-0 w-full h-full rounded-xl overflow-hidden backdrop-blur-sm terminal-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: `1px solid ${accentColor}40`,
        boxShadow: `0 0 20px ${accentColor}30`,
        zIndex: 50 // Ensure it's above other elements
      }}
    >
      {/* Terminal header */}
      <div className="p-3 flex items-center gap-2 border-b border-gray-800">
        <div className="flex space-x-2">
          <div 
            className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:opacity-80" 
            onClick={(e) => {
              e.stopPropagation();
              // Close the terminal by simulating a click on the parent div
              const parentElement = e.currentTarget.closest('.terminal-wrapper') as HTMLElement;
              if (parentElement) {
                parentElement.click();
              }
            }}
          ></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-center flex-grow text-gray-400 uppercase tracking-wider">
          {language} - Terminal
        </div>
      </div>
      
      {/* Terminal content */}
      <div 
        className="p-4 h-[calc(100%-40px)] overflow-y-auto" 
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="whitespace-pre-wrap break-words w-full">
          <style jsx global>{`
            .hljs { overflow-x: hidden !important; word-wrap: break-word !important; white-space: pre-wrap !important; }  
            ::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
          `}</style>
          <Highlight className={language}>
            {typedLines.join('\n')}
          </Highlight>
        </div>
        
        {/* Blinking cursor */}
        {currentLineIndex < code.length && (
          <motion.span 
            className="inline-block w-2 h-4 bg-white"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default TerminalCodePreview;
