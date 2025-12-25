import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Float } from "@react-three/drei";
import * as THREE from "three";

// Mouse position tracker with click detection
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

// Kurama/Nine-Tails Chakra Cloak
const KuramaChakraCloak = ({ mouse, isActive }: { mouse: { x: number; y: number }; isActive: boolean }) => {
  const cloakRef = useRef<THREE.Group>(null);
  const flameParticlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const count = 300;
    
    for (let i = 0; i < count; i++) {
      // Create flame-like distribution
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.3) * 4;
      const radius = 2 + Math.random() * 1.5 + Math.abs(y) * 0.3;
      
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius * 0.8;
      
      positions.push(x, y, z);
      
      // Orange to yellow flame colors
      const flameType = Math.random();
      if (flameType < 0.4) {
        colors.push(1, 0.4, 0); // Deep orange
      } else if (flameType < 0.7) {
        colors.push(1, 0.6, 0.1); // Orange
      } else if (flameType < 0.9) {
        colors.push(1, 0.8, 0.2); // Yellow-orange
      } else {
        colors.push(1, 0.2, 0); // Red-orange
      }
    }
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors)
    };
  }, []);

  useFrame(({ clock }) => {
    if (cloakRef.current) {
      cloakRef.current.rotation.y = clock.getElapsedTime() * 0.15 + mouse.x * 0.1;
    }
    if (flameParticlesRef.current) {
      const positions = flameParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        // Flame flickering effect
        positions[i + 1] += Math.sin(clock.getElapsedTime() * 3 + i) * 0.01;
      }
      flameParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const opacity = isActive ? 0.7 : 0.3;

  return (
    <group ref={cloakRef}>
      {/* Flame particles */}
      <points ref={flameParticlesRef}>
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
          size={0.15}
          transparent
          opacity={opacity}
          vertexColors
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Inner chakra glow */}
      <Sphere args={[1.8, 32, 32]}>
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={opacity * 0.15}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Outer energy field */}
      <Sphere args={[2.5, 32, 32]}>
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={opacity * 0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

// Amaterasu Black Flames
const AmaterasuFlames = ({ position, isActive }: { position: [number, number, number]; isActive: boolean }) => {
  const flamesRef = useRef<THREE.Group>(null);
  
  const flameGeometry = useMemo(() => {
    const flames = [];
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const radius = 0.3 + Math.random() * 0.2;
      flames.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        height: 0.3 + Math.random() * 0.4,
        delay: i * 0.1,
      });
    }
    return flames;
  }, []);

  useFrame(({ clock }) => {
    if (flamesRef.current) {
      flamesRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          const scale = 1 + Math.sin(clock.getElapsedTime() * 4 + i) * 0.2;
          child.scale.y = scale;
        }
      });
    }
  });

  if (!isActive) return null;

  return (
    <group ref={flamesRef} position={position}>
      {flameGeometry.map((flame, i) => (
        <mesh key={i} position={[flame.x, flame.height / 2, flame.z]}>
          <coneGeometry args={[0.08, flame.height, 8]} />
          <meshBasicMaterial
            color="#1a0a20"
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
      {/* Purple outline glow */}
      <Sphere args={[0.5, 16, 16]}>
        <meshBasicMaterial
          color="#4a0080"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  );
};

// Sage Mode Particles
const SageModeParticles = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const count = 150;
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 4 + Math.random() * 1.5;
      
      const x = Math.sin(phi) * Math.cos(theta) * radius;
      const y = Math.sin(phi) * Math.sin(theta) * radius * 0.5;
      const z = Math.cos(phi) * radius * 0.7;
      
      positions.push(x, y, z);
      
      // Orange pigmentation
      colors.push(1, 0.5 + Math.random() * 0.2, 0.1);
    }
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors)
    };
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.015 + mouse.x * 0.08;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.positions.length / 3} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particles.colors.length / 3} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} transparent opacity={0.5} vertexColors sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
};

// Chakra Particles
const ChakraParticles = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const count = 200;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 5;
      const radius = 2.5 + Math.sin(i * 0.06) * 1;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.2;
      const y = (Math.random() - 0.5) * 4;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 1.2;
      positions.push(x, y, z);
      
      const blend = Math.random();
      if (blend < 0.5) {
        colors.push(0.2, 0.6, 1);
      } else {
        colors.push(0.5, 0.3, 0.9);
      }
    }
    return { positions: new Float32Array(positions), colors: new Float32Array(colors) };
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.02 + mouse.x * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.positions.length / 3} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particles.colors.length / 3} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} transparent opacity={0.4} vertexColors sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
};

// Realistic Rasengan
const Rasengan = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);
  const spiralsRef = useRef<THREE.Group>(null);
  
  const spiralLines = useMemo(() => {
    const lines = [];
    for (let s = 0; s < 4; s++) {
      const points = [];
      for (let i = 0; i <= 35; i++) {
        const t = i / 35;
        const angle = t * Math.PI * 3 + (s * Math.PI * 2) / 4;
        const radius = 0.6 * (1 - t * 0.2);
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius * t,
          Math.sin(angle) * radius * t,
          (t - 0.5) * 0.4
        ));
      }
      lines.push(points);
    }
    return lines;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.x = mouse.x * 0.25;
      groupRef.current.position.y = mouse.y * 0.25;
    }
    if (spiralsRef.current) {
      spiralsRef.current.rotation.z = clock.getElapsedTime() * 1.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[0.2, 32, 32]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
      </Sphere>
      <Sphere args={[0.35, 32, 32]}>
        <meshBasicMaterial color="#4fc3f7" transparent opacity={0.45} blending={THREE.AdditiveBlending} />
      </Sphere>
      <Sphere args={[0.5, 32, 32]}>
        <meshBasicMaterial color="#29b6f6" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
      </Sphere>
      <Sphere args={[0.65, 32, 32]}>
        <meshBasicMaterial color="#03a9f4" transparent opacity={0.12} blending={THREE.AdditiveBlending} />
      </Sphere>
      <group ref={spiralsRef}>
        {spiralLines.map((points, i) => (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" count={points.length} array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color="#81d4fa" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
          </line>
        ))}
      </group>
    </group>
  );
};

// Realistic Mangekyo Sharingan - Itachi
const MangekyoItachi = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const patternRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (patternRef.current) {
      patternRef.current.rotation.z = -clock.getElapsedTime() * 0.2;
    }
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.3) * 0.06;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.2}>
      <group ref={groupRef} position={position}>
        {/* Sclera (white of eye) */}
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[0.42, 64]} />
          <meshBasicMaterial color="#f5f5f5" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Red iris with gradient effect */}
        <mesh>
          <circleGeometry args={[0.38, 64]} />
          <meshBasicMaterial color="#c62828" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Darker red inner ring */}
        <mesh position={[0, 0, 0.003]}>
          <ringGeometry args={[0.12, 0.32, 64]} />
          <meshBasicMaterial color="#8b0000" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
        
        {/* Itachi's three-point pinwheel */}
        <group ref={patternRef} position={[0, 0, 0.006]}>
          {[0, 1, 2].map((i) => (
            <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
              {/* Curved blade */}
              <mesh position={[0.18, 0.02, 0]} rotation={[0, 0, 0.4]}>
                <planeGeometry args={[0.14, 0.05]} />
                <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
              </mesh>
              {/* Blade tip */}
              <mesh position={[0.24, 0.06, 0]}>
                <circleGeometry args={[0.025, 16]} />
                <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
              </mesh>
              {/* Inner connection */}
              <mesh position={[0.1, 0, 0]} rotation={[0, 0, 0.2]}>
                <planeGeometry args={[0.08, 0.025]} />
                <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}
        </group>
        
        {/* Black pupil */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.05, 32]} />
          <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Subtle glow */}
        <Sphere args={[0.5, 16, 16]} position={[0, 0, -0.1]}>
          <meshBasicMaterial color="#ff0000" transparent opacity={0.06} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>
    </Float>
  );
};

// Realistic Mangekyo Sharingan - Sasuke (Eternal)
const MangekyoSasuke = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const patternRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (patternRef.current) {
      patternRef.current.rotation.z = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.2}>
      <group ref={groupRef} position={position}>
        {/* Sclera */}
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[0.42, 64]} />
          <meshBasicMaterial color="#f5f5f5" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Red iris */}
        <mesh>
          <circleGeometry args={[0.38, 64]} />
          <meshBasicMaterial color="#b71c1c" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Sasuke's six-pointed star with inner design */}
        <group ref={patternRef} position={[0, 0, 0.006]}>
          {/* Six pointed star */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
              <planeGeometry args={[0.26, 0.035]} />
              <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
            </mesh>
          ))}
          {/* Inner hexagon ring */}
          <mesh position={[0, 0, 0.002]}>
            <ringGeometry args={[0.08, 0.12, 6]} />
            <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
          </mesh>
          {/* Outer curved elements */}
          {[0, 1, 2].map((i) => (
            <mesh key={`outer-${i}`} position={[0, 0, 0.003]} rotation={[0, 0, (i * Math.PI * 2) / 3 + Math.PI / 6]}>
              <ringGeometry args={[0.22, 0.26, 32, 1, 0, Math.PI / 3]} />
              <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
        
        {/* Black pupil */}
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.04, 32]} />
          <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Purple glow (Rinnegan influence) */}
        <Sphere args={[0.5, 16, 16]} position={[0, 0, -0.1]}>
          <meshBasicMaterial color="#7c4dff" transparent opacity={0.06} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>
    </Float>
  );
};

// Susanoo Ribcage
const SusanooRibcage = ({ isActive, mouse }: { isActive: boolean; mouse: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);
  const opacity = useRef(0);
  
  useFrame(({ clock }) => {
    const targetOpacity = isActive ? 0.5 : 0.08;
    opacity.current += (targetOpacity - opacity.current) * 0.04;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.06 + mouse.x * 0.15;
      groupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshBasicMaterial).opacity = opacity.current;
        }
      });
    }
  });

  const ribs = useMemo(() => {
    const ribData = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI - Math.PI / 2;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.2, 0),
        new THREE.Vector3(Math.sin(angle) * 1.5, -0.4, Math.cos(angle) * 0.6),
        new THREE.Vector3(Math.sin(angle) * 1.8, 0.4, Math.cos(angle) * 0.8),
        new THREE.Vector3(Math.sin(angle) * 1.4, 1.2, Math.cos(angle) * 0.6),
        new THREE.Vector3(0, 1.6, 0),
      ]);
      ribData.push(curve.getPoints(25));
    }
    return ribData;
  }, []);

  return (
    <group ref={groupRef}>
      {ribs.map((points, i) => (
        <mesh key={i}>
          <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 16, 0.03, 6, false]} />
          <meshBasicMaterial color="#7c4dff" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      {ribs.map((points, i) => (
        <mesh key={`mirror-${i}`} scale={[-1, 1, 1]}>
          <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 16, 0.03, 6, false]} />
          <meshBasicMaterial color="#7c4dff" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      <Sphere args={[2, 32, 32]}>
        <meshBasicMaterial color="#9c27b0" transparent opacity={opacity.current * 0.08} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
};

// Truth-Seeking Orbs
const TruthSeekingOrb = ({ mouse, index }: { mouse: { x: number; y: number }; index: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime() * 0.15 + index * (Math.PI * 2 / 6);
      const orbitRadius = 1.8;
      groupRef.current.position.x = Math.cos(time) * orbitRadius + mouse.x * 0.15;
      groupRef.current.position.z = Math.sin(time) * orbitRadius * 0.4;
      groupRef.current.position.y = 0.2 + Math.sin(time * 1.2) * 0.15 + mouse.y * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[0.18, 32, 32]}>
        <meshBasicMaterial color="#7c4dff" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </Sphere>
      <Sphere args={[0.14, 32, 32]}>
        <meshBasicMaterial color="#536dfe" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
      </Sphere>
      <Sphere args={[0.1, 32, 32]}>
        <meshStandardMaterial color="#0a0a0a" roughness={0.05} metalness={0.95} />
      </Sphere>
    </group>
  );
};

// Main Scene
const Scene = ({ mouse, isHovering }: { mouse: { x: number; y: number }; isHovering: boolean }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.x = mouse.x * 0.25;
    camera.position.y = mouse.y * 0.15;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={['#080810', 4, 14]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]} intensity={0.35} color="#4fc3f7" />
      <pointLight position={[-3, -3, 3]} intensity={0.25} color="#7c4dff" />
      <pointLight position={[0, 4, -3]} intensity={0.2} color="#ff7043" />
      
      {/* Kurama Chakra Cloak */}
      <KuramaChakraCloak mouse={mouse} isActive={isHovering} />
      
      {/* Sage Mode particles */}
      <SageModeParticles mouse={mouse} />
      
      {/* Chakra particles */}
      <ChakraParticles mouse={mouse} />
      
      {/* Central Rasengan */}
      <Rasengan mouse={mouse} />
      
      {/* Susanoo Ribcage */}
      <SusanooRibcage isActive={isHovering} mouse={mouse} />
      
      {/* Amaterasu flames - appear on click */}
      <AmaterasuFlames position={[2, -1, 0]} isActive={isHovering} />
      <AmaterasuFlames position={[-2, 1, -0.5]} isActive={isHovering} />
      
      {/* Mangekyo Sharingan */}
      <MangekyoItachi position={[3, 1, -0.5]} />
      <MangekyoSasuke position={[-3, -0.6, 0]} />
      <MangekyoItachi position={[2, -1.5, 0.5]} />
      
      {/* Truth-Seeking Orbs */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <TruthSeekingOrb key={i} mouse={mouse} index={i} />
      ))}
    </>
  );
};

export const Globe3D = () => {
  const { mouse, isHovering } = useMousePosition();
  
  return (
    <div className="absolute inset-0 opacity-80">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 55 }} gl={{ antialias: true, alpha: true }}>
        <Scene mouse={mouse} isHovering={isHovering} />
      </Canvas>
    </div>
  );
};
