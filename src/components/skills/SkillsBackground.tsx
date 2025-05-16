import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const SkillsBackground: React.FC = () => {
  const { theme, accentColor } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Parse accent color to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
    
    const rgb = hexToRgb(accentColor);
    
    // Define particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      shape: string;
      rotation: number;
      rotationSpeed: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        
        // Determine if this particle will be accent-colored or theme-colored
        const useAccent = Math.random() > 0.7;
        
        if (useAccent) {
          this.color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.random() * 0.2 + 0.1})`;
        } else {
          this.color = theme === 'dark' 
            ? `rgba(255, 255, 255, ${Math.random() * 0.15 + 0.05})`
            : `rgba(0, 0, 0, ${Math.random() * 0.1 + 0.05})`;
        }
        
        // Randomly select shape
        const shapes = ['circle', 'square', 'triangle', 'line'];
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Add rotation for non-circular shapes
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        
        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw() {
        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate(this.rotation);
        ctx!.fillStyle = this.color;
        ctx!.strokeStyle = this.color;
        ctx!.lineWidth = this.size / 3;
        
        switch(this.shape) {
          case 'circle':
            ctx!.beginPath();
            ctx!.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx!.fill();
            break;
            
          case 'square':
            ctx!.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
            break;
            
          case 'triangle':
            ctx!.beginPath();
            ctx!.moveTo(0, -this.size);
            ctx!.lineTo(this.size, this.size);
            ctx!.lineTo(-this.size, this.size);
            ctx!.closePath();
            ctx!.fill();
            break;
            
          case 'line':
            ctx!.beginPath();
            ctx!.moveTo(-this.size * 2, 0);
            ctx!.lineTo(this.size * 2, 0);
            ctx!.stroke();
            break;
        }
        
        ctx!.restore();
      }
    }
    
    // Create particles
    const particles: Particle[] = [];
    const particleCount = Math.min(100, Math.floor(window.innerWidth * window.innerHeight / 10000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Connect nearby particles with lines
      connectParticles();
      
      requestAnimationFrame(animate);
    };
    
    // Connect particles that are close to each other
    const connectParticles = () => {
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            // Calculate opacity based on distance
            const opacity = 1 - (distance / maxDistance);
            
            ctx!.beginPath();
            ctx!.strokeStyle = theme === 'dark' 
              ? `rgba(255, 255, 255, ${opacity * 0.05})`
              : `rgba(0, 0, 0, ${opacity * 0.03})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme, accentColor]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
};

export default SkillsBackground;
