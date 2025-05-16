import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface PremiumBackgroundProps {
  intensity?: number;
}

const PremiumBackground: React.FC<PremiumBackgroundProps> = ({ intensity = 0.8 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { accentColor, theme } = useTheme();
  
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
    
    // Create particles
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.8 
          ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.3 * intensity})` 
          : `rgba(255, 255, 255, ${0.2 * intensity})`;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX;
        }
        
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        ctx!.fillStyle = this.color;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }
    
    const particles: Particle[] = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 20000); // Adjust based on screen size
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Create connections between particles
    const connectParticles = () => {
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx!.strokeStyle = Math.random() > 0.97 
              ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.5 * intensity})` 
              : `rgba(255, 255, 255, ${opacity * 0.1 * intensity})`;
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx!.fillStyle = theme === 'dark' ? 'rgba(8, 8, 12, 0.8)' : 'rgba(245, 245, 250, 0.8)';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw light source
      const gradient = ctx!.createRadialGradient(
        canvas.width / 2, 
        canvas.height / 2, 
        0, 
        canvas.width / 2, 
        canvas.height / 2, 
        canvas.width / 2
      );
      
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.05 * intensity})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      connectParticles();
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle accent color changes
    const handleAccentColorChange = (e: CustomEvent) => {
      const color = e.detail.color;
      const newRgb = hexToRgb(color);
      rgb.r = newRgb.r;
      rgb.g = newRgb.g;
      rgb.b = newRgb.b;
      
      // Update particle colors
      particles.forEach(particle => {
        if (particle.color.includes('rgba(255, 255, 255')) return;
        particle.color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.3 * intensity})`;
      });
    };
    
    document.addEventListener('accentcolorchange', handleAccentColorChange as EventListener);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('accentcolorchange', handleAccentColorChange as EventListener);
    };
  }, [accentColor, theme, intensity]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default PremiumBackground;
