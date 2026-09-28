import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  PerspectiveCamera,
  Float,
  OrbitControls,
} from '@react-three/drei';
import * as THREE from 'three';
import { OptimizedModel, ModelLoader, FitCamera, useIsMobile } from './ModelBase';
import { StudioEnvironment } from './Lighting';

const HERO_MODEL = '/models/naruto_shippuden.glb';
const BARYON_MODEL = '/models/naruto_baryon.glb';

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

/*
 * Note: naruto_shippuden.glb already ships its own truth-seeking orbs as
 * sphere001..008 meshes, which is why its bounding depth (1.91) exceeds its
 * height (1.56). An earlier hand-built set of orbs here was drawing a second,
 * misaligned copy of them.
 */

export const HeroNaruto = () => {
  const isMobile = useIsMobile();

  const fov = isMobile ? 52 : 40;
  const modelHeight = isMobile ? 2.6 : 3.0;

  return (
    <div className="w-full h-full">
      <Canvas
        shadows={!isMobile}
        dpr={[1, isMobile ? 1.25 : 1.75]}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={fov} />

        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 6, 5]} intensity={1.8} color="#fff4e6" castShadow />
        <pointLight position={[-5, 1, -4]} intensity={2.6} color="#ff8a2b" distance={24} />
        <pointLight position={[4, 2, -5]} intensity={1.7} color="#3f9dff" distance={24} />

        <Suspense fallback={<ModelLoader />}>
          <FitCamera url={HERO_MODEL} fitHeight={modelHeight} fov={fov} margin={1.3} />

          <Float speed={1.1} rotationIntensity={0.07} floatIntensity={0.25}>
            <OptimizedModel
              url={HERO_MODEL}
              fitHeight={modelHeight}
              center
              mouseResponse={0.15}
              autoAnimate={false}
            />
          </Float>

          <StudioEnvironment variant="hero" />
          {!isMobile && (
            <ContactShadows
              position={[0, -modelHeight / 2, 0]}
              opacity={0.5}
              scale={10}
              blur={2.5}
              far={4}
            />
          )}
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.7}
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
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} color="#ff5522" intensity={2.5} distance={25} />

        <Suspense fallback={<ModelLoader />}>
          <FitCamera url={BARYON_MODEL} fitHeight={isMobile ? 2.8 : 3.4} fov={50} margin={1.05} />

          <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
            <OptimizedModel
              url={BARYON_MODEL}
              fitHeight={isMobile ? 2.8 : 3.4}
              center
              autoAnimate={false}
            />
          </Float>
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
