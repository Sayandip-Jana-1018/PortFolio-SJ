import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Decal,
  Float,
  useTexture,
} from "@react-three/drei";
import { useTheme } from "../../context/ThemeContext";
import * as THREE from "three";

interface BallProps {
  imgUrl: string;
  position?: [number, number, number];
  scale?: number;
  floatIntensity?: number;
}

const Ball = ({ imgUrl, position = [0, 0, 0], scale = 2.75, floatIntensity = 2 }: BallProps) => {
  const [decal] = useTexture([imgUrl]);
  const { accentColor, theme } = useTheme();
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Convert hex color to THREE.Color
  const hexToThreeColor = (hex: string) => {
    return new THREE.Color(hex);
  };
  
  // Get base color based on theme and accent
  const getBaseColor = () => {
    // Extract RGB components from accent color
    const accentThreeColor = hexToThreeColor(accentColor);
    const r = accentThreeColor.r;
    const g = accentThreeColor.g;
    const b = accentThreeColor.b;
    
    // Create a muted version of the accent color
    const baseColor = theme === 'dark' 
      ? new THREE.Color(r * 0.3 + 0.1, g * 0.3 + 0.1, b * 0.3 + 0.1)
      : new THREE.Color(r * 0.2 + 0.7, g * 0.2 + 0.7, b * 0.2 + 0.7);
      
    return baseColor;
  };

  // Add subtle animation
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Add subtle pulsing effect
      const time = clock.getElapsedTime();
      const pulseFactor = Math.sin(time) * 0.03 + 1;
      meshRef.current.scale.set(
        scale * pulseFactor,
        scale * pulseFactor,
        scale * pulseFactor
      );
    }
  });

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={floatIntensity}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh 
        castShadow 
        receiveShadow 
        position={position}
        ref={meshRef}
      >
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color={getBaseColor()}
          polygonOffset
          polygonOffsetFactor={-5}
          roughness={0.5}
          metalness={0.2}
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
        />
      </mesh>
    </Float>
  );
};

export default Ball;
