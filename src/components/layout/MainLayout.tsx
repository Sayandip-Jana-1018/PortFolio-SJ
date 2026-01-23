import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import useSmoothScroll from '../../hooks/useSmoothScroll';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  // Initialize smooth scroll
  useSmoothScroll();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-[#f5f5f5] text-black'
      }`}>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
