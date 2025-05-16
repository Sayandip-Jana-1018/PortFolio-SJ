import React, { Suspense, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, Html } from "@react-three/drei";
import CanvasLoader from "./CanvasLoader";
import Ball from "./Ball";

interface BallCanvasProps {
  icon: ReactNode;
  name?: string;
  color?: string;
}

const BallCanvas = ({ icon, name, color }: BallCanvasProps) => {
  return (
    <div className="relative w-full h-full">
      <Canvas
        frameloop='demand'
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 4], fov: 40 }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            rotateSpeed={0.7}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
          <ambientLight intensity={0.4} />
          <directionalLight position={[0, 0, 0.05]} intensity={0.5} />
          <mesh castShadow receiveShadow scale={1.8}>
            <icosahedronGeometry args={[1, 2]} />
            <meshStandardMaterial 
              color={color || "#8352FD"}
              polygonOffset
              polygonOffsetFactor={-5}
              flatShading
              roughness={0.4}
              metalness={0.3}
            />
          </mesh>
          <Html
            position={[0, 0, 1.05]}
            center
            style={{ 
              fontSize: '1.8rem', 
              color: '#ffffff',
              pointerEvents: 'none',
              textShadow: '0 0 4px rgba(0,0,0,0.7)'
            }}
            transform
            occlude
          >
            <div style={{ transform: 'scale(1.2)' }}>
              {icon}
            </div>
          </Html>
        </Suspense>
        <Preload all />
      </Canvas>
      {name && (
        <div className="absolute bottom-0 left-0 right-0 text-center py-2 text-sm font-medium opacity-80">
          {name}
        </div>
      )}
    </div>
  );
};

export default BallCanvas;
