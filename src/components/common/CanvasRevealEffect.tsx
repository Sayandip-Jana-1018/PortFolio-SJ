"use client";

import { useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface CanvasRevealEffectProps {
  animationSpeed?: number;
  colors?: number[][];
  containerClassName?: string;
  active?: boolean;
  cornerParticles?: boolean;
  onToggleCornerParticles?: () => void;
}

type Shape = 'star' | 'circle' | 'square';

interface Particle {
  x: number
  y: number
  radius: number
  color: string
  speedX: number
  speedY: number
  alpha: number
  shape: 'circle' | 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'star'
}

export const CanvasRevealEffect = ({ 
  animationSpeed = 1, 
  colors = [[255, 215, 0], [255, 165, 0], [255, 140, 0]], 
  containerClassName = "",
  active = false,
  cornerParticles = false,
  onToggleCornerParticles
}: CanvasRevealEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const cornerParticlesLeftRef = useRef<Particle[]>([]);
  const cornerParticlesRightRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const cornerParticlesRef = useRef(cornerParticles);
  const lastTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // Colors
  const colorPalette = colors.map(color => 
    `rgb(${color[0]}, ${color[1]}, ${color[2]})`
  );
  
  const alternateColors = [
    '#FF3366',
    '#36FF33',
    '#3366FF',
    '#FF33FF',
    '#33FFFF',
    '#FFFF33'
  ];

  // Get a random shape for particles
  const getRandomShape = (): 'circle' | 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'star' => {
    const shapes: ('circle' | 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'star')[] = [
      'triangle', 'square', 'pentagon', 'hexagon', 'star'
    ];
    return shapes[Math.floor(Math.random() * shapes.length)];
  };
  
  // Create a particle
  const createParticle = (x: number, y: number): Particle => ({
    x,
    y,
    radius: Math.random() * 4 + 2,
    color: alternateColors[Math.floor(Math.random() * alternateColors.length)],
    speedX: Math.random() * 6 - 3 * animationSpeed,
    speedY: Math.random() * 6 - 3 * animationSpeed,
    alpha: 1,
    shape: getRandomShape()
  });
  
  // Create corner particles shooting diagonally
  const createLeftCornerParticle = (): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return createParticle(0, 0);
    
    const speedFactor = Math.random() * 2 + 2;
    return {
      x: 0,
      y: canvas.height,
      radius: Math.random() * 4 + 2,
      color: alternateColors[Math.floor(Math.random() * alternateColors.length)],
      speedX: speedFactor * (Math.random() * 2 + 1) * animationSpeed,
      speedY: -speedFactor * (Math.random() * 2 + 1) * animationSpeed,
      alpha: 1,
      shape: getRandomShape()
    };
  };
  
  const createRightCornerParticle = (): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return createParticle(0, 0);
    
    const speedFactor = Math.random() * 2 + 2;
    return {
      x: canvas.width,
      y: canvas.height,
      radius: Math.random() * 4 + 2,
      color: alternateColors[Math.floor(Math.random() * alternateColors.length)],
      speedX: -speedFactor * (Math.random() * 2 + 1) * animationSpeed,
      speedY: -speedFactor * (Math.random() * 2 + 1) * animationSpeed,
      alpha: 1,
      shape: getRandomShape()
    };
  };

  // Initialize particles
  const initParticles = (x: number, y: number) => {
    for (let i = 0; i < 30; i++) {
      particlesRef.current.push(createParticle(x, y));
    }
  };

  // Draw a shape based on the shape type
  const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, shape: Particle['shape'], color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    
    switch(shape) {
      case 'circle':
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        break;
      case 'triangle':
        ctx.moveTo(x, y - radius);
        ctx.lineTo(x + radius * Math.cos(Math.PI / 6), y + radius * Math.sin(Math.PI / 6));
        ctx.lineTo(x - radius * Math.cos(Math.PI / 6), y + radius * Math.sin(Math.PI / 6));
        break;
      case 'square':
        ctx.rect(x - radius / 1.5, y - radius / 1.5, radius * 1.3, radius * 1.3);
        break;
      case 'pentagon':
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
          const px = x + radius * Math.cos(angle);
          const py = y + radius * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        break;
      case 'hexagon':
        for (let i = 0; i < 6; i++) {
          const angle = i * 2 * Math.PI / 6;
          const px = x + radius * Math.cos(angle);
          const py = y + radius * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        break;
      case 'star':
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5;
          const r = i % 2 === 0 ? radius : radius / 2;
          const px = x + r * Math.cos(angle);
          const py = y + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        break;
    }
    
    ctx.closePath();
    ctx.fill();
  };

  // Animation function with fixed time step
  const animate = (timestamp = 0) => {
    // Skip animation if particles are disabled
    if (!cornerParticlesRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
      }
      
      // Clear the canvas
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      return;
    }
    
    // Calculate delta time for consistent animation speed
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    // Fixed time step to ensure consistent speed regardless of frame rate
    const timeStep = Math.min(deltaTime / 16.667, 2); // Cap at 2x speed to prevent huge jumps
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw regular particles
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.speedX * timeStep;
      particle.y += particle.speedY * timeStep;
      particle.alpha -= 0.01 * animationSpeed * timeStep;

      const alphaHex = Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
      const color = `${particle.color}${alphaHex}`;
      
      drawShape(ctx, particle.x, particle.y, particle.radius, particle.shape, color);

      return particle.alpha > 0;
    });
    
    // Only process corner particles if explicitly enabled
    if (cornerParticlesRef.current) {
      // Left corner particles
      cornerParticlesLeftRef.current = cornerParticlesLeftRef.current.filter(particle => {
        particle.x += particle.speedX * timeStep;
        particle.y += particle.speedY * timeStep;
        
        // Accelerate particles for dynamic effect
        particle.speedX *= 1.01;
        particle.speedY *= 1.01;
        
        particle.alpha -= 0.01 * animationSpeed * timeStep;

        const alphaHex = Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
        const color = `${particle.color}${alphaHex}`;
        
        drawShape(ctx, particle.x, particle.y, particle.radius, particle.shape, color);

        return particle.alpha > 0 && 
               particle.x > -50 && 
               particle.x < canvas.width + 50 && 
               particle.y > -50 && 
               particle.y < canvas.height + 50;
      });
      
      // Right corner particles
      cornerParticlesRightRef.current = cornerParticlesRightRef.current.filter(particle => {
        particle.x += particle.speedX * timeStep;
        particle.y += particle.speedY * timeStep;
        
        // Accelerate particles for dynamic effect
        particle.speedX *= 1.01;
        particle.speedY *= 1.01;
        
        particle.alpha -= 0.01 * animationSpeed * timeStep;

        const alphaHex = Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
        const color = `${particle.color}${alphaHex}`;
        
        drawShape(ctx, particle.x, particle.y, particle.radius, particle.shape, color);

        return particle.alpha > 0 && 
               particle.x > -50 && 
               particle.x < canvas.width + 50 && 
               particle.y > -50 && 
               particle.y < canvas.height + 50;
      });
    }

    // Continue animation if there are particles to animate
    if (cornerParticlesRef.current || 
        particlesRef.current.length > 0 || 
        cornerParticlesLeftRef.current.length > 0 || 
        cornerParticlesRightRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      animationFrameRef.current = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle click effect
  const startEffect = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    particlesRef.current = [];
    initParticles(x, y);
    
    if (!animationFrameRef.current) {
      animate();
    }
  };

  // Clear all particles and stop animations
  const clearAllParticles = useCallback(() => {
    // Clear all particles
    cornerParticlesLeftRef.current = [];
    cornerParticlesRightRef.current = [];
    particlesRef.current = [];
    
    // Stop animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
    
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  // Start particle generation
  const startParticleGeneration = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Create new interval
    intervalRef.current = setInterval(() => {
      // Skip if particles are disabled
      if (!cornerParticlesRef.current) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }
      
      const count = Math.floor(Math.random() * 3) + 2; // 2-4 particles per interval
      
      for (let i = 0; i < count; i++) {
        cornerParticlesLeftRef.current.push(createLeftCornerParticle());
        cornerParticlesRightRef.current.push(createRightCornerParticle());
      }
      
      // Start animation if not already running
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    }, 300);
    
    return intervalRef.current;
  }, [animationSpeed]);

  // Update corner particles state when the cornerParticles prop changes
  useEffect(() => {
    cornerParticlesRef.current = cornerParticles;
    
    if (cornerParticles) {
      // Initialize corner particles
      const canvas = canvasRef.current;
      if (canvas) {
        // Clear existing particles first
        cornerParticlesLeftRef.current = [];
        cornerParticlesRightRef.current = [];
        
        // Add particles from both corners
        for (let i = 0; i < 15; i++) {
          cornerParticlesLeftRef.current.push({
            x: 20,
            y: canvas.height - 20,
            radius: Math.random() * 4 + 2,
            color: alternateColors[Math.floor(Math.random() * alternateColors.length)],
            speedX: (Math.random() * 2 + 1) * animationSpeed,
            speedY: -(Math.random() * 2 + 1) * animationSpeed,
            alpha: 1,
            shape: getRandomShape()
          });
          
          cornerParticlesRightRef.current.push({
            x: canvas.width - 20,
            y: canvas.height - 20,
            radius: Math.random() * 4 + 2,
            color: alternateColors[Math.floor(Math.random() * alternateColors.length)],
            speedX: -(Math.random() * 2 + 1) * animationSpeed,
            speedY: -(Math.random() * 2 + 1) * animationSpeed,
            alpha: 1,
            shape: getRandomShape()
          });
        }
      }
      
      // Start animation and particle generation
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
      startParticleGeneration();
    } else {
      // Clear particles and stop animation
      clearAllParticles();
    }
  }, [cornerParticles, clearAllParticles, startParticleGeneration, animationSpeed]);

  // Listen for global particle toggle events
  useEffect(() => {
    const handleParticlesToggle = (event: CustomEvent) => {
      const enabled = event.detail?.enabled;
      cornerParticlesRef.current = enabled;
      
      if (!enabled) {
        clearAllParticles();
      } else if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        startParticleGeneration();
      }
    };
    
    window.addEventListener('particles-toggle-event', handleParticlesToggle as EventListener);
    
    return () => {
      window.removeEventListener('particles-toggle-event', handleParticlesToggle as EventListener);
    };
  }, [clearAllParticles, startParticleGeneration]);

  // Initial confetti effect - only on first render
  useEffect(() => {
    if (active && isFirstRender.current) {
      // Only run confetti on first render (page load)
      isFirstRender.current = false;
      
      const launchConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 0.5, y: 0.5 },
          colors: colorPalette,
          startVelocity: 30,
          gravity: 0.8,
          scalar: 1.2,
          ticks: 200
        });
      };
      
      launchConfetti();
    }
  }, [active, colorPalette]);

  return (
    <>
      <div className={containerClassName || "h-full w-full relative overflow-hidden"}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
          onClick={startEffect}
        />
      </div>
      
      {/* Rocket Toggle Button removed as requested */}
    </>
  );
};

// Also export as default for backward compatibility
export default CanvasRevealEffect;