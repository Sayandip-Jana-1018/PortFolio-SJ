import React from 'react';
import { Html, useProgress } from "@react-three/drei";
import { useTheme } from '../../context/ThemeContext';

const CanvasLoader = () => {
  const { progress } = useProgress();
  const { accentColor } = useTheme();
  
  return (
    <Html
      as='div'
      center
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className="w-10 h-10 relative">
        <div 
          className="w-full h-full rounded-full absolute border-2 border-t-transparent animate-spin"
          style={{ borderColor: `${accentColor}50`, borderTopColor: 'transparent' }}
        />
        <div 
          className="w-full h-full rounded-full absolute border-2 border-l-transparent border-r-transparent animate-pulse"
          style={{ borderColor: accentColor, opacity: 0.7 }}
        />
      </div>
      <p
        className="text-sm font-medium mt-2"
        style={{ color: accentColor }}
      >
        {progress.toFixed(2)}%
      </p>
    </Html>
  );
};

export default CanvasLoader;
