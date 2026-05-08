import { Suspense, useMemo, useEffect, useRef } from 'react';
import { useGLTF, Float, PerspectiveCamera, Environment, ContactShadows, useProgress, Html } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Optimized Model Component with cinematic features
export function OptimizedModel({ 
  url, 
  position = [0, 0, 0] as [number, number, number], 
  rotation = [0, 0, 0] as [number, number, number], 
  scale = 1,
  float = true,
  autoAnimate = true,
  mouseResponse = 0 // Intensity of mouse follow [0-1]
}: { 
  url: string; 
  position?: [number, number, number]; 
  rotation?: [number, number, number]; 
  scale?: number;
  float?: boolean;
  autoAnimate?: boolean;
  mouseResponse?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Use a fallback for the URL if it's missing
  const modelUrl = url || "/models/naruto_shippuden.glb";
  
  // Use the local Draco decoder as requested
  const DRACO_PATH = '/draco/';
  const { scene, animations } = useGLTF(modelUrl, DRACO_PATH);
  
  // Clone scene to avoid sharing state between instances
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const mixer = useMemo(() => new THREE.AnimationMixer(clonedScene), [clonedScene]);

  useEffect(() => {
    if (autoAnimate && animations && animations.length > 0 && mixer) {
      // Find the primary animation (usually the first one)
      const action = mixer.clipAction(animations[0]);
      action.play();
    }
    return () => {
      if (mixer) mixer.stopAllAction();
    };
  }, [mixer, autoAnimate, animations]);

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);
    
    // Mouse responsiveness for cinematic feel
    if (groupRef.current && mouseResponse > 0) {
      const targetRotationX = state.mouse.y * mouseResponse;
      const targetRotationY = state.mouse.x * mouseResponse;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.1);
    }
  });

  const model = (
    <group ref={groupRef}>
      <primitive 
        object={clonedScene} 
        position={position} 
        rotation={rotation} 
        scale={scale} 
      />
    </group>
  );

  return float ? (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
      {model}
    </Float>
  ) : model;
}

// Global Loader for models
export function ModelLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-[1px] bg-primary/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </Html>
  );
}

// Helper to check if we are on mobile
export const useIsMobile = () => {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 1024; // Use tablet as threshold for 3D
  }, []);
};
