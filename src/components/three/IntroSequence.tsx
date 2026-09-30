import { Suspense, useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { OptimizedModel, useIsMobile } from './ModelBase';
import { Rasengan } from './Rasengan';
import { StudioEnvironment } from './Lighting';
import { CHAKRA_FILL } from '../RasenganBurst';

const RUN_MODEL = '/models/naruto_uzumaki_running_animation.glb';

/**
 * Beat boundaries of the opening shot, in seconds. The middle beat is
 * deliberately long: the jutsu needs to be on screen, close and spinning, long
 * enough to register as a rasengan rather than a blue glow.
 */
const BEATS = {
  trackingEnd: 2.4,
  raiseEnd: 4.4,
  total: 5.2,
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeIn = (t: number) => t * t * t;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * Streaks of chakra-lit air pulled past the camera. The runner animation is
 * run-in-place, so this (plus the camera move) is what sells forward speed.
 */
const SpeedLines = ({ count = 90 }: { count?: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: THREE.MathUtils.randFloatSpread(30),
        y: THREE.MathUtils.randFloat(-1.5, 5),
        z: THREE.MathUtils.randFloatSpread(12),
        speed: THREE.MathUtils.randFloat(14, 30),
        length: THREE.MathUtils.randFloat(1.5, 5),
      })),
    [count],
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    seeds.forEach((s, i) => {
      s.x -= s.speed * delta;
      if (s.x < -18) s.x = 18;
      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.set(s.length, 0.012, 0.012);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color="#7cc4ff"
        transparent
        opacity={0.5}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

/**
 * Drives the whole shot: camera choreography, the rasengan riding the hand
 * bone, and the final lunge where the jutsu swallows the lens.
 */
const Shot = ({ onComplete, active }: { onComplete: () => void; active: boolean }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const rasenganRef = useRef<THREE.Group>(null);
  const groundRef = useRef<THREE.Mesh>(null);
  const runnerRef = useRef<THREE.Group>(null);
  const speedRef = useRef<THREE.Group>(null);
  const slamOrigin = useRef<THREE.Vector3 | null>(null);
  const handBone = useRef<THREE.Object3D | null>(null);
  const start = useRef<number | null>(null);
  const fired = useRef(false);
  const { scene } = useThree();

  const handWorld = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 1.1, 0), []);
  const lungeTarget = useMemo(() => new THREE.Vector3(), []);

  // three's GLTFLoader strips illegal characters from node names, so this rig's
  // "mixamorig:RightHand_035" arrives as "mixamorigRightHand_035". Matching on
  // the colon silently never bound, which left the jutsu parked at the origin
  // by his feet instead of in his hand.
  const bindHand = useCallback((root: THREE.Object3D) => {
    root.traverse((o) => {
      if (!handBone.current && /RightHand_\d/i.test(o.name)) handBone.current = o;
    });
  }, []);

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#05070f', 0.055);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame(({ clock }) => {
    const cam = cameraRef.current;
    if (!cam) return;

    // Mounted early behind the loading screen: hold the opening frame so it is
    // compiled and drawn before the loader fades, and start the clock only
    // once the shot is actually live.
    if (!active) {
      cam.position.set(Math.cos(-2.5) * 6, 2.6, Math.sin(-2.5) * 6);
      cam.lookAt(0, 1.1, 0);
      return;
    }

    if (start.current === null) start.current = clock.getElapsedTime();
    const t = clock.getElapsedTime() - start.current;

    // Keep the rasengan in world space rather than parenting it to the bone:
    // mixamo bones carry non-uniform scale that would squash the sphere.
    if (handBone.current && rasenganRef.current && !slamOrigin.current) {
      handBone.current.getWorldPosition(handWorld);
      // Nudge it outward from his centre line so it sits in the palm rather
      // than sinking into his torso as the arm swings through the stride.
      const outX = handWorld.x;
      const outZ = handWorld.z;
      const reach = Math.hypot(outX, outZ) || 1;
      handWorld.x += (outX / reach) * 0.22;
      handWorld.z += (outZ / reach) * 0.22;
      rasenganRef.current.position.lerp(handWorld, 0.5);
    }

    if (t < BEATS.trackingEnd) {
      // Beat 1 - tracking dolly: sweep from behind his shoulder to side-on.
      const p = easeInOut(clamp01(t / BEATS.trackingEnd));
      const angle = THREE.MathUtils.lerp(-2.5, -1.35, p);
      const dist = THREE.MathUtils.lerp(6.0, 3.6, p);
      cam.position.set(
        Math.cos(angle) * dist,
        THREE.MathUtils.lerp(2.6, 1.5, p),
        Math.sin(angle) * dist,
      );
      lookTarget.set(0, 1.1, 0);
      if (rasenganRef.current) {
        rasenganRef.current.scale.setScalar(
          THREE.MathUtils.lerp(0, 0.3, clamp01((t - 0.5) / 1.2)),
        );
      }
    } else if (t < BEATS.raiseEnd) {
      // Beat 2 - he swings the jutsu round to face us and the camera pushes in
      // close on the hand, so the spiral fills a good part of the frame.
      const p = easeInOut(clamp01((t - BEATS.trackingEnd) / (BEATS.raiseEnd - BEATS.trackingEnd)));
      const angle = THREE.MathUtils.lerp(-1.35, -0.15, p);
      const dist = THREE.MathUtils.lerp(3.6, 2.4, p);
      cam.position.set(
        Math.cos(angle) * dist,
        THREE.MathUtils.lerp(1.5, 1.2, p),
        Math.sin(angle) * dist,
      );
      // Settle onto the jutsu itself rather than his centre of mass.
      lookTarget.lerp(handWorld, 0.12);
      // The camera is tight on his hand from here, so the floor adds nothing
      // except a hard edge where it grazes the sphere.
      if (groundRef.current) groundRef.current.visible = false;
      if (rasenganRef.current) rasenganRef.current.scale.setScalar(THREE.MathUtils.lerp(0.3, 0.42, p));
    } else {
      // Beat 3 - the slam. The jutsu is thrust into the lens and blows the
      // frame out. He and the speed lines drop out on the thrust: the sphere
      // is additive, so he used to show straight through it still running.
      if (!slamOrigin.current && rasenganRef.current) {
        slamOrigin.current = rasenganRef.current.position.clone();
        if (runnerRef.current) runnerRef.current.visible = false;
        if (speedRef.current) speedRef.current.visible = false;
      }
      const origin = slamOrigin.current ?? handWorld;
      const u = clamp01((t - BEATS.raiseEnd) / (BEATS.total - BEATS.raiseEnd));

      // A beat of hit-stop - a sharp swell - then the rush into the lens.
      const swell = Math.sin(clamp01(u / 0.18) * Math.PI) * 0.25;
      const rush = easeIn(clamp01((u - 0.12) / 0.88));
      if (rasenganRef.current) rasenganRef.current.scale.setScalar(0.42 + swell + rush * 9);

      lungeTarget.set(origin.x + 0.9, origin.y, origin.z + 1.6);
      cam.position.lerp(lungeTarget, 0.14);
      // Impact shake builds with the rush.
      const shake = rush * 0.06;
      cam.position.x += (Math.random() - 0.5) * shake;
      cam.position.y += (Math.random() - 0.5) * shake;
      lookTarget.lerp(origin, 0.35);
      if (groundRef.current) groundRef.current.visible = false;
      if (!fired.current && t >= BEATS.total) {
        fired.current = true;
        onComplete();
      }
    }

    cam.lookAt(lookTarget);
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={42} near={0.1} far={120} />

      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 8, 4]} intensity={2.6} color="#cfe4ff" />
      <pointLight position={[-6, 2, -3]} intensity={3.2} color="#ff8a3d" distance={22} />
      <directionalLight position={[-3, 3, -6]} intensity={1.2} color="#ffb070" />

      {/* Rotated to face +X so he runs across the frame, left to right.
          fitHeight puts him at human scale regardless of the export's units,
          which is what the camera distances below assume. */}
      <group ref={runnerRef} rotation={[0, Math.PI / 2, 0]} position={[0, -0.05, 0]}>
        <OptimizedModel url={RUN_MODEL} fitHeight={1.8} ground autoAnimate onReady={bindHand} />
      </group>

      <group ref={rasenganRef} scale={0}>
        <Rasengan scale={1} intensity={1.2} />
      </group>

      <group ref={speedRef}>
        <SpeedLines />
      </group>

      {/* Ground catches the rasengan light and stops him floating in a void. */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#080c18" roughness={0.85} metalness={0} />
      </mesh>

      <StudioEnvironment variant="night" />
    </>
  );
};

/**
 * `active` false renders the opening frame once and holds it. Index mounts the
 * intro behind the loading screen that way, so shaders compile and the first
 * frame is drawn before the loader fades, instead of a blank gap and a hitch
 * at the start of the shot.
 */
export const IntroSequence = ({ onComplete, active = true }: { onComplete: () => void; active?: boolean }) => {
  const isMobile = useIsMobile();
  const [flash, setFlash] = useState(false);

  const handleShotEnd = useCallback(() => {
    setFlash(true);
    // Hand over once the frame is fully the rasengan's core. RasenganBurst
    // starts on that same gradient, so the cut is invisible.
    window.setTimeout(onComplete, 230);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[120] bg-[#05070f]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Canvas
        frameloop={active ? 'always' : 'demand'}
        dpr={[1, isMobile ? 1.75 : 1.75]}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
        shadows={!isMobile}
      >
        <Suspense fallback={null}>
          <Shot onComplete={handleShotEnd} active={active} />
        </Suspense>
      </Canvas>

      {/* Letterbox bars - cheap, and instantly reads as film. */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-[8vh] bg-black"
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[8vh] bg-black"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <AnimatePresence>
        {flash && (
          <motion.div
            key="chakra-flash"
            className="pointer-events-none absolute inset-0"
            style={{ background: CHAKRA_FILL }}
            // Opacity only: scaling it up from 60% showed its hard rectangular
            // edges against the rasengan for a frame.
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
