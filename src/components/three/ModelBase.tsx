import { useMemo, useEffect, useRef, useState } from 'react';
import { useGLTF, useProgress, Html, useAnimations, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import * as THREE from 'three';

const DRACO_PATH = '/draco/';

/**
 * Loads a GLB and returns a safe, independent copy of it.
 *
 * Two things this fixes over a plain `scene.clone()`:
 *  - `Object3D.clone()` does not rebind skeletons, so a cloned SkinnedMesh keeps
 *    pointing at the ORIGINAL skeleton's bones. Animating it then does nothing.
 *    SkeletonUtils.clone() rebuilds the bone graph per instance.
 *  - Skinned meshes are authored in bind pose, so their bounding sphere is wrong
 *    once animated and three culls them mid-frame. Disabling frustum culling on
 *    skinned meshes stops them vanishing at the edges of the shot.
 */
export function useModel(url: string) {
  const { scene, animations } = useGLTF(url, DRACO_PATH);

  return useMemo(() => {
    const root = cloneSkinned(scene);

    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if ((mesh as unknown as THREE.SkinnedMesh).isSkinnedMesh) {
        mesh.frustumCulled = false;
      }

      // Clone materials so per-instance tweaks (opacity during transitions)
      // never leak back into the cached source model.
      const sanitize = (source: THREE.Material) => {
        const mat = source.clone() as THREE.MeshStandardMaterial;
        if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
        if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
        mat.needsUpdate = true;
        return mat;
      };

      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(sanitize)
        : sanitize(mesh.material);
    });

    // These four models come from different Sketchfab/FBX pipelines and are
    // authored in different units - one of them is roughly a hundred times the
    // size of another. Measuring here lets callers ask for a world height and
    // stop guessing magic scale numbers that only framed correctly by accident.
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);

    return { root, animations, size, minY: box.min.y };
  }, [scene, animations]);
}

interface OptimizedModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** Plays the model's first embedded clip, if it has one. */
  autoAnimate?: boolean;
  /** Intensity of the subtle mouse-follow rotation, 0 disables it. */
  mouseResponse?: number;
  /** Wraps the model in a gentle idle bob. */
  float?: boolean;
  /**
   * Normalise the model to this world height, whatever units it was authored
   * in. Prefer this over `scale` so camera work stays in predictable units.
   */
  fitHeight?: number;
  /** With `fitHeight`, drops the model so its lowest point rests on y=0. */
  ground?: boolean;
  /** Called once with the cloned root, e.g. to find a bone to attach to. */
  onReady?: (root: THREE.Object3D) => void;
}

export function OptimizedModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  autoAnimate = true,
  mouseResponse = 0,
  float = false,
  fitHeight,
  ground = false,
  onReady,
}: OptimizedModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { root, animations, size, minY } = useModel(url);
  const { actions } = useAnimations(animations, root);

  const finalScale = fitHeight && size.y > 0 ? (fitHeight / size.y) * scale : scale;
  const finalPosition: [number, number, number] = [
    position[0],
    position[1] - (ground ? minY * finalScale : 0),
    position[2],
  ];

  useEffect(() => {
    if (!autoAnimate) return;
    const first = Object.values(actions)[0];
    first?.reset().fadeIn(0.3).play();
    return () => {
      first?.fadeOut(0.3);
    };
  }, [actions, autoAnimate]);

  useEffect(() => {
    onReady?.(root);
  }, [root, onReady]);

  useFrame((state) => {
    if (!groupRef.current || mouseResponse <= 0) return;
    const g = groupRef.current;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.mouse.y * mouseResponse, 0.08);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.mouse.x * mouseResponse, 0.08);
  });

  const model = (
    <group ref={groupRef}>
      <primitive object={root} position={finalPosition} rotation={rotation} scale={finalScale} />
    </group>
  );

  return float ? (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
      {model}
    </Float>
  ) : (
    model
  );
}

/** In-canvas loading indicator for Suspense fallbacks. */
export function ModelLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="w-24 h-[1px] bg-primary/20 rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </Html>
  );
}

/**
 * Reactive low-power check used to scale 3D work down. Uses a wider breakpoint
 * than the UI hook because tablets struggle with WebGL well above 768px.
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false,
  );

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const onChange = () => setIsMobile(window.innerWidth < 1024);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
};

useGLTF.preload('/models/naruto_shippuden.glb', DRACO_PATH);
useGLTF.preload('/models/naruto_uzumaki_running_animation.glb', DRACO_PATH);
