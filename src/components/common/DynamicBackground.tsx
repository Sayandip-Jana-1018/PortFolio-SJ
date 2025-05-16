import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface DynamicBackgroundProps {
  intensity?: number;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ intensity = 1.0 }) => {
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
    const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, type: ShapeType, color: string, isStroke: boolean = true) => {
      if (isStroke) {
        ctx.strokeStyle = color;
      } else {
        ctx.fillStyle = color;
      }
      
      ctx.beginPath();
      
      switch(type) {
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
      if (isStroke) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
    };
    
    // Create wave effect
    class Wave {
      x: number;
      y: number;
      radius: number;
      initialRadius: number;
      maxRadius: number;
      opacity: number;
      color: string;
      shape: ShapeType;
      rotation: number;
      rotationSpeed: number;
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.initialRadius = Math.random() * 20 + 10;
        this.radius = this.initialRadius;
        this.maxRadius = Math.random() * 100 + 100;
        this.opacity = Math.random() * 0.3 + 0.1; // Reduced opacity
        this.color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.opacity * intensity})`;
        
        // Randomly select a shape
        const shapes: ShapeType[] = ['triangle', 'square', 'pentagon', 'hexagon', 'star'];
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Add rotation for more dynamic movement
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      }
      
      update() {
        if (this.radius < this.maxRadius) {
          this.radius += 0.5;
          this.opacity -= 0.003;
          this.rotation += this.rotationSpeed;
        } else {
          this.radius = this.initialRadius;
          this.opacity = Math.random() * 0.3 + 0.1; // Reduced opacity
        }
      }
      
      draw() {
        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate(this.rotation);
        ctx!.strokeStyle = this.color;
        ctx!.lineWidth = 1.5; // Thinner lines
        drawShape(ctx!, 0, 0, this.radius, this.shape, this.color, true);
        ctx!.restore();
      }
    }
    
    // Create waves
    let waves: Wave[] = [];
    const waveCount = 8; // Increased count for better spread
    
    // Function to create new waves with random positions and shapes
    const createWaves = () => {
      waves = [];
      for (let i = 0; i < waveCount; i++) {
        // Spread waves across the canvas more evenly by dividing it into sections
        const sectionWidth = canvas.width / 3;
        const sectionHeight = canvas.height / 3;
        
        // Calculate position to ensure better distribution
        const sectionX = i % 3;
        const sectionY = Math.floor(i / 3) % 3;
        
        const x = sectionX * sectionWidth + Math.random() * sectionWidth;
        const y = sectionY * sectionHeight + Math.random() * sectionHeight;
        
        waves.push(new Wave(x, y));
      }
    };
    
    // Initial creation
    createWaves();
    
    // Reset waves every 4-5 seconds
    const resetInterval = setInterval(() => {
      createWaves();
    }, 4000 + Math.random() * 1000);
    
    // Create light beams
    class LightBeam {
      x: number;
      y: number;
      length: number;
      angle: number;
      speed: number;
      width: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = Math.random() * 200 + 100;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.01 + 0.005;
        this.width = Math.random() * 2 + 1;
        this.color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.1 * intensity})`;
      }
      
      update() {
        this.angle += this.speed;
        if (this.angle > Math.PI * 2) {
          this.angle = 0;
        }
      }
      
      draw() {
        const endX = this.x + Math.cos(this.angle) * this.length;
        const endY = this.y + Math.sin(this.angle) * this.length;
        
        ctx!.strokeStyle = this.color;
        ctx!.lineWidth = this.width;
        ctx!.beginPath();
        ctx!.moveTo(this.x, this.y);
        ctx!.lineTo(endX, endY);
        ctx!.stroke();
      }
    }
    
    // Create light beams
    const beams: LightBeam[] = [];
    const beamCount = 8;
    
    for (let i = 0; i < beamCount; i++) {
      beams.push(new LightBeam());
    }
    
    // Animation loop
    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw waves
      waves.forEach(wave => {
        wave.update();
        wave.draw();
      });
      
      // Draw light beams
      beams.forEach(beam => {
        beam.update();
        beam.draw();
      });
      
      // Draw subtle gradient overlay
      const gradient = ctx!.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.03 * intensity})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      
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
      
      // Update colors
      waves.forEach(wave => {
        wave.color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${wave.opacity * intensity})`;
      });
      
      beams.forEach(beam => {
        beam.color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.1 * intensity})`;
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
      className="fixed inset-0 -z-20"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default DynamicBackground;
