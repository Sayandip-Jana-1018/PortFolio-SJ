import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface PremiumParticlesProps {
  intensity?: number;
}

const PremiumParticles: React.FC<PremiumParticlesProps> = ({ intensity = 0.7 }) => {
  const { accentColor, theme } = useTheme();
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
    
    // Define shape types
    type ShapeType = 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'star';
    
    // Function to draw different shapes
    const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, type: ShapeType, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      
      switch(type) {
        case 'triangle':
          ctx.moveTo(x, y - size);
          ctx.lineTo(x + size * Math.cos(Math.PI / 6), y + size * Math.sin(Math.PI / 6));
          ctx.lineTo(x - size * Math.cos(Math.PI / 6), y + size * Math.sin(Math.PI / 6));
          break;
          
        case 'square':
          ctx.rect(x - size / 1.5, y - size / 1.5, size * 1.3, size * 1.3);
          break;
          
        case 'pentagon':
          for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          break;
          
        case 'hexagon':
          for (let i = 0; i < 6; i++) {
            const angle = i * 2 * Math.PI / 6;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          break;
          
        case 'star':
          for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5;
            const r = i % 2 === 0 ? size : size / 2;
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
    
    // Create particles
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      shape: ShapeType;
      rotation: number;
      rotationSpeed: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; // Larger particles
        this.speedX = Math.random() * 0.5 - 0.25; // Faster movement
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.7 
          ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.5 * intensity})` // Less visible
          : `rgba(255, 255, 255, ${0.2 * intensity})`;
        
        // Randomly select a shape
        const shapes: ShapeType[] = ['triangle', 'square', 'pentagon', 'hexagon', 'star'];
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Add rotation for more dynamic movement
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX;
        }
        
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate(this.rotation);
        drawShape(ctx!, 0, 0, this.size, this.shape, this.color);
        ctx!.restore();
      }
    }
    
    const particles: Particle[] = [];
    const particleCount = 80; // More particles for a livelier effect
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background with subtle gradient
      const gradient = ctx!.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      
      if (theme === 'dark') {
        gradient.addColorStop(0, `rgba(${rgb.r * 0.2}, ${rgb.g * 0.2}, ${rgb.b * 0.2}, 0.3)`);
        gradient.addColorStop(1, 'rgba(0, 5, 10, 0.2)');
      } else {
        gradient.addColorStop(0, `rgba(${rgb.r * 0.8}, ${rgb.g * 0.8}, ${rgb.b * 0.8}, 0.1)`);
        gradient.addColorStop(1, 'rgba(240, 255, 255, 0.2)');
      }
      
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Connect nearby particles with more visible connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) { // Increased connection distance
            const opacity = 0.3 * intensity * (1 - distance / 150);
            ctx!.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            ctx!.lineWidth = 0.8; // Thicker lines
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
      
      // Add occasional glowing particles
      particles.forEach((particle, index) => {
        if (index % 10 === 0) { // Every 10th particle gets a glow
          ctx!.shadowColor = particle.color;
          ctx!.shadowBlur = 15;
          ctx!.beginPath();
          ctx!.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
          ctx!.fillStyle = particle.color;
          ctx!.fill();
          ctx!.shadowBlur = 0; // Reset shadow
        }
      });
      
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

export default PremiumParticles;
