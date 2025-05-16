import React, { useEffect } from 'react';

interface NavigationHandlerProps {
  onNavigate: (sectionName: string) => void;
}

const NavigationHandler: React.FC<NavigationHandlerProps> = ({ onNavigate }) => {
  useEffect(() => {
    // Create a custom event listener for navigation
    const handleCustomNavEvent = (e: CustomEvent) => {
      if (e.detail && typeof e.detail.section === 'string') {
        console.log(`Navigation event received for section: ${e.detail.section}`);
        onNavigate(e.detail.section);
      }
    };
    
    // Add custom event listener for navigation
    document.addEventListener('navigate', handleCustomNavEvent as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener('navigate', handleCustomNavEvent as EventListener);
    };
  }, [onNavigate]);

  // This component doesn't render anything
  return null;
};

export default NavigationHandler;
