import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface BackgroundGradientProps {
  intensity?: number;
}

const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ 
  intensity = 0.5 
}) => {
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
    
    // Create gradient
    const drawGradient = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create dark background
      ctx.fillStyle = theme === 'dark' ? '#0a0a0a' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Create radial gradients with accent color
      const gradientPositions = [
        { x: canvas.width * 0.2, y: canvas.height * 0.2, radius: canvas.width * 0.4 },
        { x: canvas.width * 0.8, y: canvas.height * 0.8, radius: canvas.width * 0.4 },
      ];
      
      gradientPositions.forEach(pos => {
        const gradient = ctx.createRadialGradient(
          pos.x, pos.y, 0,
          pos.x, pos.y, pos.radius
        );
        
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${intensity * 0.15})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      
      // Add subtle noise texture
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 5 - 2.5;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      
      ctx.putImageData(imageData, 0, 0);
    };
    
    drawGradient();
    
    // Handle accent color changes
    const handleAccentColorChange = (e: CustomEvent) => {
      const color = e.detail.color;
      const newRgb = hexToRgb(color);
      rgb.r = newRgb.r;
      rgb.g = newRgb.g;
      rgb.b = newRgb.b;
      drawGradient();
    };
    
    document.addEventListener('accentcolorchange', handleAccentColorChange as EventListener);
    document.addEventListener('themechange', drawGradient as EventListener);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('accentcolorchange', handleAccentColorChange as EventListener);
      document.removeEventListener('themechange', drawGradient as EventListener);
    };
  }, [accentColor, theme, intensity]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10 opacity-90"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default BackgroundGradient;
