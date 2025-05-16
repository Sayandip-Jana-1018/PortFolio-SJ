import React, { useEffect, useState, useCallback } from 'react';
import { useParticles, dispatchParticlesToggle } from '../../context/ParticlesContext';

const RocketToggle: React.FC = () => {
  const { cornerParticlesEnabled, toggleCornerParticles, forceUpdateParticles } = useParticles();
  const [isActive, setIsActive] = useState(cornerParticlesEnabled);

  // Force sync with context on mount and when context changes
  useEffect(() => {
    console.log('RocketToggle: Syncing with context state:', cornerParticlesEnabled);
    setIsActive(cornerParticlesEnabled);
  }, [cornerParticlesEnabled]);

  // Handler for direct button clicks
  const handleToggle = useCallback(() => {
    console.log('RocketToggle: Button clicked, current state:', isActive);
    const newState = !isActive;
    setIsActive(newState);
    
    // Update context and dispatch global event
    toggleCornerParticles();
    
    // Force a direct event dispatch for immediate effect
    dispatchParticlesToggle(newState);
    
    console.log('RocketToggle: State toggled to:', newState);
  }, [isActive, toggleCornerParticles]);

  // Create a DOM element directly to ensure it's always visible
  useEffect(() => {
    // Remove any existing button first
    const existingButton = document.getElementById('rocket-toggle-button');
    if (existingButton) {
      document.body.removeChild(existingButton);
    }

    // Create new button element
    const button = document.createElement('button');
    button.id = 'rocket-toggle-button';
    button.innerHTML = `
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="30" 
        height="30" 
        viewBox="0 0 24 24" 
        fill="${isActive ? '#ffffff' : '#888888'}"
        stroke="${isActive ? '#000000' : '#444444'}" 
        stroke-width="1" 
      >
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    `;
    
    // Style the button
    Object.assign(button.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: '10000',
      backgroundColor: isActive ? '#ff0000' : '#555555',
      color: 'white',
      padding: '15px',
      borderRadius: '50%',
      border: '3px solid white',
      boxShadow: isActive ? '0 0 20px 5px rgba(255,0,0,0.7)' : 'none',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      animation: isActive ? 'pulse 2s infinite' : 'none',
      transition: 'all 0.3s ease'
    });

    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);

    // Add the button to the document
    document.body.appendChild(button);

    // Add click event listener with our custom handler
    button.addEventListener('click', () => {
      console.log('RocketToggle: Direct DOM button clicked');
      handleToggle();
    });

    // Debug current state
    console.log('RocketToggle: Button created with state:', isActive);

    return () => {
      document.body.removeChild(button);
      document.head.removeChild(style);
    };
  }, [cornerParticlesEnabled, isActive, handleToggle, toggleCornerParticles]);

  // Return null since we're creating the button directly in the DOM
  return null;
};

export default RocketToggle;
