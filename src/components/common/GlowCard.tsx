import React, { useRef, useCallback } from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
  style?: React.CSSProperties;
}

/**
 * Apple-style spotlight card effect.
 * A radial gradient follows the mouse cursor within the card boundary.
 * Pure CSS custom properties + single pointermove listener.
 */
const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor,
  glowSize = 250,
  style,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--glow-x', `${x}px`);
    card.style.setProperty('--glow-y', `${y}px`);
    card.style.setProperty('--glow-opacity', '1');
  }, []);

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--glow-opacity', '0');
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glow-card ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-opacity': '0',
        '--glow-color': glowColor || 'var(--color-accent, #00d4ff)',
        '--glow-size': `${glowSize}px`,
        ...style,
      } as React.CSSProperties}
    >
      {/* Glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: 'var(--glow-opacity)' as any,
          background: `radial-gradient(var(--glow-size) circle at var(--glow-x) var(--glow-y), var(--glow-color)20, transparent 60%)`,
        }}
      />
      {/* Border glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: 'var(--glow-opacity)' as any,
          background: `radial-gradient(calc(var(--glow-size) * 0.6) circle at var(--glow-x) var(--glow-y), var(--glow-color)30, transparent 60%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlowCard;
