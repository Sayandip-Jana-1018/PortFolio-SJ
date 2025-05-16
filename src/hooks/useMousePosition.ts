import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // Value between -1 and 1
  normalizedY: number; // Value between -1 and 1
}

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const normalizedX = (clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(clientY / window.innerHeight) * 2 + 1;
      
      setMousePosition({
        x: clientX,
        y: clientY,
        normalizedX,
        normalizedY,
      });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
