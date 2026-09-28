import { Environment, Lightformer } from '@react-three/drei';

/**
 * Environment maps built in-engine instead of `<Environment preset="...">`.
 *
 * The presets fetch an HDRI from a third-party CDN (pmndrs/assets) on every
 * scene: a multi-megabyte third-party download that also parks an entry in
 * three's loading manager, so the site's own progress bar could never reach
 * 100% while it was pending. Lightformers render the same job locally in a
 * 256px cubemap baked once, with no network involved.
 */

type Variant = 'hero' | 'night' | 'lantern';

export const StudioEnvironment = ({ variant }: { variant: Variant }) => {
  if (variant === 'hero') {
    return (
      <Environment resolution={256} frames={1}>
        {/* Cool key from above, warm chakra bounce from below. */}
        <Lightformer intensity={2.2} color="#ffffff" position={[0, 5, -2]} scale={[8, 8, 1]} />
        <Lightformer intensity={1.4} color="#ffb070" position={[-4, 0, 2]} scale={[5, 5, 1]} />
        <Lightformer intensity={1.1} color="#5aa0ff" position={[4, 1, -3]} scale={[5, 5, 1]} />
        <Lightformer intensity={0.5} color="#2a3450" position={[0, -4, 0]} scale={[10, 10, 1]} />
      </Environment>
    );
  }

  if (variant === 'lantern') {
    return (
      <Environment resolution={256} frames={1}>
        {/* Lantern glow inside the stall, moonlight outside it. */}
        <Lightformer intensity={2.6} color="#ffbb66" position={[0, 3, 0]} scale={[6, 4, 1]} />
        <Lightformer intensity={0.9} color="#5f7dd0" position={[-6, 5, 6]} scale={[8, 8, 1]} />
        <Lightformer intensity={0.4} color="#1b2138" position={[0, -3, 0]} scale={[10, 10, 1]} />
      </Environment>
    );
  }

  return (
    <Environment resolution={256} frames={1}>
      {/* Night: dim, blue, with one hard rim so silhouettes stay readable. */}
      <Lightformer intensity={0.9} color="#7fa6ff" position={[0, 6, -4]} scale={[9, 9, 1]} />
      <Lightformer intensity={0.6} color="#ff9a5c" position={[-6, 1, 3]} scale={[5, 5, 1]} />
      <Lightformer intensity={0.25} color="#141b30" position={[0, -4, 0]} scale={[10, 10, 1]} />
    </Environment>
  );
};
