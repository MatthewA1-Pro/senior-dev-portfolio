import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OptimizedModel, ModelLoader, useIsMobile } from './ModelBase';
import { Environment, ContactShadows, PerspectiveCamera, Float, Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 1. Hero: Truth Seeking Orb Naruto (The Sage) - FIXED COLOR & POSITION
export const HeroNaruto = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full h-full">
      <Canvas 
        shadows 
        dpr={[1, isMobile ? 1 : 1.5]} 
        gl={{ 
          antialias: !isMobile, 
          powerPreference: "high-performance",
          outputColorSpace: THREE.SRGBColorSpace 
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={isMobile ? 55 : 40} />
        
        {/* VIBRANT LIGHTING - TO FIX COLOR */}
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={3} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#ffaa44" />
        <directionalLight position={[0, 5, 5]} intensity={2} color="#ffffff" />
        
        <Suspense fallback={null}>
          <group position={[0, isMobile ? -1.5 : -2.0, 0]}>
            <OptimizedModel 
              url="/models/naruto_shippuden.glb" 
              scale={isMobile ? 1.6 : 2.2}
              position={[0, 0, 0]}
              float={true}
              mouseResponse={0.2}
            />
            
            {/* Truth Seeking Orbs */}
            <TruthSeekingOrbs />
          </group>
          
          <Environment preset="city" /> {/* Switched to 'city' for better texture rendering */}
          {!isMobile && <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />}
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 1.5}
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
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.4, 0]}>
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 1.6;
        const z = Math.sin(angle) * 1.6;
        return (
          <Float key={i} speed={4} rotationIntensity={1.5} floatIntensity={1.5}>
            <Sphere args={[0.1, 16, 16]} position={[x, Math.sin(angle * 2) * 0.5, z]}>
              <meshBasicMaterial color="#000000" />
            </Sphere>
          </Float>
        );
      })}
    </group>
  );
};

// 2. Projects: Baryon Mode Naruto (High Visibility)
export const BaryonNaruto = () => {
  const isMobile = useIsMobile();
  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={1} />
        <pointLight position={[5, 5, 5]} color="#ff4400" intensity={4} />
        <spotLight position={[-5, 10, 5]} intensity={3} color="#ff0000" />
        
        <Suspense fallback={null}>
          <group position={[0, -1.5, 0]}>
            <OptimizedModel 
              url="/models/naruto_baryon.glb" 
              scale={isMobile ? 1.6 : 2.5}
              position={[0, 0, 0]}
              float={true}
            />
          </group>
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
      <Canvas dpr={[1, 1.5]} shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[10, 5, 15]} fov={35} />
        <ambientLight intensity={1.2} />
        <pointLight position={[5, 5, 5]} color="#ffaa44" intensity={4} distance={25} />
        
        <Suspense fallback={<ModelLoader />}>
          <group position={[0, -2, 0]}>
            <OptimizedModel 
              url="/models/ichiraku_ramen_-_naruto.glb" 
              scale={isMobile ? 0.18 : 0.28}
              position={[0, 0, 0]}
              rotation={[0, -Math.PI / 6, 0]}
              float={false}
            />
          </group>
          <Environment preset="apartment" />
          <ContactShadows position={[0, -2.01, 0]} opacity={0.6} scale={30} blur={2} />
        </Suspense>
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

// 4. Entry Intro: Running Naruto (NEW MODEL)
export const RunningNaruto = ({ scale = 1 }: { scale?: number }) => {
  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <ambientLight intensity={2.5} />
        <pointLight position={[0, 5, 5]} intensity={3} color="#ffcc00" />
        
        <Suspense fallback={null}>
          <group rotation={[0, Math.PI / 2, 0]} position={[0, -1.2, 0]}>
            <OptimizedModel 
              url="/models/naruto_uzumaki_running_animation.glb" 
              scale={scale * 2.2}
              position={[0, 0, 0]}
              float={false}
              autoAnimate={true}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};
