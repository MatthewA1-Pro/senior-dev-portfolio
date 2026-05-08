import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OptimizedModel, ModelLoader, useIsMobile } from './ModelBase';
import { Environment, ContactShadows, PerspectiveCamera, Float, Sphere, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// 1. Hero: Truth Seeking Orb Naruto (Centerpiece)
export const HeroNaruto = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full h-full relative">
      <Canvas 
        shadows 
        dpr={[1, isMobile ? 1 : 1.5]} 
        gl={{ antialias: !isMobile, powerPreference: "default", stencil: false }}
        camera={{ position: [0, 0, 5], fov: isMobile ? 55 : 40 }}
      >
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <group position={[isMobile ? 0 : 1.2, -1.0, 0]}>
            <OptimizedModel 
              url="/models/naruto_shippuden.glb" 
              scale={isMobile ? 1.4 : 2.0}
              position={[0, 0, 0]}
              float={true}
              mouseResponse={0.05}
            />
            
            {/* Truth Seeking Orbs arrangement */}
            <TruthSeekingOrbs />
          </group>
          
          <Environment preset="night" />
          {!isMobile && <ContactShadows position={[0, -2, 0]} opacity={0.3} scale={8} blur={2.5} far={4} />}
        </Suspense>
      </Canvas>
    </div>
  );
};

const TruthSeekingOrbs = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.4;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.2, 0]}>
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 1.5;
        const z = Math.sin(angle) * 1.5;
        return (
          <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere args={[0.08, 16, 16]} position={[x, Math.sin(angle * 2) * 0.2, z]}>
              <meshBasicMaterial color="#050505" />
            </Sphere>
          </Float>
        );
      })}
    </group>
  );
};

// 2. Projects: Baryon Mode Naruto (Atmosphere)
export const BaryonNaruto = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full h-full opacity-30">
      <Canvas dpr={[1, 1]} gl={{ antialias: false, stencil: false }}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} color="#ff4400" intensity={2} />
        
        <Suspense fallback={null}>
          <OptimizedModel 
            url="/models/naruto_baryon.glb" 
            scale={isMobile ? 1.0 : 1.6}
            position={[0, -0.8, 0]}
            float={true}
          />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
};

// 3. Contact: Ichiraku Ramen Shop (Environment)
export const RamenShop = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 1]} shadows gl={{ antialias: !isMobile }}>
        <PerspectiveCamera makeDefault position={[6, 3, 10]} fov={35} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
        
        {/* Warm lantern lighting */}
        <pointLight position={[0, 2, 2]} color="#ffaa44" intensity={2} distance={10} />
        
        <Suspense fallback={null}>
          <OptimizedModel 
            url="/models/ichiraku_ramen_-_naruto.glb" 
            scale={isMobile ? 0.07 : 0.11}
            position={[0, -1, 0]}
            rotation={[0, -Math.PI / 4, 0]}
            float={false}
          />
          <Environment preset="apartment" />
          <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={15} blur={2} />
        </Suspense>
      </Canvas>
    </div>
  );
};

// 4. Loading/Transitions: Running Naruto
export const RunningNaruto = ({ scale = 1 }: { scale?: number }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 1]} gl={{ antialias: false }}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
        <ambientLight intensity={1.2} />
        <Suspense fallback={null}>
          <group rotation={[0, Math.PI / 2, 0]}>
            <OptimizedModel 
              url="/models/naruto_shippuden.glb" 
              scale={scale * (isMobile ? 1.0 : 1.4)}
              position={[0, -0.5, 0]}
              float={false}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};
