import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * The running model ships with no rasengan mesh, so the jutsu is generated in
 * code: a hot additive core inside a shader-driven swirling shell, plus a real
 * PointLight so the sphere actually lights the character holding it.
 */

const VERTEX = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;

  void main() {
    vPos = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uCoreColor;
  uniform vec3 uEdgeColor;

  varying vec3 vPos;
  varying vec3 vNormal;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }

  void main() {
    // Spiral the noise around the Y axis so the shell reads as rotating chakra
    // rather than drifting fog.
    float angle = atan(vPos.z, vPos.x);
    float radius = length(vPos.xz);
    float swirl = angle + uTime * 3.2 + radius * 7.0;

    float n  = noise(vec3(cos(swirl) * 2.0, vPos.y * 3.0 - uTime * 2.0, sin(swirl) * 2.0));
    n += 0.5 * noise(vec3(cos(swirl) * 4.5, vPos.y * 6.0 - uTime * 3.4, sin(swirl) * 4.5));
    n = clamp(n, 0.0, 1.0);

    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);

    vec3 color = mix(uCoreColor, uEdgeColor, n);
    float alpha = (0.28 + n * 0.55 + fresnel * 0.65) * uOpacity;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
  }
`;

interface RasenganProps {
  scale?: number;
  /** Scales light range and brightness, e.g. to bloom during the transition. */
  intensity?: number;
}

export const Rasengan = ({ scale = 1, intensity = 1 }: RasenganProps) => {
  const shellRef = useRef<THREE.Mesh>(null);
  const innerShellRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uCoreColor: { value: new THREE.Color('#dff4ff') },
      uEdgeColor: { value: new THREE.Color('#2b8cff') },
    }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;

    if (shellRef.current) {
      shellRef.current.rotation.y = t * 1.6;
      shellRef.current.rotation.x = Math.sin(t * 0.8) * 0.25;
    }
    if (innerShellRef.current) {
      innerShellRef.current.rotation.y = -t * 2.4;
      innerShellRef.current.rotation.z = t * 0.9;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.y = t * 2.8;
      ringsRef.current.rotation.x = Math.sin(t * 1.4) * 0.4;
    }
    if (lightRef.current) {
      // Unsteady chakra rather than a clean lamp.
      lightRef.current.intensity = (7 + Math.sin(t * 14) * 1.8) * intensity;
    }
  });

  return (
    <group scale={scale}>
      {/* Hot core */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#eaf8ff" toneMapped={false} />
      </mesh>

      {/* Counter-rotating swirl shells */}
      <mesh ref={innerShellRef}>
        <sphereGeometry args={[0.78, 48, 48]} />
        <shaderMaterial
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={shellRef} scale={1.25}>
        <sphereGeometry args={[0.78, 48, 48]} />
        <shaderMaterial
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Compression rings that sell the spin direction */}
      <group ref={ringsRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2 + i * 0.7, i * 1.1, 0]}>
            <torusGeometry args={[0.95 + i * 0.06, 0.012, 8, 64]} />
            <meshBasicMaterial
              color="#8fd4ff"
              transparent
              opacity={0.5}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      <pointLight ref={lightRef} color="#3fa4ff" distance={14 * intensity} decay={2} />
    </group>
  );
};
