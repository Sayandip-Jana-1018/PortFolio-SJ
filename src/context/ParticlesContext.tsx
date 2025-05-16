import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ParticlesContextType {
  cornerParticlesEnabled: boolean;
  toggleCornerParticles: () => void;
  forceUpdateParticles: () => void;
}

// Create a global event system for particle state changes
const PARTICLES_TOGGLE_EVENT = 'particles-toggle-event';

// Create a custom event dispatcher
export const dispatchParticlesToggle = (enabled: boolean) => {
  console.log('Dispatching particles toggle event:', enabled);
  const event = new CustomEvent(PARTICLES_TOGGLE_EVENT, { detail: { enabled } });
  window.dispatchEvent(event);
};

const ParticlesContext = createContext<ParticlesContextType>({
  cornerParticlesEnabled: true,
  toggleCornerParticles: () => {},
  forceUpdateParticles: () => {}
});

export const useParticles = () => useContext(ParticlesContext);

export const ParticlesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cornerParticlesEnabled, setCornerParticlesEnabled] = useState<boolean>(true);
  
  // Force a re-render of components that use this context
  const forceUpdateParticles = useCallback(() => {
    const currentState = cornerParticlesEnabled;
    console.log('Force updating particles state:', currentState);
    // Dispatch the event to notify all listeners
    dispatchParticlesToggle(currentState);
  }, [cornerParticlesEnabled]);

  const toggleCornerParticles = useCallback(() => {
    setCornerParticlesEnabled(prev => {
      const newState = !prev;
      console.log('Toggling particles state:', { from: prev, to: newState });
      // Dispatch the event to notify all listeners
      dispatchParticlesToggle(newState);
      return newState;
    });
  }, []);

  // Debug state changes
  useEffect(() => {
    console.log('ParticlesContext state updated:', { cornerParticlesEnabled });
  }, [cornerParticlesEnabled]);

  return (
    <ParticlesContext.Provider value={{ 
      cornerParticlesEnabled, 
      toggleCornerParticles,
      forceUpdateParticles
    }}>
      {children}
    </ParticlesContext.Provider>
  );
};
