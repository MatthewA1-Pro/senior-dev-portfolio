import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OptimizedModel, ModelLoader, useIsMobile } from './ModelBase';
import { Environment, ContactShadows, PerspectiveCamera, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// 1. Hero: Truth Seeking Orb Naruto (Centerpiece)
export const HeroNaruto = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 1]} gl={{ antialias: false, powerPreference: "default", stencil: false }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={isMobile ? 60 : 45} />
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={<ModelLoader />}>
          <OptimizedModel 
            url="/models/naruto_shippuden.glb" 
            scale={isMobile ? 1.5 : 2.2}
            position={[0, -1.2, 0]}
            float={true}
          />
          
          {/* Truth Seeking Orbs arrangement */}
          <TruthSeekingOrbs />
          
          <Environment preset="night" />
          {!isMobile && <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />}
        </Suspense>
      </Canvas>
    </div>
  );
};

const TruthSeekingOrbs = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 1.8;
        const z = Math.sin(angle) * 1.8;
        return (
          <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere args={[0.1, 8, 8]} position={[x, Math.sin(angle * 2) * 0.3, z]}>
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
    <div className="w-full h-full opacity-60">
      <Canvas dpr={[1, 1.2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} color="#ff4400" intensity={2} />
        
        <Suspense fallback={null}>
          <OptimizedModel 
            url="/models/naruto_baryon.glb" 
            scale={isMobile ? 1.2 : 1.8}
            position={[0, -1, 0]}
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
      <Canvas dpr={[1, 1.2]} shadows>
        <PerspectiveCamera makeDefault position={[5, 2, 8]} fov={40} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        
        <Suspense fallback={<ModelLoader />}>
          <OptimizedModel 
            url="/models/ichiraku_ramen.glb" 
            scale={isMobile ? 0.08 : 0.12}
            position={[0, -1, 0]}
            rotation={[0, -Math.PI / 4, 0]}
            float={false}
          />
          <Environment preset="apartment" />
          <ContactShadows position={[0, -1.01, 0]} opacity={0.5} scale={20} blur={2} />
        </Suspense>
      </Canvas>
    </div>
  );
};

// 4. Loading/Transitions: Running Naruto
export const RunningNaruto = ({ scale = 1 }: { scale?: number }) => {
  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 1]} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={50} />
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <OptimizedModel 
            url="/models/naruto_shippuden.glb" 
            scale={scale * 0.8}
            position={[0, -0.5, 0]}
            float={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
