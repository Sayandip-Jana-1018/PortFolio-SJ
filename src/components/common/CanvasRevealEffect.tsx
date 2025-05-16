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
  // Debug the props
  console.log('CanvasRevealEffect rendered with props:', { active, cornerParticles });
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const cornerParticlesLeftRef = useRef<Particle[]>([])
  const cornerParticlesRightRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)

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
  
  const createParticle = (x: number, y: number): Particle => ({
    x,
    y,
    radius: Math.random() * 4 + 2, // Increased size
    color: alternateColors[Math.floor(Math.random() * alternateColors.length)],
    speedX: Math.random() * 6 - 3 * animationSpeed,
    speedY: Math.random() * 6 - 3 * animationSpeed,
    alpha: 1,
    shape: getRandomShape()
  })
  
  // Create corner particles shooting diagonally
  const createLeftCornerParticle = (): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return createParticle(0, 0);
    
    const speedFactor = Math.random() * 2 + 2;
    return {
      x: 0,
      y: canvas.height,
      radius: Math.random() * 4 + 2, // Increased size
      color: alternateColors[Math.floor(Math.random() * alternateColors.length)],
      speedX: speedFactor * (Math.random() * 2 + 1) * animationSpeed,
      speedY: -speedFactor * (Math.random() * 2 + 1) * animationSpeed,
      alpha: 1,
      shape: getRandomShape()
    };
  }
  
  const createRightCornerParticle = (): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return createParticle(0, 0);
    
    const speedFactor = Math.random() * 2 + 2;
    return {
      x: canvas.width,
      y: canvas.height,
      radius: Math.random() * 4 + 2, // Increased size
      color: alternateColors[Math.floor(Math.random() * alternateColors.length)],
      speedX: -speedFactor * (Math.random() * 2 + 1) * animationSpeed,
      speedY: -speedFactor * (Math.random() * 2 + 1) * animationSpeed,
      alpha: 1,
      shape: getRandomShape()
    };
  }

  const initParticles = (x: number, y: number) => {
    for (let i = 0; i < 30; i++) {
      particlesRef.current.push(createParticle(x, y))
    }
  }

  // Define shape types
  type ParticleShape = 'circle' | 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'star';

  // Draw a shape based on the shape type
  const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, shape: ParticleShape, color: string) => {
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

  const animate = () => {
    // If particles are disabled, don't animate
    if (!cornerParticlesRef.current) {
      console.log('Animation stopped - particles disabled via ref check');
      // Clear any ongoing animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
      }
      
      // Clear the canvas immediately
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      return;
    }
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw regular particles with various shapes
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.speedX
      particle.y += particle.speedY
      particle.alpha -= 0.01 * animationSpeed

      const alphaHex = Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
      const color = `${particle.color}${alphaHex}`;
      
      // Draw the shape based on the particle's shape property
      drawShape(ctx, particle.x, particle.y, particle.radius, 
               (particle as any).shape || 'circle', color);

      return particle.alpha > 0
    })
    
    // Only process corner particles if explicitly enabled - check the ref
    if (cornerParticlesRef.current) {
      // Left corner particles
      cornerParticlesLeftRef.current = cornerParticlesLeftRef.current.filter(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // Accelerate particles for dynamic effect
        particle.speedX *= 1.01
        particle.speedY *= 1.01
        
        particle.alpha -= 0.01 * animationSpeed

        const alphaHex = Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
        const color = `${particle.color}${alphaHex}`;
        
        // Draw the shape based on the particle's shape property
        drawShape(ctx, particle.x, particle.y, particle.radius, 
                 (particle as any).shape || 'circle', color);

        return particle.alpha > 0 && 
               particle.x > -50 && 
               particle.x < canvas.width + 50 && 
               particle.y > -50 && 
               particle.y < canvas.height + 50
      })
      
      // Right corner particles
      cornerParticlesRightRef.current = cornerParticlesRightRef.current.filter(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // Accelerate particles for dynamic effect
        particle.speedX *= 1.01
        particle.speedY *= 1.01
        
        particle.alpha -= 0.01 * animationSpeed

        const alphaHex = Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
        const color = `${particle.color}${alphaHex}`;
        
        // Draw the shape based on the particle's shape property
        drawShape(ctx, particle.x, particle.y, particle.radius, 
                 (particle as any).shape || 'circle', color);

        return particle.alpha > 0 && 
               particle.x > -50 && 
               particle.x < canvas.width + 50 && 
               particle.y > -50 && 
               particle.y < canvas.height + 50
      })
    } else {
      // If particles are disabled, clear them immediately
      cornerParticlesLeftRef.current = [];
      cornerParticlesRightRef.current = [];
      particlesRef.current = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Only continue animation if particles are enabled and there are particles to animate
    if (cornerParticlesRef.current && (particlesRef.current.length > 0 || 
        cornerParticlesLeftRef.current.length > 0 || 
        cornerParticlesRightRef.current.length > 0)) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      console.log('Animation stopped - no particles to animate or particles disabled');
      animationFrameRef.current = 0;
      
      // Clear the canvas one final time
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const startEffect = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    particlesRef.current = []
    initParticles(x, y)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    animate()
  }

  // Immediately clear particles when cornerParticles is toggled off
  useEffect(() => {
    console.log('Particle state changed:', { cornerParticles, active });
    
    if (!cornerParticles) {
      console.log('Particles turned OFF - clearing all particles');
      // Clear all existing particles
      cornerParticlesLeftRef.current = [];
      cornerParticlesRightRef.current = [];
      particlesRef.current = [];
      
      // Cancel any ongoing animation
      if (animationFrameRef.current) {
        console.log('Canceling animation frame:', animationFrameRef.current);
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = 0;
      }
    }
  }, [cornerParticles, active]);

  // Store the cornerParticles state in a ref to access it in callbacks
  const cornerParticlesRef = useRef(cornerParticles);
  
  // Function to clear all particles and stop animations
  const clearAllParticles = useCallback(() => {
    console.log('Clearing all particles and stopping animations');
    
    // Stop any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
    
    // Clear all particles
    cornerParticlesLeftRef.current = [];
    cornerParticlesRightRef.current = [];
    particlesRef.current = [];
    
    // Force clear the canvas immediately
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        console.log('Force clearing canvas');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    
    // Force a redraw of the entire page to clear any stuck particles
    setTimeout(() => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          console.log('Secondary canvas clearing');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    }, 50);
  }, []);
  
  // Function to force clear the canvas completely
  const forceCanvasClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas multiple times to ensure all pixels are cleared
    for (let i = 0; i < 3; i++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Try to force a repaint by temporarily changing canvas properties
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    canvas.width = originalWidth + 1;
    canvas.height = originalHeight + 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = originalWidth;
    canvas.height = originalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    console.log('Forced complete canvas clearing');
  }, []);

  // Listen for global particle toggle events
  useEffect(() => {
    const handleParticlesToggle = (event: CustomEvent) => {
      const enabled = event.detail?.enabled;
      console.log('Received particles toggle event:', enabled);
      cornerParticlesRef.current = enabled;
      
      if (!enabled) {
        // Immediately clear all particles and stop animations
        clearAllParticles();
        
        // Force an aggressive canvas clear
        forceCanvasClear();
        
        // Schedule another clearing after a short delay to catch any stragglers
        setTimeout(() => {
          forceCanvasClear();
          console.log('Secondary forced clearing complete');
        }, 100);
      } else {
        // Restart particles when enabled
        console.log('Particles enabled - restarting generation');
        // Force restart the animation loop if it's not running
        if (!animationFrameRef.current) {
          console.log('Restarting animation frame');
          animationFrameRef.current = requestAnimationFrame(animate);
        }
        
        // Force restart the interval if it's not running
        if (!intervalRef.current) {
          console.log('Restarting particle interval');
          startParticleGeneration();
        }
      }
    };
    
    // Add event listener
    window.addEventListener('particles-toggle-event', handleParticlesToggle as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('particles-toggle-event', handleParticlesToggle as EventListener);
    };
  }, [clearAllParticles, forceCanvasClear]);
  
  // Update the ref whenever the prop changes
  useEffect(() => {
    console.log('cornerParticles prop changed:', cornerParticles);
    cornerParticlesRef.current = cornerParticles;
    
    // When particles are turned off, immediately clear everything
    if (!cornerParticles) {
      clearAllParticles();
    }
  }, [cornerParticles, clearAllParticles]);
  
  // Reference to store the interval ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to start particle generation
  const startParticleGeneration = useCallback(() => {
    console.log('Starting particle generation function called');
    
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Create new interval with higher frequency and more particles
    intervalRef.current = setInterval(() => {
      // Check the current state using the ref
      if (!cornerParticlesRef.current) {
        console.log('Particles disabled - stopping interval');
        stopAllParticles();
        return;
      }
      
      // Increased particle count (5-10 particles per interval)
      const count = Math.floor(Math.random() * 6) + 5;
      
      for (let i = 0; i < count; i++) {
        cornerParticlesLeftRef.current.push(createLeftCornerParticle());
        cornerParticlesRightRef.current.push(createRightCornerParticle());
      }
      
      // Start animation if not already running
      if (animationFrameRef.current === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    }, 300); // Reduced interval time for more frequent particles
    
    return intervalRef.current;
  }, []);
  
  // Function to stop all particle generation and animation
  const stopAllParticles = useCallback(() => {
    // Clear the interval
    if (intervalRef.current) {
      console.log('Stopping particle interval');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Clear all particles
    cornerParticlesLeftRef.current = [];
    cornerParticlesRightRef.current = [];
    particlesRef.current = [];
    
    // Cancel animation frame
    if (animationFrameRef.current) {
      console.log('Canceling animation frame');
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
  }, []);

  // Create corner particles at intervals
  useEffect(() => {
    // Clean up any existing interval first
    stopAllParticles();
    
    // Only create particles if explicitly enabled
    if (active && cornerParticles) {
      console.log('Starting particle generation');
      startParticleGeneration();
      
      // Return cleanup function
      return stopAllParticles;
    }
    
    return () => {};
  }, [active, cornerParticles, animationSpeed, startParticleGeneration, stopAllParticles]);

  // Track if this is the first render (page load)
  const isFirstRender = useRef(true);
  
  useEffect(() => {
    if (active && isFirstRender.current) {
      // Only run confetti on first render (page refresh)
      isFirstRender.current = false;
      
      const launchConfetti = () => {
        const end = Date.now() + 2000;

        // Function to create random shapes
        const getRandomShape = (): Shape => {
          const shapes: Shape[] = ['star', 'circle', 'square'];
          return shapes[Math.floor(Math.random() * shapes.length)];
        };

        // Immediately launch initial confetti burst
        const launchInitialBurst = () => {
          // Center burst
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
          
          // Side bursts
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.5 },
            colors: colorPalette
          });
          
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.5 },
            colors: colorPalette
          });
        };

        // Ribbon effect
        const launchRibbons = () => {
          confetti({
            particleCount: 10,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.9 },
            colors: colorPalette,
            startVelocity: 45,
            scalar: 0.7,
            gravity: 0.6,
            drift: 0.5,
            ticks: 200
          });
          confetti({
            particleCount: 10,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.9 },
            colors: colorPalette,
            startVelocity: 45,
            scalar: 0.7,
            gravity: 0.6,
            drift: -0.5,
            ticks: 200
          });
        };
        
        // Launch initial burst immediately
        launchInitialBurst();
        
        // Continue with interval-based effects
        const interval = setInterval(() => {
          if (Date.now() > end) {
            return clearInterval(interval);
          }

          // Multiple burst points with different shapes
          [0.2, 0.4, 0.6, 0.8].forEach(x => {
            // Stars and circles burst
            confetti({
              particleCount: 8,
              spread: 45,
              origin: { x, y: 0.7 },
              colors: colorPalette,
              shapes: [getRandomShape()],
              scalar: 0.75,
              ticks: 150,
              startVelocity: 25,
              gravity: 0.9,
              drift: Math.random() - 0.5,
              disableForReducedMotion: true
            });

            // Balloon-like floating particles
            confetti({
              particleCount: 3,
              spread: 30,
              origin: { x: x - 0.1, y: 0.8 },
              colors: colorPalette,
              shapes: ['circle'],
              scalar: 1.2,
              ticks: 200,
              startVelocity: 15,
              gravity: 0.4,
              drift: Math.random() * 2 - 1,
              disableForReducedMotion: true
            });
          });

          // Launch ribbons every few bursts
          if (Math.random() > 0.7) {
            launchRibbons();
          }
        }, 100);

        return () => clearInterval(interval);
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
      
      {/* Rocket Toggle Button - Separate from canvas container */}
      {onToggleCornerParticles && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleCornerParticles) onToggleCornerParticles();
          }}
          className="fixed bottom-8 right-8 z-[9999] bg-red-600 bg-opacity-90 backdrop-blur-md text-white p-4 rounded-full shadow-2xl hover:bg-opacity-100 transition-all duration-300 border-2 border-white hover:scale-110 pointer-events-auto animate-pulse"
          title={cornerParticles ? "Turn off particles" : "Turn on particles"}
          style={{
            boxShadow: `0 0 20px 5px ${cornerParticles ? 'rgba(255,0,0,0.6)' : 'rgba(255,255,255,0.4)'}`
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill={cornerParticles ? "#00ffcc" : "#888888"}
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M6 11h12M12 5v12M8 5.5l8 13M16 5.5l-8 13" />
            <path d="M12 2L2 12l10 10 10-10L12 2z" />
          </svg>
        </button>
      )}
    </>
  )
};

// Also export as default for backward compatibility
export default CanvasRevealEffect;
