import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OptimizedModel, ModelLoader, useIsMobile } from './ModelBase';
import { Environment, ContactShadows, PerspectiveCamera, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// 1. Hero: Truth Seeking Orb Naruto (Optimized)
export const HeroNaruto = () => {
  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 1]} gl={{ antialias: false, powerPreference: "default" }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={<ModelLoader />}>
          <OptimizedModel 
            url="/models/naruto_shippuden.glb" 
            scale={2.2}
            position={[0, -1.2, 0]}
            float={true}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// 2. Projects: Disabled for safety
export const BaryonNaruto = () => null;

// 3. Contact: Disabled for safety
export const RamenShop = () => null;

// 4. Loading: Running Naruto (Optimized)
export const RunningNaruto = ({ scale = 1 }: { scale?: number }) => {
  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 1]} gl={{ antialias: false }}>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={50} />
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <OptimizedModel 
            url="/models/naruto_shippuden.glb" 
            scale={scale * 0.8}
            position={[0, -0.5, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
