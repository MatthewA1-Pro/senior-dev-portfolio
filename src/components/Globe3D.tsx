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

// Six Paths Sage Mode - Golden energy aura
const SixPathsAura = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const auraRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const count = 250;
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 1.5 + Math.random() * 1;
      
      const x = Math.sin(phi) * Math.cos(theta) * radius;
      const y = Math.sin(phi) * Math.sin(theta) * radius;
      const z = Math.cos(phi) * radius * 0.6;
      
      positions.push(x, y, z);
      
      // Golden colors
      const gold = Math.random();
      if (gold < 0.5) {
        colors.push(1, 0.85, 0.2); // Bright gold
      } else if (gold < 0.8) {
        colors.push(1, 0.7, 0.1); // Deep gold
      } else {
        colors.push(1, 0.95, 0.6); // Light gold
      }
    }
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors)
    };
  }, []);

  useFrame(({ clock }) => {
    if (auraRef.current) {
      auraRef.current.rotation.y = clock.getElapsedTime() * 0.1 + mouse.x * 0.1;
      // Pulsing scale
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.05;
      auraRef.current.scale.set(pulse, pulse, pulse);
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group>
      {/* Golden particles */}
      <points ref={auraRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particles.positions.length / 3} array={particles.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={particles.colors.length / 3} array={particles.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.08} transparent opacity={0.7} vertexColors sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      
      {/* Golden aura glow */}
      <Sphere args={[1.2, 32, 32]}>
        <meshBasicMaterial color="#ffd700" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
      </Sphere>
      
      {/* Outer golden halo */}
      <Sphere args={[2, 32, 32]}>
        <meshBasicMaterial color="#ffb300" transparent opacity={0.04} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </Sphere>
      
      {/* Six Paths rings */}
      <group ref={ringsRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, i * Math.PI / 3]}>
            <torusGeometry args={[1.6 + i * 0.15, 0.01, 8, 64]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.3 - i * 0.08} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Kurama/Nine-Tails Chakra Cloak
const KuramaChakraCloak = ({ mouse, isActive }: { mouse: { x: number; y: number }; isActive: boolean }) => {
  const cloakRef = useRef<THREE.Group>(null);
  const flameParticlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const count = 200;
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.3) * 3;
      const radius = 2.5 + Math.random() * 1 + Math.abs(y) * 0.2;
      
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius * 0.7;
      
      positions.push(x, y, z);
      
      const flameType = Math.random();
      if (flameType < 0.4) {
        colors.push(1, 0.4, 0);
      } else if (flameType < 0.7) {
        colors.push(1, 0.6, 0.1);
      } else {
        colors.push(1, 0.8, 0.2);
      }
    }
    return { positions: new Float32Array(positions), colors: new Float32Array(colors) };
  }, []);

  useFrame(({ clock }) => {
    if (cloakRef.current) {
      cloakRef.current.rotation.y = clock.getElapsedTime() * 0.1 + mouse.x * 0.08;
    }
  });

  const opacity = isActive ? 0.6 : 0.25;

  return (
    <group ref={cloakRef}>
      <points ref={flameParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particles.positions.length / 3} array={particles.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={particles.colors.length / 3} array={particles.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.12} transparent opacity={opacity} vertexColors sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      
      <Sphere args={[2.2, 32, 32]}>
        <meshBasicMaterial color="#ff6600" transparent opacity={opacity * 0.1} blending={THREE.AdditiveBlending} />
      </Sphere>
    </group>
  );
};

// Fixed Amaterasu Black Flames - Using spheres instead of cones
const AmaterasuFlames = ({ position, isActive }: { position: [number, number, number]; isActive: boolean }) => {
  const flamesRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(0);
  
  useFrame(({ clock }) => {
    // Smooth opacity transition
    const targetOpacity = isActive ? 1 : 0;
    opacityRef.current += (targetOpacity - opacityRef.current) * 0.1;
    
    if (flamesRef.current) {
      flamesRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshBasicMaterial).opacity = opacityRef.current * (0.6 + Math.sin(clock.getElapsedTime() * 5 + i) * 0.2);
          // Flickering scale
          const flicker = 1 + Math.sin(clock.getElapsedTime() * 8 + i * 0.5) * 0.15;
          child.scale.set(flicker, flicker * 1.2, flicker);
        }
      });
    }
  });

  return (
    <group ref={flamesRef} position={position}>
      {/* Main black flame particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.2 + Math.random() * 0.1;
        return (
          <Sphere
            key={i}
            args={[0.08 + Math.random() * 0.04, 8, 8]}
            position={[
              Math.cos(angle) * radius,
              0.1 + Math.random() * 0.3,
              Math.sin(angle) * radius
            ]}
          >
            <meshBasicMaterial color="#0a0010" transparent opacity={0} />
          </Sphere>
        );
      })}
      
      {/* Core dark mass */}
      <Sphere args={[0.15, 16, 16]}>
        <meshBasicMaterial color="#050008" transparent opacity={opacityRef.current * 0.9} />
      </Sphere>
      
      {/* Purple/dark outline glow */}
      <Sphere args={[0.35, 16, 16]}>
        <meshBasicMaterial color="#2a0040" transparent opacity={opacityRef.current * 0.4} blending={THREE.AdditiveBlending} />
      </Sphere>
      
      {/* Outer dark aura */}
      <Sphere args={[0.5, 16, 16]}>
        <meshBasicMaterial color="#1a0030" transparent opacity={opacityRef.current * 0.2} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
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
    const count = 120;
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 3.5 + Math.random() * 1.5;
      
      positions.push(
        Math.sin(phi) * Math.cos(theta) * radius,
        Math.sin(phi) * Math.sin(theta) * radius * 0.5,
        Math.cos(phi) * radius * 0.6
      );
      
      colors.push(1, 0.5 + Math.random() * 0.2, 0.1);
    }
    return { positions: new Float32Array(positions), colors: new Float32Array(colors) };
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.012 + mouse.x * 0.06;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.positions.length / 3} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particles.colors.length / 3} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} transparent opacity={0.45} vertexColors sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
};

// Chakra Particles
const ChakraParticles = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = [];
    const colors = [];
    const count = 180;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 5;
      const radius = 2.8 + Math.sin(i * 0.05) * 0.8;
      positions.push(
        Math.cos(angle) * radius + (Math.random() - 0.5),
        (Math.random() - 0.5) * 3.5,
        Math.sin(angle) * radius + (Math.random() - 0.5)
      );
      
      if (Math.random() < 0.5) {
        colors.push(0.2, 0.6, 1);
      } else {
        colors.push(0.5, 0.3, 0.9);
      }
    }
    return { positions: new Float32Array(positions), colors: new Float32Array(colors) };
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
      <pointsMaterial size={0.03} transparent opacity={0.35} vertexColors sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
};

// Rasengan
const Rasengan = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);
  const spiralsRef = useRef<THREE.Group>(null);
  
  const spiralLines = useMemo(() => {
    const lines = [];
    for (let s = 0; s < 4; s++) {
      const points = [];
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const angle = t * Math.PI * 3 + (s * Math.PI * 2) / 4;
        const radius = 0.5 * (1 - t * 0.2);
        points.push(new THREE.Vector3(Math.cos(angle) * radius * t, Math.sin(angle) * radius * t, (t - 0.5) * 0.35));
      }
      lines.push(points);
    }
    return lines;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.x = mouse.x * 0.2;
      groupRef.current.position.y = mouse.y * 0.2;
    }
    if (spiralsRef.current) {
      spiralsRef.current.rotation.z = clock.getElapsedTime() * 1;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[0.18, 32, 32]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
      </Sphere>
      <Sphere args={[0.3, 32, 32]}>
        <meshBasicMaterial color="#4fc3f7" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </Sphere>
      <Sphere args={[0.45, 32, 32]}>
        <meshBasicMaterial color="#29b6f6" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </Sphere>
      <Sphere args={[0.6, 32, 32]}>
        <meshBasicMaterial color="#03a9f4" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
      </Sphere>
      <group ref={spiralsRef}>
        {spiralLines.map((points, i) => (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" count={points.length} array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial color="#81d4fa" transparent opacity={0.45} blending={THREE.AdditiveBlending} />
          </line>
        ))}
      </group>
    </group>
  );
};

// Mangekyo Sharingan - Itachi
const MangekyoItachi = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const patternRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (patternRef.current) {
      patternRef.current.rotation.z = -clock.getElapsedTime() * 0.15;
    }
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.25) * 0.05;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.02} floatIntensity={0.15}>
      <group ref={groupRef} position={position}>
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[0.4, 64]} />
          <meshBasicMaterial color="#f0f0f0" side={THREE.DoubleSide} />
        </mesh>
        
        <mesh>
          <circleGeometry args={[0.35, 64]} />
          <meshBasicMaterial color="#c62828" side={THREE.DoubleSide} />
        </mesh>
        
        <mesh position={[0, 0, 0.003]}>
          <ringGeometry args={[0.1, 0.3, 64]} />
          <meshBasicMaterial color="#8b0000" side={THREE.DoubleSide} transparent opacity={0.5} />
        </mesh>
        
        <group ref={patternRef} position={[0, 0, 0.006]}>
          {[0, 1, 2].map((i) => (
            <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
              <mesh position={[0.16, 0.02, 0]} rotation={[0, 0, 0.35]}>
                <planeGeometry args={[0.12, 0.04]} />
                <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
              </mesh>
              <mesh position={[0.22, 0.05, 0]}>
                <circleGeometry args={[0.022, 16]} />
                <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
              </mesh>
              <mesh position={[0.09, 0, 0]} rotation={[0, 0, 0.15]}>
                <planeGeometry args={[0.06, 0.02]} />
                <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}
        </group>
        
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.045, 32]} />
          <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
        </mesh>
        
        <Sphere args={[0.45, 16, 16]} position={[0, 0, -0.1]}>
          <meshBasicMaterial color="#ff0000" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>
    </Float>
  );
};

// Mangekyo Sharingan - Sasuke
const MangekyoSasuke = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const patternRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (patternRef.current) {
      patternRef.current.rotation.z = clock.getElapsedTime() * 0.12;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.02} floatIntensity={0.15}>
      <group ref={groupRef} position={position}>
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[0.4, 64]} />
          <meshBasicMaterial color="#f0f0f0" side={THREE.DoubleSide} />
        </mesh>
        
        <mesh>
          <circleGeometry args={[0.35, 64]} />
          <meshBasicMaterial color="#b71c1c" side={THREE.DoubleSide} />
        </mesh>
        
        <group ref={patternRef} position={[0, 0, 0.006]}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
              <planeGeometry args={[0.24, 0.03]} />
              <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
            </mesh>
          ))}
          <mesh position={[0, 0, 0.002]}>
            <ringGeometry args={[0.07, 0.1, 6]} />
            <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
          </mesh>
        </group>
        
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.035, 32]} />
          <meshBasicMaterial color="#000000" side={THREE.DoubleSide} />
        </mesh>
        
        <Sphere args={[0.45, 16, 16]} position={[0, 0, -0.1]}>
          <meshBasicMaterial color="#7c4dff" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
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
    const targetOpacity = isActive ? 0.45 : 0.06;
    opacity.current += (targetOpacity - opacity.current) * 0.03;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.04 + mouse.x * 0.1;
      groupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          (child.material as THREE.MeshBasicMaterial).opacity = opacity.current;
        }
      });
    }
  });

  const ribs = useMemo(() => {
    const ribData = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI - Math.PI / 2;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(Math.sin(angle) * 1.3, -0.3, Math.cos(angle) * 0.5),
        new THREE.Vector3(Math.sin(angle) * 1.5, 0.3, Math.cos(angle) * 0.6),
        new THREE.Vector3(Math.sin(angle) * 1.2, 1, Math.cos(angle) * 0.5),
        new THREE.Vector3(0, 1.3, 0),
      ]);
      ribData.push(curve.getPoints(20));
    }
    return ribData;
  }, []);

  return (
    <group ref={groupRef}>
      {ribs.map((points, i) => (
        <mesh key={i}>
          <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 12, 0.025, 6, false]} />
          <meshBasicMaterial color="#7c4dff" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      {ribs.map((points, i) => (
        <mesh key={`mirror-${i}`} scale={[-1, 1, 1]}>
          <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 12, 0.025, 6, false]} />
          <meshBasicMaterial color="#7c4dff" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      <Sphere args={[1.7, 32, 32]}>
        <meshBasicMaterial color="#9c27b0" transparent opacity={opacity.current * 0.06} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </Sphere>
    </group>
  );
};

// Truth-Seeking Orbs - Six Paths style
const TruthSeekingOrb = ({ mouse, index }: { mouse: { x: number; y: number }; index: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime() * 0.12 + index * (Math.PI * 2 / 9);
      const orbitRadius = 1.5;
      groupRef.current.position.x = Math.cos(time) * orbitRadius + mouse.x * 0.12;
      groupRef.current.position.z = Math.sin(time) * orbitRadius * 0.35;
      groupRef.current.position.y = 0.15 + Math.sin(time * 1) * 0.12 + mouse.y * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[0.14, 32, 32]}>
        <meshBasicMaterial color="#ffd700" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </Sphere>
      <Sphere args={[0.1, 32, 32]}>
        <meshBasicMaterial color="#000000" transparent opacity={0.95} />
      </Sphere>
      <Sphere args={[0.11, 16, 16]}>
        <meshBasicMaterial color="#1a1a1a" wireframe transparent opacity={0.2} />
      </Sphere>
    </group>
  );
};

// Main Scene
const Scene = ({ mouse, isHovering }: { mouse: { x: number; y: number }; isHovering: boolean }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.x = mouse.x * 0.2;
    camera.position.y = mouse.y * 0.12;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={['#080810', 3.5, 12]} />
      <ambientLight intensity={0.18} />
      <pointLight position={[3, 3, 3]} intensity={0.3} color="#ffd700" />
      <pointLight position={[-3, -3, 3]} intensity={0.2} color="#7c4dff" />
      <pointLight position={[0, 4, -3]} intensity={0.15} color="#ff7043" />
      
      {/* Six Paths Sage Mode Aura */}
      <SixPathsAura mouse={mouse} />
      
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
      <AmaterasuFlames position={[1.8, -0.8, 0.3]} isActive={isHovering} />
      <AmaterasuFlames position={[-1.8, 0.8, -0.2]} isActive={isHovering} />
      <AmaterasuFlames position={[0, -1.2, 0.5]} isActive={isHovering} />
      
      {/* Mangekyo Sharingan */}
      <MangekyoItachi position={[2.8, 1, -0.4]} />
      <MangekyoSasuke position={[-2.8, -0.5, 0]} />
      <MangekyoItachi position={[2, -1.3, 0.4]} />
      
      {/* Truth-Seeking Orbs - 9 orbs like Six Paths */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <TruthSeekingOrb key={i} mouse={mouse} index={i} />
      ))}
    </>
  );
};

export const Globe3D = () => {
  const { mouse, isHovering } = useMousePosition();
  
  return (
    <div className="absolute inset-0 opacity-80">
      <Canvas camera={{ position: [0, 0, 4], fov: 55 }} gl={{ antialias: true, alpha: true }}>
        <Scene mouse={mouse} isHovering={isHovering} />
      </Canvas>
    </div>
  );
};
