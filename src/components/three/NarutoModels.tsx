import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, PerspectiveCamera, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { OptimizedModel, ModelLoader, FitCamera, useIsMobile } from './ModelBase';
import { StudioEnvironment } from './Lighting';

const HERO_MODEL = '/models/naruto_shippuden.glb';
const BARYON_MODEL = '/models/naruto_baryon.glb';
const RAMEN_MODEL = '/models/ichiraku_ramen_-_naruto.glb';

/*
 * Every canvas here is `flat` (no tone mapping). These are cel-style anime
 * models whose colour lives in their textures; ACES tone mapping compressed
 * them toward grey, which read as the whole scene being dull and hazy.
 *
 * Light values assume three's physical units (r155+): point lights fall off
 * with the square of distance, so a point light needs tens of candela to reach
 * a subject a few units away. Directional and hemisphere lights do not fall
 * off and carry the base exposure.
 */

// ---------------------------------------------------------------------------
// 1. Hero: the Sage with his truth-seeking orbs
// ---------------------------------------------------------------------------

/*
 * naruto_shippuden.glb ships its own truth-seeking orbs (sphere001..008), which
 * is why its bounding depth rivals its height.
 */
export const HeroNaruto = () => {
  const isMobile = useIsMobile();

  const fov = isMobile ? 50 : 38;
  const modelHeight = 3.0;

  return (
    <div className="w-full h-full">
      <Canvas
        flat
        shadows={!isMobile}
        dpr={[1, isMobile ? 1.25 : 1.75]}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={fov} />

        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 6, 5]} intensity={1.6} color="#fff3e2" castShadow />
        {/* Rim lights from behind separate him from the dark page. */}
        <directionalLight position={[-5, 3, -4]} intensity={1.1} color="#ff8a2b" />
        <directionalLight position={[5, 2, -5]} intensity={0.7} color="#5aa8ff" />

        <Suspense fallback={<ModelLoader />}>
          {/* Below 1: his bounding box includes the orbs and rods floating round
              him, so fitting it exactly leaves his body well under half the frame. */}
          <FitCamera url={HERO_MODEL} fitHeight={modelHeight} fov={fov} margin={0.86} />

          <Float speed={1.1} rotationIntensity={0.07} floatIntensity={0.2}>
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
          enableRotate={!isMobile}
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
 * Unlit (KHR_materials_unlit) with colour in vertex attributes, so lights do
 * nothing to it and `flat` is what lets those vertex colours show at full
 * strength.
 */
export const BaryonNaruto = () => {
  const isMobile = useIsMobile();
  const height = isMobile ? 2.8 : 3.4;

  return (
    <div className="w-full h-full">
      <Canvas flat dpr={[1, isMobile ? 1.25 : 1.5]} gl={{ antialias: !isMobile }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={42} />

        <Suspense fallback={<ModelLoader />}>
          <FitCamera url={BARYON_MODEL} fitHeight={height} fov={42} margin={1.06} />

          <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
            <OptimizedModel url={BARYON_MODEL} fitHeight={height} center autoAnimate={false} />
          </Float>
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={!isMobile}
          autoRotate
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 2.4}
          maxPolarAngle={Math.PI / 1.8}
          makeDefault
        />
      </Canvas>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 3. Footer: Ichiraku Ramen at night
// ---------------------------------------------------------------------------

/** Steam drifting up out of the stall. */
const Steam = ({ count = 36, spread = 5 }: { count?: number; spread?: number }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = Array.from({ length: count }, () => ({
      x: THREE.MathUtils.randFloatSpread(spread),
      y: THREE.MathUtils.randFloat(-1.5, 3),
      z: THREE.MathUtils.randFloatSpread(spread * 0.6),
      speed: THREE.MathUtils.randFloat(0.15, 0.45),
    }));
    seeds.forEach((s, i) => {
      positions[i * 3] = s.x;
      positions[i * 3 + 1] = s.y;
      positions[i * 3 + 2] = s.z;
    });
    return { positions, seeds };
  }, [count, spread]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    seeds.forEach((s, i) => {
      s.y += s.speed * delta;
      if (s.y > 3.5) s.y = -1.5;
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
        size={0.2}
        color="#fff1d6"
        transparent
        opacity={0.28}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

export const RamenShop = () => {
  const isMobile = useIsMobile();
  const height = isMobile ? 5.2 : 6.5;
  const fov = isMobile ? 45 : 30;

  return (
    <div className="w-full h-full">
      <Canvas flat dpr={[1, isMobile ? 1.25 : 1.5]} shadows={!isMobile} gl={{ antialias: !isMobile }}>
        <PerspectiveCamera makeDefault position={[10, 5, 15]} fov={fov} />

        {/* Base exposure: warm lantern sky over a dark street. The old rig was a
            0.45 blue ambient plus point lights whose physical falloff left
            almost nothing reaching the shop - hence the faint model. */}
        <hemisphereLight args={['#ffe4c2', '#2a1d14', 0.75]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 9, 8]} intensity={1.5} color="#ffe9cc" castShadow />
        <directionalLight position={[-8, 4, -6]} intensity={0.6} color="#7da7ff" />

        {/* Lantern glow inside the counter. */}
        <pointLight position={[0, 0.6, 1.2]} color="#ffae57" intensity={40} distance={0} decay={2} />
        <pointLight position={[2.5, 1.8, 2.5]} color="#ff8f3a" intensity={22} distance={0} decay={2} />

        <Suspense fallback={<ModelLoader />}>
          <FitCamera
            url={RAMEN_MODEL}
            fitHeight={height}
            fov={fov}
            margin={1.55}
            direction={[0.62, 0.3, 0.72]}
          />
          <OptimizedModel
            url={RAMEN_MODEL}
            fitHeight={height}
            center
            rotation={[0, -Math.PI / 6, 0]}
            autoAnimate={false}
          />
          <Steam />
          <StudioEnvironment variant="lantern" />
          {!isMobile && (
            <ContactShadows position={[0, -height / 2, 0]} opacity={0.5} scale={30} blur={2} />
          )}
        </Suspense>

        {/* autoRotate keeps the closing shot drifting without fighting the user
            for the camera; rotation is off on touch so the canvas does not
            swallow page scrolling. */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={!isMobile}
          autoRotate
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 2.1}
          makeDefault
        />
      </Canvas>
    </div>
  );
};
