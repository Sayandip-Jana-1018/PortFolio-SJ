import { useEffect, useState, useRef } from 'react';

type ShapeType = 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'star';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  opacity: number;
  shape: ShapeType;
  rotation: number;
  rotationSpeed: number;
}

export const useParticles = (count: number = 20, accentColor: string) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    
    // Available shape types
    const shapes: ShapeType[] = ['triangle', 'square', 'pentagon', 'hexagon', 'star'];
    
    // Create initial particles with shapes
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 1,
        color: i % 3 === 0 ? accentColor : 'rgba(255, 255, 255, 0.2)', // Reduced opacity
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.3 + 0.05, // Reduced opacity
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }
    
    setParticles(newParticles);
    
    // Animation loop
    const animate = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Update position
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;
          
          // Update rotation
          let newRotation = particle.rotation + particle.rotationSpeed;
          
          // Bounce off edges
          if (newX > width || newX < 0) {
            particle.speedX *= -1;
            newX = particle.x + particle.speedX;
          }
          
          if (newY > height || newY < 0) {
            particle.speedY *= -1;
            newY = particle.y + particle.speedY;
          }
          
          return {
            ...particle,
            x: newX,
            y: newY,
            rotation: newRotation
          };
        })
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    const animationRef = { current: requestAnimationFrame(animate) };
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [count, accentColor]);
  
  return { particles, containerRef };
};

export const useMagneticEffect = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const maxDistance = 100;
      
      if (distance < maxDistance) {
        const power = 15; // Magnetic power
        const magnetX = (distanceX / maxDistance) * power;
        const magnetY = (distanceY / maxDistance) * power;
        
        element.style.transform = `translate(${magnetX}px, ${magnetY}px)`;
      } else {
        element.style.transform = 'translate(0, 0)';
      }
    };
    
    const handleMouseLeave = () => {
      element.style.transform = 'translate(0, 0)';
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return elementRef;
};

export const useCustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'A' || 
          (e.target as HTMLElement).tagName === 'BUTTON' ||
          (e.target as HTMLElement).closest('a') ||
          (e.target as HTMLElement).closest('button')) {
        cursor.classList.add('hover');
      }
    };
    
    const handleMouseOut = () => {
      cursor.classList.remove('hover');
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);
  
  return cursorRef;
};

export const useRevealOnScroll = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isIntersecting && ref.current) {
      ref.current.classList.add('reveal-visible');
    }
  }, [isIntersecting]);
  
  return { ref, isIntersecting };
};

export const useParallax = (speed: number = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const scrollY = window.scrollY;
      const yPos = -scrollY * speed;
      ref.current.style.transform = `translate3d(0, ${yPos}px, 0)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);
  
  return ref;
};
