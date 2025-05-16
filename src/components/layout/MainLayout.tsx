import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useParticles } from '../../context/ParticlesContext';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Container, Engine } from 'tsparticles-engine';
import { particlesConfig, updateParticlesColors } from '../../utils/particlesConfig';
import useSmoothScroll from '../../hooks/useSmoothScroll';
import CanvasRevealEffect from '../common/CanvasRevealEffect';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme, accentColor } = useTheme();
  const { cornerParticlesEnabled, toggleCornerParticles } = useParticles();
  const [particlesContainer, setParticlesContainer] = useState<Container | null>(null);
  const lenisRef = useSmoothScroll();
  
  // Initialize particles
  const particlesInit = async (engine: any): Promise<void> => {
    await loadFull(engine);
  };

  const particlesLoaded = async (container?: Container): Promise<void> => {
    if (container) {
      setParticlesContainer(container);
    }
  };

  // Update particles colors when theme or accent color changes
  useEffect(() => {
    if (particlesContainer) {
      updateParticlesColors(theme === 'dark', accentColor, particlesContainer);
    }
  }, [theme, accentColor, particlesContainer]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0f0f0f] text-white' : 'bg-[#f5f5f5] text-black'
    }`}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particlesConfig as any}
        className="fixed inset-0 -z-10"
      />
      
      {/* Corner particles with rocket toggle - increased z-index for better visibility */}
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
