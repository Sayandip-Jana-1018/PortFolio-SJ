import { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, PerspectiveCamera, useEnvironment } from '@react-three/drei';
import { HiExclamation, HiOutlineRefresh, HiCheck, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';
import type { Mesh, Material, Object3D, Group, Vector3 } from 'three';

interface VirtualCoachProps {
  modelUrl: string;
  className?: string;
  sessionResults?: any;
}

interface ModelProps {
  url: string;
  mousePosition: { x: number; y: number };
}

// Preload the model to avoid loading delays
function Model({ url, mousePosition }: ModelProps) {
  const { scene } = useGLTF(url, true); // true enables preloading
  const modelRef = useRef<Group>(null);
  const { viewport } = useThree();
  
  // Performance optimization: use a lower frequency for animation updates
  const frameSkip = useRef(0);
  const lastRotationY = useRef(0);
  const lastRotationX = useRef(0);
  
  // Respond to mouse movements and add breathing animation with reduced frequency
  useFrame(({ clock }) => {
    // Skip frames for better performance (especially on mobile)
    frameSkip.current = (frameSkip.current + 1) % 2;
    if (frameSkip.current !== 0) return;
    
    if (modelRef.current) {
      // Breathing animation - lower frequency
      const t = clock.getElapsedTime();
      const breathingIntensity = 0.03; // Reduced intensity
      
      // Convert mouse position to model rotation with damping
      const targetRotationY = (mousePosition.x - 0.5) * 0.3; // Reduced range
      const targetRotationX = (mousePosition.y - 0.5) * 0.2; // Reduced range
      
      // Smoothly interpolate with stronger damping for stability
      lastRotationY.current = lastRotationY.current + (targetRotationY - lastRotationY.current) * 0.03;
      lastRotationX.current = lastRotationX.current + (targetRotationX - lastRotationX.current) * 0.03;
      
      modelRef.current.rotation.y = lastRotationY.current;
      modelRef.current.rotation.x = lastRotationX.current;
      
      // Add breathing animation with reduced calculations
      modelRef.current.position.y = Math.sin(t * 0.3) * breathingIntensity;
      // Skip scale changes on mobile for better performance
      if (window.innerWidth > 768) {
        const breathScale = 1 + Math.sin(t * 0.3) * 0.01;
        modelRef.current.scale.set(breathScale, breathScale, breathScale);
      }
    }
  });

  useEffect(() => {
    if (scene) {
      // Center the model properly
      scene.position.set(0, -0.5, 0);
      // Apply consistent scale
      scene.scale.set(1, 1, 1);
      
      // Traverse the scene to adjust materials if needed
      scene.traverse((obj: Object3D) => {
        const mesh = obj as Mesh;
        if (mesh.isMesh && mesh.material) {
          // Ensure materials have proper transparency settings if needed
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat: Material) => {
              if (mat.transparent) {
                mat.depthWrite = false;
              }
            });
          } else if (mesh.material.transparent) {
            mesh.material.depthWrite = false;
          }
        }
      });
    }

    return () => {
      // Clean up loaded model
      if (scene) {
        scene.traverse((obj: Object3D) => {
          const mesh = obj as Mesh;
          if (mesh.isMesh) {
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((mat: Material) => mat.dispose());
            } else if (mesh.material) {
              mesh.material.dispose();
            }
          }
        });
      }
    };
  }, [scene]);

  return <primitive ref={modelRef} object={scene} position={[0, -0.5, 0]} />;
}

// Custom environment component with fallbacks
function SafeEnvironment() {
  // Use a simple lighting setup instead of HDR environment
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#8a6cff" />
      <hemisphereLight intensity={0.3} color="#ffffff" groundColor="#000000" />
    </>
  );
}

export default function VirtualCoach({ modelUrl, className = '', sessionResults }: VirtualCoachProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Only render on client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track mouse position for model movement
  const handleMouseMove = (e: MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  };

  useEffect(() => {
    if (!isMounted) return;
    
    // Check if model file exists
    fetch(modelUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load virtual coach model');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading virtual coach:', err);
        setError('Failed to load virtual coach model');
        setIsLoading(false);
      });
      
    // Add mouse move event listener
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
    }
    
    // Add global error handler for THREE.js errors
    const handleGlobalError = (event: ErrorEvent) => {
      if (
        event.message && 
        (event.message.includes('THREE.WebGLRenderer: Context Lost') || 
         event.message.includes('Could not load') || 
         event.message.includes('Failed to fetch'))
      ) {
        console.warn('Caught WebGL error:', event.message);
        // Prevent the error from breaking the app
        event.preventDefault();
        return true;
      }
      return false;
    };
    
    window.addEventListener('error', handleGlobalError, true);
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('error', handleGlobalError, true);
    };
  }, [modelUrl, isMounted]);

  // Don't render anything on server-side
  if (!isMounted) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        role="alert"
        aria-live="polite"
      >
        <div className="text-center space-y-2">
          <HiExclamation className="w-8 h-8 text-red-500 mx-auto" aria-hidden="true" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      aria-label="Virtual coach visualization"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      
      <Canvas
        className="rounded-xl overflow-hidden bg-transparent"
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Model url={modelUrl} mousePosition={mousePosition} />
          <SafeEnvironment />
          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            enableRotate={false}
            minPolarAngle={Math.PI / 2 - 0.5}
            maxPolarAngle={Math.PI / 2 + 0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
