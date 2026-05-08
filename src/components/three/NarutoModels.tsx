import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OptimizedModel, ModelLoader, useIsMobile } from './ModelBase';
import { Environment, ContactShadows, PerspectiveCamera, Float, Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 1. Hero: Truth Seeking Orb Naruto (The Sage)
export const HeroNaruto = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full h-full">
      <Canvas 
        shadows 
        dpr={[1, isMobile ? 1 : 1.5]} 
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={isMobile ? 55 : 35} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <group position={[0, -1.2, 0]}>
            <OptimizedModel 
              url="/models/naruto_shippuden.glb" 
              scale={isMobile ? 1.5 : 2.2}
              position={[0, 0, 0]}
              float={true}
              mouseResponse={0.1} // Enabled parallax
            />
            
            {/* Truth Seeking Orbs - Rotating slowly */}
            <TruthSeekingOrbs />
          </group>
          
          <Environment preset="night" />
          {!isMobile && <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />}
        </Suspense>
        
        {/* Subtle camera drift for parallax feel */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 2.2} 
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 12}
          maxAzimuthAngle={Math.PI / 12}
          makeDefault 
        />
      </Canvas>
    </div>
  );
};

const TruthSeekingOrbs = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.4, 0]}>
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 1.8;
        const z = Math.sin(angle) * 1.8;
        return (
          <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere args={[0.1, 16, 16]} position={[x, Math.sin(angle * 2) * 0.3, z]}>
              <meshBasicMaterial color="#050505" />
            </Sphere>
          </Float>
        );
      })}
    </group>
  );
};

// 2. Projects: Baryon Mode Naruto (Atmospheric Accent)
export const BaryonNaruto = () => {
  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 1]} gl={{ antialias: false }}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} color="#ff4400" intensity={1} />
        
        <Suspense fallback={null}>
          <OptimizedModel 
            url="/models/naruto_baryon.glb" 
            scale={2.0}
            position={[0, -1, 0]}
            float={true}
          />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
};

// 3. Contact: Ichiraku Ramen Shop (Immersive Environment)
export const RamenShop = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 1.2]} shadows gl={{ antialias: !isMobile }}>
        <PerspectiveCamera makeDefault position={[7, 3, 12]} fov={30} />
        <ambientLight intensity={0.6} />
        
        {/* Warm Cozy Lighting */}
        <pointLight position={[2, 2, 2]} color="#ffaa44" intensity={2} distance={15} />
        <pointLight position={[-2, 1, 3]} color="#ffcc88" intensity={1.5} distance={10} />
        <spotLight position={[0, 10, 0]} intensity={1.2} angle={0.5} penumbra={1} castShadow />

        <Suspense fallback={<ModelLoader />}>
          <OptimizedModel 
            url="/models/ichiraku_ramen_-_naruto.glb" 
            scale={isMobile ? 0.08 : 0.12}
            position={[0, -1, 0]}
            rotation={[0, -Math.PI / 4, 0]}
            float={false}
          />
          <Environment preset="apartment" />
          <ContactShadows position={[0, -1.01, 0]} opacity={0.5} scale={25} blur={2} />
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 10}
          maxAzimuthAngle={Math.PI / 10}
        />
      </Canvas>
    </div>
  );
};

// 4. Entry Intro: Running Naruto (Introduction Dash)
export const RunningNaruto = ({ scale = 1 }: { scale?: number }) => {
  return (
    <div className="w-full h-full overflow-visible">
      <Canvas dpr={[1, 1]} gl={{ antialias: false, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={40} />
        <ambientLight intensity={1.5} />
        <Suspense fallback={null}>
          <group rotation={[0, Math.PI / 2, 0]}>
            <OptimizedModel 
              url="/models/naruto_shippuden.glb" 
              scale={scale * 0.9}
              position={[0, -0.8, 0]}
              float={false}
              autoAnimate={true}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};
