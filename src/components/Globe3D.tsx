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

// Chakra Energy Particles
const ChakraParticles = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const count = 300;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 8;
      const radius = 3 + Math.sin(i * 0.1) * 1.5;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      const y = (Math.random() - 0.5) * 6;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
      positions.push(x, y, z);
      
      if (i % 2 === 0) {
        colors.push(0.2, 0.6, 1); // Blue chakra
      } else {
        colors.push(0.6, 0.3, 0.9); // Purple
      }
    }
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors)
    };
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.08 + mouse.x * 0.3;
      particlesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.2 + mouse.y * 0.2;
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
        size={0.05}
        transparent
        opacity={0.6}
        vertexColors
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Realistic Rasengan - Swirling blue energy sphere
const Rasengan = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const spiralsRef = useRef<THREE.Group>(null);
  
  // Create spiral geometry for the swirling effect
  const spiralLines = useMemo(() => {
    const lines = [];
    for (let s = 0; s < 6; s++) {
      const points = [];
      for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        const angle = t * Math.PI * 4 + (s * Math.PI * 2) / 6;
        const radius = 0.8 * (1 - t * 0.3);
        const x = Math.cos(angle) * radius * t;
        const y = Math.sin(angle) * radius * t;
        const z = (t - 0.5) * 0.6;
        points.push(new THREE.Vector3(x, y, z));
      }
      lines.push(points);
    }
    return lines;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.x = mouse.x * 0.4;
      groupRef.current.position.y = mouse.y * 0.4;
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 8) * 0.05;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
    if (spiralsRef.current) {
      spiralsRef.current.rotation.z = clock.getElapsedTime() * 5;
      spiralsRef.current.rotation.x = clock.getElapsedTime() * 2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core bright center */}
      <Sphere ref={coreRef} args={[0.3, 32, 32]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </Sphere>
      
      {/* Inner blue glow */}
      <Sphere args={[0.5, 32, 32]}>
        <meshBasicMaterial
          color="#4fc3f7"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Mid layer */}
      <Sphere args={[0.7, 32, 32]}>
        <meshBasicMaterial
          color="#29b6f6"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Outer glow */}
      <Sphere args={[0.9, 32, 32]}>
        <meshBasicMaterial
          color="#03a9f4"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Swirling spiral lines */}
      <group ref={spiralsRef}>
        {spiralLines.map((points, i) => (
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
              color="#81d4fa"
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </line>
        ))}
      </group>
      
      {/* Outer energy rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
          <torusGeometry args={[0.85 + i * 0.1, 0.02, 8, 32]} />
          <meshBasicMaterial
            color="#4fc3f7"
            transparent
            opacity={0.4 - i * 0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

// Realistic Sharingan Eye
const Sharingan = ({ position, tomoeCount = 3 }: { position: [number, number, number]; tomoeCount?: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const tomoeRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (tomoeRef.current) {
      tomoeRef.current.rotation.z = -clock.getElapsedTime() * 1.5;
    }
    if (groupRef.current) {
      // Subtle floating
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.8) * 0.1;
    }
  });

  // Create tomoe (comma-shaped marks) geometry
  const TomoeShape = ({ rotation }: { rotation: number }) => {
    return (
      <group rotation={[0, 0, rotation]}>
        {/* Main comma body */}
        <mesh position={[0.18, 0, 0.01]}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
        </mesh>
        {/* Tail curve */}
        <mesh position={[0.22, -0.04, 0.01]} rotation={[0, 0, -0.5]}>
          <planeGeometry args={[0.08, 0.03]} />
          <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
        </mesh>
      </group>
    );
  };

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        {/* Outer black ring (eyeliner effect) */}
        <mesh>
          <ringGeometry args={[0.38, 0.42, 64]} />
          <meshBasicMaterial color="#1a1a1a" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Red iris */}
        <mesh>
          <circleGeometry args={[0.38, 64]} />
          <meshBasicMaterial color="#b71c1c" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Darker red ring */}
        <mesh position={[0, 0, 0.005]}>
          <ringGeometry args={[0.25, 0.35, 64]} />
          <meshBasicMaterial color="#8b0000" side={THREE.DoubleSide} transparent opacity={0.5} />
        </mesh>
        
        {/* Inner black ring around pupil */}
        <mesh position={[0, 0, 0.008]}>
          <ringGeometry args={[0.08, 0.12, 32]} />
          <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Black pupil */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.08, 32]} />
          <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Rotating tomoe */}
        <group ref={tomoeRef} position={[0, 0, 0.015]}>
          {Array.from({ length: tomoeCount }).map((_, i) => (
            <TomoeShape key={i} rotation={(i * Math.PI * 2) / tomoeCount} />
          ))}
        </group>
        
        {/* Subtle glow */}
        <Sphere args={[0.5, 16, 16]} position={[0, 0, -0.1]}>
          <meshBasicMaterial
            color="#ff0000"
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
          />
        </Sphere>
      </group>
    </Float>
  );
};

// Truth-Seeking Orbs (Gudōdama) - Black spheres with purple/blue outline
const TruthSeekingOrb = ({ position, mouse, index }: { position: [number, number, number]; mouse: { x: number; y: number }; index: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Orbit around a center point
      const time = clock.getElapsedTime() * 0.5 + index * (Math.PI * 2 / 6);
      const orbitRadius = 2.5;
      groupRef.current.position.x = Math.cos(time) * orbitRadius + mouse.x * 0.3;
      groupRef.current.position.z = Math.sin(time) * orbitRadius * 0.5;
      groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.3 + mouse.y * 0.2;
    }
    if (orbRef.current) {
      orbRef.current.rotation.x = clock.getElapsedTime() * 0.5;
      orbRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer purple/blue glow */}
      <Sphere args={[0.25, 32, 32]}>
        <meshBasicMaterial
          color="#7c4dff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Secondary glow layer */}
      <Sphere args={[0.22, 32, 32]}>
        <meshBasicMaterial
          color="#536dfe"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Main black orb */}
      <Sphere ref={orbRef} args={[0.18, 32, 32]}>
        <meshStandardMaterial
          color="#050505"
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>
      
      {/* Inner dark core */}
      <Sphere args={[0.15, 32, 32]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>
      
      {/* Subtle surface pattern */}
      <Sphere args={[0.185, 16, 16]}>
        <meshBasicMaterial
          color="#1a1a2e"
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>
    </group>
  );
};

// Chidori Lightning Effect
const ChidoriLightning = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const lightningRef = useRef<THREE.Group>(null);
  
  const bolts = useMemo(() => {
    const boltData = [];
    for (let i = 0; i < 12; i++) {
      const points = [];
      const angle = (i / 12) * Math.PI * 2;
      let x = Math.cos(angle) * 1.5;
      let y = 0;
      let z = Math.sin(angle) * 1.5;
      
      for (let j = 0; j < 8; j++) {
        points.push(new THREE.Vector3(
          x + (Math.random() - 0.5) * 0.4,
          y + j * 0.2 - 0.8,
          z + (Math.random() - 0.5) * 0.4
        ));
        x += (Math.random() - 0.5) * 0.6;
        z += (Math.random() - 0.5) * 0.6;
      }
      boltData.push(points);
    }
    return boltData;
  }, []);

  useFrame(({ clock }) => {
    if (lightningRef.current) {
      lightningRef.current.rotation.y = clock.getElapsedTime() * 0.8 + mouse.x * 0.8;
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
            color="#b388ff"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </group>
  );
};

// Energy Trail Orb
const EnergyOrb = ({ position, color, mouse }: { position: [number, number, number]; color: string; mouse: { x: number; y: number } }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() + position[1]) * 0.5 + mouse.x * 0.2;
      ref.current.position.y = position[1] + Math.cos(clock.getElapsedTime() * 1.5) * 0.3 + mouse.y * 0.2;
      ref.current.position.z = position[2] + Math.sin(clock.getElapsedTime() * 0.8) * 0.5;
    }
  });

  return (
    <Trail
      width={0.3}
      length={6}
      color={color}
      attenuation={(t) => t * t}
    >
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </Trail>
  );
};

// Main Scene
const Scene = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.x = mouse.x * 0.4;
    camera.position.y = mouse.y * 0.25;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={['#0a0a0a', 6, 18]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={0.6} color="#4fc3f7" />
      <pointLight position={[-3, -3, 3]} intensity={0.4} color="#7c4dff" />
      <pointLight position={[0, 4, -3]} intensity={0.3} color="#ff5252" />
      
      {/* Chakra particles */}
      <ChakraParticles mouse={mouse} />
      
      {/* Central Rasengan */}
      <Rasengan mouse={mouse} />
      
      {/* Lightning effects around rasengan */}
      <ChidoriLightning mouse={mouse} />
      
      {/* Sharingan eyes */}
      <Sharingan position={[3.5, 1.5, -1]} tomoeCount={3} />
      <Sharingan position={[-3.5, -1, 0]} tomoeCount={3} />
      <Sharingan position={[2.5, -2, 1]} tomoeCount={2} />
      
      {/* Truth-Seeking Orbs orbiting */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <TruthSeekingOrb
          key={i}
          position={[0, 0.5, 0]}
          mouse={mouse}
          index={i}
        />
      ))}
      
      {/* Energy orbs with trails */}
      <EnergyOrb position={[4, 2, 0]} color="#4fc3f7" mouse={mouse} />
      <EnergyOrb position={[-4, -1.5, 1]} color="#7c4dff" mouse={mouse} />
      <EnergyOrb position={[0, 3.5, -1]} color="#ff9800" mouse={mouse} />
    </>
  );
};

export const Globe3D = () => {
  const mouse = useMousePosition();
  
  return (
    <div className="absolute inset-0 opacity-90">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
};
