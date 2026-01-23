import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useParticles } from '../../context/ParticlesContext';
import useSmoothScroll from '../../hooks/useSmoothScroll';
import CanvasRevealEffect from '../common/CanvasRevealEffect';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  // Initialize smooth scroll
  useSmoothScroll();
  const { cornerParticlesEnabled, toggleCornerParticles } = useParticles();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-[#f5f5f5] text-black'
      }`}>
      {/* Corner particles controlled by the Rocket button in Navbar */}
      <CanvasRevealEffect
        cornerParticles={cornerParticlesEnabled}
        onToggleCornerParticles={toggleCornerParticles}
        containerClassName="fixed inset-0 pointer-events-none z-20"
        active={true}
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
