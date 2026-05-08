import { Suspense, useMemo, useEffect } from 'react';
import { useGLTF, Float, PerspectiveCamera, Environment, ContactShadows, useProgress, Html } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Optimized Model Component
export function OptimizedModel({ 
  url, 
  position = [0, 0, 0] as [number, number, number], 
  rotation = [0, 0, 0] as [number, number, number], 
  scale = 1,
  float = true,
  autoAnimate = true
}: { 
  url: string; 
  position?: [number, number, number]; 
  rotation?: [number, number, number]; 
  scale?: number;
  float?: boolean;
  autoAnimate?: boolean;
}) {
  // Use a fallback for the URL if it's missing
  const modelUrl = url || "/models/naruto_shippuden.glb";
  
  // Robust Draco pathing with CDN fallback
  const DRACO_URL = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';
  const { scene, animations } = useGLTF(modelUrl, DRACO_URL);
  const mixer = useMemo(() => scene ? new THREE.AnimationMixer(scene) : null, [scene]);

  useEffect(() => {
    if (autoAnimate && animations && animations.length > 0 && mixer) {
      const action = mixer.clipAction(animations[0]);
      action.play();
    }
    return () => {
      if (mixer) mixer.stopAllAction();
    };
  }, [mixer, autoAnimate, animations]);

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta);
  });

  const model = (
    <primitive 
      object={scene} 
      position={position} 
      rotation={rotation} 
      scale={scale} 
    />
  );

  return float ? (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
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
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          Loading Chakra... {Math.floor(progress)}%
        </span>
      </div>
    </Html>
  );
}

// Helper to check if we are on mobile
export const useIsMobile = () => {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);
};
