import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Float } from "@react-three/drei";
import * as THREE from "three";

// Mouse position tracker
const useMousePosition = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    const handleMouseDown = () => setIsHovering(true);
    const handleMouseUp = () => setIsHovering(false);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  return { mouse, isHovering };
};

// Sage Mode Particles - Orange pigmentation effect
const SageModeParticles = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const sizes = [];
    const count = 200;
    
    for (let i = 0; i < count; i++) {
      // Create particles around the edges of the scene
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 4 + Math.random() * 2;
      
      const x = Math.sin(phi) * Math.cos(theta) * radius;
      const y = Math.sin(phi) * Math.sin(theta) * radius * 0.6;
      const z = Math.cos(phi) * radius * 0.8;
      
      positions.push(x, y, z);
      
      // Orange pigmentation colors
      const orangeVariant = Math.random();
      if (orangeVariant < 0.5) {
        colors.push(1, 0.5, 0.1); // Deep orange
      } else if (orangeVariant < 0.8) {
        colors.push(1, 0.65, 0.2); // Light orange
      } else {
        colors.push(0.95, 0.4, 0.1); // Red-orange
      }
      
      sizes.push(0.03 + Math.random() * 0.05);
    }
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes)
    };
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.02 + mouse.x * 0.1;
      particlesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1 + mouse.y * 0.1;
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
        size={0.12}
        transparent
        opacity={0.6}
        vertexColors
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Chakra Energy Particles - Blue/Purple blend
const ChakraParticles = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const count = 250;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 6;
      const radius = 2.5 + Math.sin(i * 0.08) * 1.2;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.5;
      const y = (Math.random() - 0.5) * 5;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 1.5;
      positions.push(x, y, z);
      
      // Blend of blue and purple
      const blend = Math.random();
      if (blend < 0.4) {
        colors.push(0.2, 0.6, 1); // Blue chakra
      } else if (blend < 0.7) {
        colors.push(0.5, 0.3, 0.9); // Purple
      } else {
        colors.push(0.3, 0.5, 0.95); // Blue-purple blend
      }
    }
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors)
    };
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.03 + mouse.x * 0.15;
      particlesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.08) * 0.15 + mouse.y * 0.1;
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
        size={0.04}
        transparent
        opacity={0.5}
        vertexColors
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Realistic Rasengan
const Rasengan = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const spiralsRef = useRef<THREE.Group>(null);
  
  const spiralLines = useMemo(() => {
    const lines = [];
    for (let s = 0; s < 5; s++) {
      const points = [];
      for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        const angle = t * Math.PI * 3.5 + (s * Math.PI * 2) / 5;
        const radius = 0.7 * (1 - t * 0.25);
        const x = Math.cos(angle) * radius * t;
        const y = Math.sin(angle) * radius * t;
        const z = (t - 0.5) * 0.5;
        points.push(new THREE.Vector3(x, y, z));
      }
      lines.push(points);
    }
    return lines;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.x = mouse.x * 0.3;
      groupRef.current.position.y = mouse.y * 0.3;
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.03;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
    if (spiralsRef.current) {
      spiralsRef.current.rotation.z = clock.getElapsedTime() * 1.5;
      spiralsRef.current.rotation.x = clock.getElapsedTime() * 0.8;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere ref={coreRef} args={[0.25, 32, 32]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </Sphere>
      
      <Sphere args={[0.4, 32, 32]}>
        <meshBasicMaterial color="#4fc3f7" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </Sphere>
      
      <Sphere args={[0.6, 32, 32]}>
        <meshBasicMaterial color="#29b6f6" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </Sphere>
      
      <Sphere args={[0.8, 32, 32]}>
        <meshBasicMaterial color="#03a9f4" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </Sphere>
      
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
            <lineBasicMaterial color="#81d4fa" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
          </line>
        ))}
      </group>
      
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.25, i * 0.4, 0]}>
          <torusGeometry args={[0.75 + i * 0.08, 0.015, 8, 32]} />
          <meshBasicMaterial color="#4fc3f7" transparent opacity={0.3 - i * 0.08} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
};

// Mangekyo Sharingan - Itachi's pattern
const MangekyoItachi = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const patternRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (patternRef.current) {
      patternRef.current.rotation.z = -clock.getElapsedTime() * 0.3;
    }
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.4) * 0.08;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        {/* Outer ring */}
        <mesh>
          <ringGeometry args={[0.36, 0.4, 64]} />
          <meshBasicMaterial color="#1a1a1a" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Red iris */}
        <mesh>
          <circleGeometry args={[0.36, 64]} />
          <meshBasicMaterial color="#b71c1c" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Itachi's three-blade pattern */}
        <group ref={patternRef} position={[0, 0, 0.01]}>
          {[0, 1, 2].map((i) => (
            <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
              {/* Curved blade shape */}
              <mesh position={[0.15, 0, 0]} rotation={[0, 0, 0.3]}>
                <planeGeometry args={[0.18, 0.06]} />
                <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
              </mesh>
              <mesh position={[0.08, 0.06, 0]}>
                <circleGeometry args={[0.04, 16]} />
                <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}
        </group>
        
        {/* Black pupil */}
        <mesh position={[0, 0, 0.015]}>
          <circleGeometry args={[0.06, 32]} />
          <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Glow */}
        <Sphere args={[0.45, 16, 16]} position={[0, 0, -0.08]}>
          <meshBasicMaterial color="#ff0000" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>
    </Float>
  );
};

// Mangekyo Sharingan - Sasuke's pattern (Eternal)
const MangekyoSasuke = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const patternRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (patternRef.current) {
      patternRef.current.rotation.z = clock.getElapsedTime() * 0.25;
    }
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 0.08;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        {/* Outer ring */}
        <mesh>
          <ringGeometry args={[0.36, 0.4, 64]} />
          <meshBasicMaterial color="#1a1a1a" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Red iris */}
        <mesh>
          <circleGeometry args={[0.36, 64]} />
          <meshBasicMaterial color="#8b0000" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Sasuke's star pattern */}
        <group ref={patternRef} position={[0, 0, 0.01]}>
          {/* Six-pointed star design */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh key={i} position={[0, 0, 0]} rotation={[0, 0, (i * Math.PI) / 3]}>
              <planeGeometry args={[0.28, 0.04]} />
              <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
            </mesh>
          ))}
          {/* Inner ring */}
          <mesh position={[0, 0, 0.005]}>
            <ringGeometry args={[0.1, 0.14, 32]} />
            <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
          </mesh>
        </group>
        
        {/* Black pupil */}
        <mesh position={[0, 0, 0.02]}>
          <circleGeometry args={[0.05, 32]} />
          <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Purple glow for Rinnegan influence */}
        <Sphere args={[0.45, 16, 16]} position={[0, 0, -0.08]}>
          <meshBasicMaterial color="#7c4dff" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>
    </Float>
  );
};

// Susanoo Ribcage Effect
const SusanooRibcage = ({ isActive, mouse }: { isActive: boolean; mouse: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);
  const opacity = useRef(0);
  
  useFrame(({ clock }) => {
    // Smooth opacity transition
    const targetOpacity = isActive ? 0.4 : 0.1;
    opacity.current += (targetOpacity - opacity.current) * 0.05;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1 + mouse.x * 0.2;
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshBasicMaterial).opacity = opacity.current * (1 - i * 0.1);
        }
      });
    }
  });

  // Create rib geometry
  const ribs = useMemo(() => {
    const ribData = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI - Math.PI / 2;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.5, 0),
        new THREE.Vector3(Math.sin(angle) * 1.8, -0.5, Math.cos(angle) * 0.8),
        new THREE.Vector3(Math.sin(angle) * 2.2, 0.5, Math.cos(angle) * 1),
        new THREE.Vector3(Math.sin(angle) * 1.8, 1.5, Math.cos(angle) * 0.8),
        new THREE.Vector3(0, 2, 0),
      ]);
      ribData.push(curve.getPoints(30));
    }
    return ribData;
  }, []);

  return (
    <group ref={groupRef}>
      {ribs.map((points, i) => (
        <mesh key={i}>
          <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 20, 0.04, 8, false]} />
          <meshBasicMaterial
            color="#7c4dff"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      {/* Mirror ribs */}
      {ribs.map((points, i) => (
        <mesh key={`mirror-${i}`} scale={[-1, 1, 1]}>
          <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 20, 0.04, 8, false]} />
          <meshBasicMaterial
            color="#7c4dff"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      {/* Outer glow */}
      <Sphere args={[2.5, 32, 32]}>
        <meshBasicMaterial
          color="#9c27b0"
          transparent
          opacity={opacity.current * 0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

// Truth-Seeking Orbs
const TruthSeekingOrb = ({ position, mouse, index }: { position: [number, number, number]; mouse: { x: number; y: number }; index: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime() * 0.2 + index * (Math.PI * 2 / 6);
      const orbitRadius = 2.2;
      groupRef.current.position.x = Math.cos(time) * orbitRadius + mouse.x * 0.2;
      groupRef.current.position.z = Math.sin(time) * orbitRadius * 0.5;
      groupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.2 + mouse.y * 0.15;
    }
    if (orbRef.current) {
      orbRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      orbRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Sphere args={[0.22, 32, 32]}>
        <meshBasicMaterial color="#7c4dff" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
      </Sphere>
      
      <Sphere args={[0.18, 32, 32]}>
        <meshBasicMaterial color="#536dfe" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </Sphere>
      
      <Sphere ref={orbRef} args={[0.14, 32, 32]}>
        <meshStandardMaterial color="#080808" roughness={0.05} metalness={0.95} />
      </Sphere>
      
      <Sphere args={[0.12, 32, 32]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>
    </group>
  );
};

// Ambient Energy Flow
const EnergyFlow = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const flowRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const count = 150;
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 6;
      positions.push(x, y, z);
      
      // Mixed colors for blending
      const type = Math.random();
      if (type < 0.3) {
        colors.push(1, 0.5, 0.2); // Orange (Sage)
      } else if (type < 0.6) {
        colors.push(0.3, 0.6, 1); // Blue (Chakra)
      } else {
        colors.push(0.5, 0.3, 0.8); // Purple
      }
    }
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors)
    };
  }, []);

  useFrame(({ clock }) => {
    if (flowRef.current) {
      flowRef.current.rotation.y = clock.getElapsedTime() * 0.015 + mouse.x * 0.1;
    }
  });

  return (
    <points ref={flowRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.positions.length / 3} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particles.colors.length / 3} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} transparent opacity={0.4} vertexColors sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
};

// Main Scene
const Scene = ({ mouse, isHovering }: { mouse: { x: number; y: number }; isHovering: boolean }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.x = mouse.x * 0.3;
    camera.position.y = mouse.y * 0.2;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={['#080810', 5, 16]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 3, 3]} intensity={0.4} color="#4fc3f7" />
      <pointLight position={[-3, -3, 3]} intensity={0.3} color="#7c4dff" />
      <pointLight position={[0, 4, -3]} intensity={0.25} color="#ff7043" />
      
      {/* Sage Mode particles */}
      <SageModeParticles mouse={mouse} />
      
      {/* Chakra particles */}
      <ChakraParticles mouse={mouse} />
      
      {/* Ambient energy */}
      <EnergyFlow mouse={mouse} />
      
      {/* Central Rasengan */}
      <Rasengan mouse={mouse} />
      
      {/* Susanoo Ribcage - activates on click */}
      <SusanooRibcage isActive={isHovering} mouse={mouse} />
      
      {/* Mangekyo Sharingan variants */}
      <MangekyoItachi position={[3.2, 1.2, -0.5]} />
      <MangekyoSasuke position={[-3.2, -0.8, 0]} />
      <MangekyoItachi position={[2.2, -1.8, 0.5]} />
      
      {/* Truth-Seeking Orbs */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <TruthSeekingOrb key={i} position={[0, 0.3, 0]} mouse={mouse} index={i} />
      ))}
    </>
  );
};

export const Globe3D = () => {
  const { mouse, isHovering } = useMousePosition();
  
  return (
    <div className="absolute inset-0 opacity-85">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene mouse={mouse} isHovering={isHovering} />
      </Canvas>
    </div>
  );
};
