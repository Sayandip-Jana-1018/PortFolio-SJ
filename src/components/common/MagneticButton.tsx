import React, { useRef, useCallback } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  as?: 'button' | 'a' | 'div';
  href?: string;
  [key: string]: any;
}

/**
 * Magnetic hover button — subtly follows the mouse within a radius.
 * Pure CSS transforms, no heavy physics.
 */
const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 12,
  radius = 120,
  style,
  onClick,
  as: Tag = 'button',
  ...rest
}) => {
  const ref = useRef<HTMLElement>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < radius) {
      const factor = 1 - dist / radius;
      const mx = dx * factor * (strength / 100);
      const my = dy * factor * (strength / 100);
      el.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    }
  }, [strength, radius]);

  const handlePointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate3d(0, 0, 0)';
    el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    setTimeout(() => {
      if (el) el.style.transition = '';
    }, 400);
  }, []);

  return (
    <Tag
      ref={ref as any}
      className={`magnetic-btn ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      style={{ willChange: 'transform', ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default MagneticButton;
