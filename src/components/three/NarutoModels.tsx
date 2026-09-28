import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  PerspectiveCamera,
  Float,
  Sphere,
  OrbitControls,
} from '@react-three/drei';
import * as THREE from 'three';
import { OptimizedModel, ModelLoader, useIsMobile } from './ModelBase';
import { StudioEnvironment } from './Lighting';

/**
 * Lighting note: these models are Sketchfab exports with baked-in diffuse
 * textures and no metalness. They want restrained, directional light. The
 * previous stacked setup (ambient 1.5 + spot 3 + point 2 + directional 2) drove
 * every surface past white through ACES tonemapping and flattened the texture
 * detail that is now finally attached.
 */

// ---------------------------------------------------------------------------
// 1. Hero: the Sage with his truth-seeking orbs
// ---------------------------------------------------------------------------

/**
 * Gudodama read as invisible before: they were pure black meshBasicMaterial
 * spheres sitting on a near-black page. A black core inside an additive violet
 * shell keeps them black while still reading against the background.
 */
const TruthSeekingOrbs = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.55;
  });

  return (
    <group ref={groupRef} position={[0, 1.4, 0]}>
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const position: [number, number, number] = [
          Math.cos(angle) * 1.6,
          Math.sin(angle * 2) * 0.5,
          Math.sin(angle) * 1.6,
        ];
        return (
          <Float key={i} speed={3} rotationIntensity={1.2} floatIntensity={1.2}>
            <group position={position}>
              <Sphere args={[0.1, 20, 20]}>
                <meshBasicMaterial color="#05030a" toneMapped={false} />
              </Sphere>
              <Sphere args={[0.15, 20, 20]}>
                <meshBasicMaterial
                  color="#7b4dff"
                  transparent
                  opacity={0.45}
                  side={THREE.BackSide}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </Sphere>
            </group>
          </Float>
        );
      })}
    </group>
  );
};

export const HeroNaruto = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-full">
      <Canvas
        shadows={!isMobile}
        dpr={[1, isMobile ? 1.25 : 1.75]}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={isMobile ? 55 : 40} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 6, 5]} intensity={1.7} color="#ffffff" castShadow />
        <pointLight position={[-5, 1, -4]} intensity={2.4} color="#ff9a44" distance={22} />
        <pointLight position={[4, 2, -5]} intensity={1.8} color="#3f8cff" distance={22} />

        <Suspense fallback={<ModelLoader />}>
          <group position={[0, isMobile ? -1.5 : -2.0, 0]}>
            <OptimizedModel
              url="/models/naruto_shippuden.glb"
              fitHeight={isMobile ? 2.6 : 3.4}
              ground
              float
              mouseResponse={0.2}
              autoAnimate={false}
            />
            <TruthSeekingOrbs />
          </group>

          <StudioEnvironment variant="hero" />
          {!isMobile && (
            <ContactShadows position={[0, -2, 0]} opacity={0.55} scale={10} blur={2.5} far={4} />
          )}
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

// ---------------------------------------------------------------------------
// 2. Projects: Baryon Mode
// ---------------------------------------------------------------------------

/**
 * This model is unlit (KHR_materials_unlit) and carries its colour in vertex
 * attributes, so scene lights do nothing to it. The lights here exist only for
 * the surrounding scene.
 */
export const BaryonNaruto = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, isMobile ? 1.25 : 1.5]} gl={{ antialias: !isMobile }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} color="#ff5522" intensity={2.5} distance={25} />

        <Suspense fallback={<ModelLoader />}>
          <group position={[0, -1.5, 0]}>
            <OptimizedModel
              url="/models/naruto_baryon.glb"
              fitHeight={isMobile ? 2.6 : 3.6}
              ground
              float
              autoAnimate={false}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 3. Footer: Ichiraku Ramen at night
// ---------------------------------------------------------------------------

/** Lantern-lit steam drifting up out of the shop. */
const Steam = ({ count = 40 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = Array.from({ length: count }, () => ({
      x: THREE.MathUtils.randFloatSpread(6),
      y: THREE.MathUtils.randFloat(-1, 3),
      z: THREE.MathUtils.randFloatSpread(4),
      speed: THREE.MathUtils.randFloat(0.15, 0.5),
    }));
    seeds.forEach((s, i) => {
      positions[i * 3] = s.x;
      positions[i * 3 + 1] = s.y;
      positions[i * 3 + 2] = s.z;
    });
    return { positions, seeds };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    seeds.forEach((s, i) => {
      s.y += s.speed * delta;
      if (s.y > 4) s.y = -1;
      attr.setY(i, s.y);
      attr.setX(i, s.x + Math.sin(s.y * 1.5) * 0.25);
    });
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        color="#ffd9a0"
        transparent
        opacity={0.22}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

export const RamenShop = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, isMobile ? 1.25 : 1.5]} shadows={!isMobile} gl={{ antialias: !isMobile }}>
        <PerspectiveCamera makeDefault position={[10, 5, 15]} fov={35} />

        <ambientLight intensity={0.45} color="#5a6a9a" />
        {/* Warm lantern inside the stall, cool moonlight outside it. */}
        <pointLight position={[0, 3, 0]} color="#ffb257" intensity={9} distance={22} decay={2} />
        <pointLight position={[-6, 4, 6]} color="#6f9bff" intensity={2.4} distance={30} decay={2} />

        <Suspense fallback={<ModelLoader />}>
          <group position={[0, -2, 0]}>
            <OptimizedModel
              url="/models/ichiraku_ramen_-_naruto.glb"
              fitHeight={isMobile ? 5 : 6.5}
              ground
              rotation={[0, -Math.PI / 6, 0]}
              autoAnimate={false}
            />
          </group>
          <Steam />
          <StudioEnvironment variant="lantern" />
          {!isMobile && (
            <ContactShadows position={[0, -2.01, 0]} opacity={0.55} scale={30} blur={2} />
          )}
        </Suspense>

        {/* autoRotate keeps the closing shot drifting without fighting the
            user for control of the camera. */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.35}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  );
};
