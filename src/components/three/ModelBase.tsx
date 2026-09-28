import { useMemo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGLTF, useProgress, Html, useAnimations, Float } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
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

        // Unlit, untextured materials (Baryon's vertex-coloured shell) carry no
        // alpha to blend, but a transparent flag still pushes them into the
        // sorted pass where overlapping shells show through each other - the
        // "see-through" look. Opaque is correct for them.
        const basic = mat as unknown as THREE.MeshBasicMaterial;
        if (basic.isMeshBasicMaterial && !basic.map && basic.opacity >= 1) {
          basic.transparent = false;
          basic.depthWrite = true;
        }

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
    // Descendant world matrices are stale on a fresh clone, and Box3 reads
    // them, so measure only after forcing an update.
    root.updateWorldMatrix(false, true);

    const box = new THREE.Box3().setFromObject(root);

    // Box3.setFromObject measures a SkinnedMesh from its node transform and
    // bind-pose geometry, which can be nowhere near where it actually renders -
    // the running model measures 0.06 units that way while its skeleton spans
    // 1.7. Union in the bone positions so skinned characters are sized by the
    // rig that actually drives them.
    const bonePoint = new THREE.Vector3();
    root.traverse((child) => {
      const skinned = child as THREE.SkinnedMesh;
      if (!skinned.isSkinnedMesh || !skinned.skeleton) return;
      skinned.skeleton.bones.forEach((bone) => {
        bone.updateWorldMatrix(true, false);
        box.expandByPoint(bonePoint.setFromMatrixPosition(bone.matrixWorld));
      });
    });
    const size = new THREE.Vector3();
    box.getSize(size);

    const boxCenter = new THREE.Vector3();
    box.getCenter(boxCenter);

    if (typeof window !== 'undefined' && window.localStorage?.getItem('debugModels')) {
      console.log(
        `MODELSIZE ${url} size=${size.x.toFixed(3)},${size.y.toFixed(3)},${size.z.toFixed(3)}` +
          ` center=${boxCenter.x.toFixed(3)},${boxCenter.y.toFixed(3)},${boxCenter.z.toFixed(3)}` +
          ` minY=${box.min.y.toFixed(3)}`,
      );
    }

    return { root, animations, size, boxCenter, minY: box.min.y };
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
  /** Drops the model so its lowest point rests on y=0. */
  ground?: boolean;
  /**
   * Puts the model's measured bounding-box centre on the origin. Preferred over
   * drei's <Center>, which measures in a layout effect and did not reliably
   * re-measure once the model resolved from Suspense, leaving the figure
   * offset far enough that only its legs were in frame.
   */
  center?: boolean;
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
  center = false,
  onReady,
}: OptimizedModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { root, animations, size, boxCenter, minY } = useModel(url);
  const { actions } = useAnimations(animations, root);

  const finalScale = fitHeight && size.y > 0 ? (fitHeight / size.y) * scale : scale;

  // Offsets stay in the model's own units, because they are applied inside the
  // scaling group below.
  const offset: [number, number, number] = center
    ? [-boxCenter.x, -boxCenter.y, -boxCenter.z]
    : ground
      ? [0, -minY, 0]
      : [0, 0, 0];

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

  // Nothing is set on the primitive itself. R3F assigns transform props
  // directly onto the object, which REPLACES the root transform the GLTF was
  // authored with - several of these models carry a unit-conversion scale
  // there, so writing scale onto the primitive discarded it and rendered the
  // model at the wrong size after it had been measured with it. Wrapping in
  // plain groups composes with the authored transform instead.
  const model = (
    <group position={position} rotation={rotation}>
      {/* Separate group so the mouse-follow rotation does not fight the
          static rotation prop. */}
      <group ref={groupRef}>
        <group scale={finalScale}>
          <group position={offset}>
            <primitive object={root} />
          </group>
        </group>
      </group>
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

/**
 * Pulls the camera back to fit a model, derived from its measured bounding
 * sphere rather than a hand-tuned distance.
 *
 * Fitting on height alone is not enough here: this hero model's bounding box is
 * deeper (3.7 world units) than it is tall, because of the orbs and rods
 * floating around him, so the nearest geometry sits far closer to the lens than
 * his centre and overflowed the frame every time.
 */
export function FitCamera({
  url,
  fitHeight,
  fov,
  margin = 1.1,
  direction = [0, 0, 1],
}: {
  url: string;
  fitHeight: number;
  fov: number;
  margin?: number;
  /** Which side the camera sits on, e.g. a 3/4 view of a building. */
  direction?: [number, number, number];
}) {
  const { size } = useModel(url);
  const camera = useThree((s) => s.camera);
  const viewport = useThree((s) => s.size);
  const controls = useThree((s) => s.controls) as { update?: () => void } | null;
  const [dx, dy, dz] = direction;

  useLayoutEffect(() => {
    if (size.y <= 0 || viewport.height <= 0) return;
    const s = fitHeight / size.y;
    const h = size.y * s;
    // Seen off-axis, a building's footprint projects wider than its x extent.
    const w = (dx !== 0 || dz !== 1 ? Math.max(size.x, size.z) : size.x) * s;

    // Fit the silhouette against the canvas's real aspect ratio. Fitting the
    // bounding sphere instead (the previous approach) counted the orbs and rods
    // floating round him in depth, and pulled the camera back until the hero
    // was a speck.
    const aspect = viewport.width / viewport.height;
    const vHalf = (fov / 2) * THREE.MathUtils.DEG2RAD;
    const hHalf = Math.atan(Math.tan(vHalf) * aspect);
    const distance = Math.max(h / 2 / Math.tan(vHalf), w / 2 / Math.tan(hHalf)) * margin;

    const dir = new THREE.Vector3(dx, dy, dz).normalize();
    camera.position.copy(dir.multiplyScalar(distance));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    controls?.update?.();
  }, [size, fitHeight, fov, margin, camera, controls, viewport.width, viewport.height, dx, dy, dz]);

  return null;
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
