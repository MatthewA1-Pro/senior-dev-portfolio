import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

const GlobeWithConnections = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Create random points on sphere surface
  const points = useMemo(() => {
    const positions = [];
    const count = 200;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const x = Math.cos(theta) * Math.sin(phi) * 2;
      const y = Math.sin(theta) * Math.sin(phi) * 2;
      const z = Math.cos(phi) * 2;
      positions.push(x, y, z);
    }
    return new Float32Array(positions);
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group>
      {/* Main globe */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#0a1628"
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Inner glow sphere */}
      <Sphere args={[1.9, 32, 32]}>
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.05}
        />
      </Sphere>

      {/* Outer glow */}
      <Sphere args={[2.2, 32, 32]}>
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Data points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={points}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00ffff"
          size={0.03}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

const FloatingElement = ({ position, color, size }: { position: [number, number, number]; color: string; size: number }) => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={position}>
        <octahedronGeometry args={[size]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
};

export const Globe3D = () => {
  return (
    <div className="absolute inset-0 opacity-80">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
        
        <GlobeWithConnections />
        
        {/* Floating elements */}
        <FloatingElement position={[3.5, 2, -1]} color="#00ffff" size={0.15} />
        <FloatingElement position={[-3.5, -1.5, 0]} color="#8b5cf6" size={0.12} />
        <FloatingElement position={[2.5, -2.5, 1]} color="#ec4899" size={0.1} />
        <FloatingElement position={[-2, 3, 0.5]} color="#22c55e" size={0.08} />
        <FloatingElement position={[4, 0, -2]} color="#00ffff" size={0.18} />
        <FloatingElement position={[-4, 1, 1]} color="#8b5cf6" size={0.14} />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};
