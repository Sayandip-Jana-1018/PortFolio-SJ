/**
 * Adaptive Performance Tier Detection
 * Classifies device capability: 'high' | 'medium' | 'low'
 * Used to conditionally reduce effects on weaker devices.
 */

export type PerformanceTier = 'high' | 'medium' | 'low';

let cachedTier: PerformanceTier | null = null;

export function getPerformanceTier(): PerformanceTier {
  if (cachedTier) return cachedTier;
  if (typeof window === 'undefined') return 'high';

  let score = 0;

  // CPU cores
  const cores = navigator.hardwareConcurrency || 2;
  if (cores >= 8) score += 3;
  else if (cores >= 4) score += 2;
  else score += 0;

  // Device memory (Chrome-only API)
  const mem = (navigator as any).deviceMemory;
  if (mem) {
    if (mem >= 8) score += 3;
    else if (mem >= 4) score += 2;
    else score += 0;
  } else {
    score += 1; // Unknown, assume mid
  }

  // Touch device heuristic (likely mobile)
  const isTouch = matchMedia('(hover: none)').matches;
  if (isTouch) score -= 1;

  // Screen size heuristic
  const w = window.screen.width * (window.devicePixelRatio || 1);
  if (w < 1200) score -= 1;

  // Connection speed
  const conn = (navigator as any).connection;
  if (conn) {
    const ect = conn.effectiveType;
    if (ect === 'slow-2g' || ect === '2g') score -= 2;
    else if (ect === '3g') score -= 1;
  }

  // GPU detection via WebGL
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const ext = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (ext) {
        const renderer = (gl as WebGLRenderingContext).getParameter(ext.UNMASKED_RENDERER_WEBGL) || '';
        const rendererLower = renderer.toLowerCase();
        // Dedicated GPUs
        if (/nvidia|geforce|rtx|gtx|radeon|rx\s?\d/i.test(rendererLower)) {
          score += 3;
        }
        // Integrated but decent
        else if (/intel.*iris|apple.*gpu|mali-g7/i.test(rendererLower)) {
          score += 1;
        }
        // SwiftShader or software renderer
        else if (/swiftshader|software|llvmpipe/i.test(rendererLower)) {
          score -= 3;
        }
      }
    }
  } catch {}

  // Classify
  if (score >= 6) cachedTier = 'high';
  else if (score >= 3) cachedTier = 'medium';
  else cachedTier = 'low';

  return cachedTier;
}

/**
 * React hook for performance tier
 */
import { useState, useEffect } from 'react';

export function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>('high');

  useEffect(() => {
    setTier(getPerformanceTier());
  }, []);

  return tier;
}

/**
 * Configuration presets per tier
 */
export const tierConfig = {
  high: {
    dpr: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 2, 2),
    shaderDetail: 3,
    particleCount: 50,
    canvasEnabled: true,
    fps: 60,
  },
  medium: {
    dpr: 1.5,
    shaderDetail: 2,
    particleCount: 20,
    canvasEnabled: true,
    fps: 30,
  },
  low: {
    dpr: 1,
    shaderDetail: 2,
    particleCount: 10,
    canvasEnabled: true, // Still show lightweight effects
    fps: 24,
  },
} as const;
