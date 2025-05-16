import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, Html } from "@react-three/drei";
import { useTheme } from "../../context/ThemeContext";
import CanvasLoader from "./CanvasLoader";
import IconBall from "./IconBall";

interface IconBallCanvasProps {
  icon: React.ReactNode;
  name?: string;
  color?: string;
}

const IconBallCanvas = ({ icon, name, color }: IconBallCanvasProps) => {
  const { accentColor } = useTheme();
  const iconRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="relative w-full h-full">
      <Canvas
        frameloop='demand'
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            rotateSpeed={0.5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
          <IconBall 
            icon={icon} 
            color={color || accentColor} 
          />
          
          {/* Render the icon in 3D space */}
          <Html
            center
            prepend
            zIndexRange={[100, 0]}
            position={[0, 0, 1.05]}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none',
              fontSize: '2.5rem',
              color: '#ffffff',
              textShadow: '0 0 5px rgba(0,0,0,0.5)',
              transform: 'scale(1)'
            }}
          >
            <div ref={iconRef}>
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

export default IconBallCanvas;
