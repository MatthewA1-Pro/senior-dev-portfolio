import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Float, Trail } from "@react-three/drei";
import * as THREE from "three";

// Mouse position tracker
const useMousePosition = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return mouse;
};

// Chakra Energy Particles (Naruto style)
const ChakraParticles = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const count = 400;
    
    for (let i = 0; i < count; i++) {
      // Spiral pattern like chakra flow
      const angle = (i / count) * Math.PI * 8;
      const radius = 2 + Math.sin(i * 0.1) * 1.5;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      const y = (Math.random() - 0.5) * 6;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
      positions.push(x, y, z);
      
      // Naruto orange and Sasuke purple/blue colors
      if (i % 2 === 0) {
        colors.push(1, 0.5, 0.1); // Naruto orange
      } else {
        colors.push(0.4, 0.2, 0.8); // Sasuke purple
      }
    }
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors)
    };
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.1 + mouse.x * 0.5;
      particlesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.3 + mouse.y * 0.3;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        transparent
        opacity={0.8}
        vertexColors
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Rasengan-style Energy Orb
const RasenganOrb = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const orbRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (orbRef.current) {
      orbRef.current.rotation.x = clock.getElapsedTime() * 2;
      orbRef.current.rotation.z = clock.getElapsedTime() * 1.5;
      orbRef.current.position.x = mouse.x * 0.5;
      orbRef.current.position.y = mouse.y * 0.5;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -clock.getElapsedTime() * 3;
      const scale = 1 + Math.sin(clock.getElapsedTime() * 4) * 0.1;
      innerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Outer swirling energy */}
      <mesh ref={orbRef}>
        <torusGeometry args={[1.8, 0.03, 16, 100]} />
        <meshBasicMaterial
          color="#ff7b00"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner core */}
      <Sphere ref={innerRef} args={[1.2, 32, 32]}>
        <meshBasicMaterial
          color="#4fc3f7"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Glow effect */}
      <Sphere args={[1.5, 32, 32]}>
        <meshBasicMaterial
          color="#ff9500"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

// Chidori Lightning Effect (Sasuke style)
const ChidoriLightning = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const lightningRef = useRef<THREE.Group>(null);
  
  const bolts = useMemo(() => {
    const boltData = [];
    for (let i = 0; i < 8; i++) {
      const points = [];
      const angle = (i / 8) * Math.PI * 2;
      let x = Math.cos(angle) * 2;
      let y = 0;
      let z = Math.sin(angle) * 2;
      
      for (let j = 0; j < 10; j++) {
        points.push(new THREE.Vector3(
          x + (Math.random() - 0.5) * 0.3,
          y + j * 0.15,
          z + (Math.random() - 0.5) * 0.3
        ));
        x += (Math.random() - 0.5) * 0.5;
        z += (Math.random() - 0.5) * 0.5;
      }
      boltData.push(points);
    }
    return boltData;
  }, []);

  useFrame(({ clock }) => {
    if (lightningRef.current) {
      lightningRef.current.rotation.y = clock.getElapsedTime() * 0.5 + mouse.x * 1;
      lightningRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.2;
    }
  });

  return (
    <group ref={lightningRef}>
      {bolts.map((points, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#7c4dff"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </group>
  );
};

// Floating Sharingan-inspired element
const SharinganElement = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 2;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={1.5}>
      <group position={position}>
        {/* Outer ring */}
        <mesh ref={ref}>
          <torusGeometry args={[0.3, 0.02, 16, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
        {/* Inner elements */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </Float>
  );
};

// Energy Trail Orb
const EnergyOrb = ({ position, color, mouse }: { position: [number, number, number]; color: string; mouse: { x: number; y: number } }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() + position[1]) * 0.5 + mouse.x * 0.3;
      ref.current.position.y = position[1] + Math.cos(clock.getElapsedTime() * 1.5) * 0.3 + mouse.y * 0.3;
      ref.current.position.z = position[2] + Math.sin(clock.getElapsedTime() * 0.8) * 0.5;
    }
  });

  return (
    <Trail
      width={0.5}
      length={8}
      color={color}
      attenuation={(t) => t * t}
    >
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </Trail>
  );
};

// Swirling Seal Pattern
const SealPattern = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const sealRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (sealRef.current) {
      sealRef.current.rotation.z = clock.getElapsedTime() * 0.3;
      sealRef.current.rotation.x = mouse.y * 0.2;
      sealRef.current.rotation.y = mouse.x * 0.2;
    }
  });

  return (
    <group ref={sealRef} position={[0, 0, -1]}>
      {[1.5, 2, 2.5, 3].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.5]}>
          <torusGeometry args={[radius, 0.015, 8, 64]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#ff6b00" : "#9c27b0"}
            transparent
            opacity={0.3 - i * 0.05}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

// Main Scene
const Scene = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.x = mouse.x * 0.5;
    camera.position.y = mouse.y * 0.3;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={['#0a0a0a', 8, 20]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#ff7b00" />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#7c4dff" />
      <pointLight position={[0, 5, -5]} intensity={0.3} color="#4fc3f7" />
      
      {/* Chakra particles */}
      <ChakraParticles mouse={mouse} />
      
      {/* Central energy orb */}
      <RasenganOrb mouse={mouse} />
      
      {/* Lightning effects */}
      <ChidoriLightning mouse={mouse} />
      
      {/* Seal pattern */}
      <SealPattern mouse={mouse} />
      
      {/* Sharingan elements */}
      <SharinganElement position={[3, 2, -1]} color="#e53935" />
      <SharinganElement position={[-3.5, -1.5, 0]} color="#e53935" />
      <SharinganElement position={[2.5, -2.5, 1]} color="#e53935" />
      
      {/* Energy orbs with trails */}
      <EnergyOrb position={[3, 1, 0]} color="#ff9800" mouse={mouse} />
      <EnergyOrb position={[-3, -1, 1]} color="#7c4dff" mouse={mouse} />
      <EnergyOrb position={[0, 3, -1]} color="#4fc3f7" mouse={mouse} />
      <EnergyOrb position={[-2, 2, 0.5]} color="#ff5722" mouse={mouse} />
      <EnergyOrb position={[2, -2, -0.5]} color="#9c27b0" mouse={mouse} />
    </>
  );
};

export const Globe3D = () => {
  const mouse = useMousePosition();
  
  return (
    <div className="absolute inset-0 opacity-90">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
};
