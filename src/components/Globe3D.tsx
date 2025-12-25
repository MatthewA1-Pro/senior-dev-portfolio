import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls, Float, Torus, Box, Icosahedron } from "@react-three/drei";
import * as THREE from "three";

// Particle System
const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const count = 500;
    for (let i = 0; i < count; i++) {
      positions.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
    }
    return new Float32Array(positions);
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.02;
      particlesRef.current.rotation.x = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00ffff"
        size={0.02}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Animated Ring
const AnimatedRing = ({ radius, color, speed }: { radius: number; color: string; speed: number }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = clock.getElapsedTime() * speed;
      ringRef.current.rotation.z = clock.getElapsedTime() * speed * 0.5;
    }
  });

  return (
    <Torus ref={ringRef} args={[radius, 0.02, 16, 100]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.6}
      />
    </Torus>
  );
};

// Floating Cube with edges
const FloatingCube = ({ position, size, color }: { position: [number, number, number]; size: number; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <Box ref={meshRef} args={[size, size, size]} position={position}>
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.4}
        />
      </Box>
    </Float>
  );
};

// Main Globe with connections
const GlobeWithConnections = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const points = useMemo(() => {
    const positions = [];
    const count = 300;
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
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group>
      {/* Main globe wireframe */}
      <Sphere ref={meshRef} args={[2, 48, 48]}>
        <meshStandardMaterial
          color="#0a1628"
          wireframe
          transparent
          opacity={0.25}
        />
      </Sphere>

      {/* Inner glow sphere */}
      <Sphere args={[1.9, 32, 32]}>
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.03}
        />
      </Sphere>

      {/* Outer glow */}
      <Sphere args={[2.3, 32, 32]}>
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
          size={0.04}
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>

      {/* Orbital rings */}
      <AnimatedRing radius={2.8} color="#00ffff" speed={0.15} />
      <AnimatedRing radius={3.2} color="#8b5cf6" speed={-0.1} />
      <AnimatedRing radius={3.6} color="#ec4899" speed={0.08} />
    </group>
  );
};

// Floating Icosahedron
const FloatingIcosahedron = ({ position, size, color }: { position: [number, number, number]; size: number; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1}>
      <Icosahedron ref={meshRef} args={[size]} position={position}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.8}
        />
      </Icosahedron>
    </Float>
  );
};

// Simple floating element
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
    <div className="absolute inset-0 opacity-90">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={['#0a0a0a', 5, 25]} />
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />
        <pointLight position={[0, 10, 0]} intensity={0.3} color="#ec4899" />
        
        {/* Background particles */}
        <ParticleField />
        
        {/* Main globe */}
        <GlobeWithConnections />
        
        {/* Floating geometric elements */}
        <FloatingElement position={[4, 2.5, -2]} color="#00ffff" size={0.18} />
        <FloatingElement position={[-4, -2, 0]} color="#8b5cf6" size={0.15} />
        <FloatingElement position={[3, -3, 1]} color="#ec4899" size={0.12} />
        <FloatingElement position={[-3, 3.5, 0.5]} color="#22c55e" size={0.1} />
        <FloatingElement position={[5, 0.5, -3]} color="#00ffff" size={0.2} />
        <FloatingElement position={[-5, 1.5, 1]} color="#8b5cf6" size={0.16} />
        
        {/* Floating cubes */}
        <FloatingCube position={[-4.5, -3, -1]} size={0.4} color="#00ffff" />
        <FloatingCube position={[4.5, 3, -2]} size={0.35} color="#8b5cf6" />
        <FloatingCube position={[-3, 4, 1]} size={0.3} color="#ec4899" />
        
        {/* Floating icosahedrons */}
        <FloatingIcosahedron position={[5, -2, 0]} size={0.25} color="#22c55e" />
        <FloatingIcosahedron position={[-5, 2.5, -1]} size={0.2} color="#00ffff" />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
};
