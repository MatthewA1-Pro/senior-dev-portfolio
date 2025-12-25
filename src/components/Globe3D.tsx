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
      auraRef.current.rotation.y = clock.getElapsedTime() * 0.05 + mouse.x * 0.05;
      // Pulsing scale - slower
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 0.8) * 0.03;
      auraRef.current.scale.set(pulse, pulse, pulse);
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.y = clock.getElapsedTime() * 0.08;
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
      cloakRef.current.rotation.y = clock.getElapsedTime() * 0.04 + mouse.x * 0.04;
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
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.006 + mouse.x * 0.03;
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
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.008 + mouse.x * 0.04;
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

// Rasengan - Realistic with layered spheres and dynamic spirals
const Rasengan = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);
  const spiralsRef = useRef<THREE.Group>(null);
  const outerRingsRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate spiral particles
  const spiralParticles = useMemo(() => {
    const positions = [];
    const count = 100;
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 6;
      const r = 0.15 + (i / count) * 0.25;
      positions.push(
        Math.cos(t) * r,
        Math.sin(t) * r,
        (i / count - 0.5) * 0.3
      );
    }
    return new Float32Array(positions);
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.x = mouse.x * 0.15;
      groupRef.current.position.y = mouse.y * 0.15;
    }
    if (spiralsRef.current) {
      spiralsRef.current.rotation.z = time * 0.8;
      spiralsRef.current.rotation.x = time * 0.4;
    }
    if (outerRingsRef.current) {
      outerRingsRef.current.rotation.y = time * 0.6;
      outerRingsRef.current.rotation.x = time * 0.3;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.z = time * 1.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Innermost white-hot core */}
      <Sphere args={[0.08, 32, 32]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
      
      {/* Bright core glow */}
      <Sphere args={[0.12, 32, 32]}>
        <meshBasicMaterial color="#e0f7ff" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </Sphere>
      
      {/* Primary blue layer */}
      <Sphere args={[0.2, 32, 32]}>
        <meshBasicMaterial color="#4fc3f7" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </Sphere>
      
      {/* Secondary rotating layer */}
      <Sphere args={[0.3, 32, 32]}>
        <meshBasicMaterial color="#29b6f6" transparent opacity={0.35} blending={THREE.AdditiveBlending} />
      </Sphere>
      
      {/* Outer containment shell */}
      <Sphere args={[0.42, 32, 32]}>
        <meshBasicMaterial color="#03a9f4" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </Sphere>
      
      {/* Outermost glow */}
      <Sphere args={[0.55, 32, 32]}>
        <meshBasicMaterial color="#0288d1" transparent opacity={0.08} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </Sphere>
      
      {/* Spinning chakra rings */}
      <group ref={spiralsRef}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation={[i * 0.3, i * 0.5, i * 0.2]}>
            <torusGeometry args={[0.22 + i * 0.04, 0.008, 16, 48]} />
            <meshBasicMaterial color="#81d4fa" transparent opacity={0.6 - i * 0.1} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
      
      {/* Outer containment rings */}
      <group ref={outerRingsRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2 + i * 0.2, i * 0.4, 0]}>
            <torusGeometry args={[0.38 + i * 0.03, 0.005, 8, 64]} />
            <meshBasicMaterial color="#4fc3f7" transparent opacity={0.4 - i * 0.1} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
      
      {/* Spiral particle trail */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={spiralParticles.length / 3} array={spiralParticles} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="#81d4fa" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
      </points>
      
      {/* Orbiting energy particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <Sphere key={i} args={[0.02, 8, 8]} position={[Math.cos(angle) * 0.45, Math.sin(angle) * 0.45, 0]}>
            <meshBasicMaterial color="#e0f7ff" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
          </Sphere>
        );
      })}
    </group>
  );
};

// Mangekyo Sharingan - Itachi (More realistic with detailed pattern)
const MangekyoItachi = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const patternRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (patternRef.current) {
      patternRef.current.rotation.z = -clock.getElapsedTime() * 0.08;
    }
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.15) * 0.03;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.01} floatIntensity={0.08}>
      <group ref={groupRef} position={position}>
        {/* Outer white sclera with subtle shadow */}
        <mesh position={[0, 0, -0.03]}>
          <circleGeometry args={[0.42, 64]} />
          <meshBasicMaterial color="#e8e0d8" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Sclera highlight */}
        <mesh position={[0, 0, -0.025]}>
          <circleGeometry args={[0.4, 64]} />
          <meshBasicMaterial color="#f5f0eb" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Deep red iris base */}
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[0.36, 64]} />
          <meshBasicMaterial color="#8b0000" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Iris gradient layer */}
        <mesh>
          <circleGeometry args={[0.33, 64]} />
          <meshBasicMaterial color="#cc0000" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Inner iris ring */}
        <mesh position={[0, 0, 0.002]}>
          <ringGeometry args={[0.12, 0.28, 64]} />
          <meshBasicMaterial color="#990000" side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
        
        {/* Itachi's curved blade pattern */}
        <group ref={patternRef} position={[0, 0, 0.006]}>
          {[0, 1, 2].map((i) => (
            <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
              {/* Main curved blade */}
              <mesh position={[0.14, 0.03, 0]} rotation={[0, 0, 0.4]}>
                <planeGeometry args={[0.14, 0.045]} />
                <meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
              </mesh>
              {/* Blade tip */}
              <mesh position={[0.22, 0.055, 0]}>
                <circleGeometry args={[0.028, 16]} />
                <meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
              </mesh>
              {/* Inner connecting arc */}
              <mesh position={[0.08, 0, 0]} rotation={[0, 0, 0.2]}>
                <planeGeometry args={[0.07, 0.025]} />
                <meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}
        </group>
        
        {/* Central pupil */}
        <mesh position={[0, 0, 0.012]}>
          <circleGeometry args={[0.055, 32]} />
          <meshBasicMaterial color="#050505" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Pupil highlight */}
        <mesh position={[-0.015, 0.015, 0.014]}>
          <circleGeometry args={[0.012, 16]} />
          <meshBasicMaterial color="#333333" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Subtle red glow */}
        <Sphere args={[0.48, 16, 16]} position={[0, 0, -0.15]}>
          <meshBasicMaterial color="#ff0000" transparent opacity={0.06} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>
    </Float>
  );
};

// Mangekyo Sharingan - Sasuke (Eternal Mangekyo with star pattern)
const MangekyoSasuke = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const patternRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (patternRef.current) {
      patternRef.current.rotation.z = clock.getElapsedTime() * 0.06;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.01} floatIntensity={0.08}>
      <group ref={groupRef} position={position}>
        {/* Outer white sclera */}
        <mesh position={[0, 0, -0.03]}>
          <circleGeometry args={[0.42, 64]} />
          <meshBasicMaterial color="#e8e0d8" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Sclera highlight */}
        <mesh position={[0, 0, -0.025]}>
          <circleGeometry args={[0.4, 64]} />
          <meshBasicMaterial color="#f5f0eb" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Deep red iris */}
        <mesh position={[0, 0, -0.01]}>
          <circleGeometry args={[0.36, 64]} />
          <meshBasicMaterial color="#7a0000" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Iris main layer */}
        <mesh>
          <circleGeometry args={[0.33, 64]} />
          <meshBasicMaterial color="#b71c1c" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Sasuke's 6-pointed star pattern */}
        <group ref={patternRef} position={[0, 0, 0.006]}>
          {/* Main 6 spokes */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
              <planeGeometry args={[0.26, 0.035]} />
              <meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
            </mesh>
          ))}
          {/* Inner hexagon ring */}
          <mesh position={[0, 0, 0.002]}>
            <ringGeometry args={[0.08, 0.12, 6]} />
            <meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} />
          </mesh>
          {/* Outer ring accent */}
          <mesh position={[0, 0, 0.001]}>
            <ringGeometry args={[0.2, 0.22, 64]} />
            <meshBasicMaterial color="#0a0a0a" side={THREE.DoubleSide} transparent opacity={0.5} />
          </mesh>
        </group>
        
        {/* Central pupil */}
        <mesh position={[0, 0, 0.012]}>
          <circleGeometry args={[0.045, 32]} />
          <meshBasicMaterial color="#050505" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Pupil highlight */}
        <mesh position={[-0.012, 0.012, 0.014]}>
          <circleGeometry args={[0.01, 16]} />
          <meshBasicMaterial color="#333333" side={THREE.DoubleSide} />
        </mesh>
        
        {/* Purple glow effect */}
        <Sphere args={[0.48, 16, 16]} position={[0, 0, -0.15]}>
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

// Truth-Seeking Orbs - Six Paths style (no wireframe)
const TruthSeekingOrb = ({ mouse, index }: { mouse: { x: number; y: number }; index: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime() * 0.06 + index * (Math.PI * 2 / 9);
      const orbitRadius = 1.5;
      groupRef.current.position.x = Math.cos(time) * orbitRadius + mouse.x * 0.08;
      groupRef.current.position.z = Math.sin(time) * orbitRadius * 0.35;
      groupRef.current.position.y = 0.15 + Math.sin(time * 0.5) * 0.08 + mouse.y * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer golden glow */}
      <Sphere args={[0.16, 32, 32]}>
        <meshBasicMaterial color="#ffd700" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
      </Sphere>
      {/* Purple outline */}
      <Sphere args={[0.13, 32, 32]}>
        <meshBasicMaterial color="#7c4dff" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
      </Sphere>
      {/* Black core */}
      <Sphere args={[0.1, 32, 32]}>
        <meshBasicMaterial color="#050505" />
      </Sphere>
    </group>
  );
};

// Chidori Lightning Effect
const ChidoriLightning = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15 + mouse.x * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lightning bolts as thin cylinders */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const length = 0.8 + Math.random() * 0.4;
        return (
          <group key={i} rotation={[Math.random() * 0.5, angle, Math.random() * 0.3]}>
            <mesh position={[0, length / 2, 0]}>
              <cylinderGeometry args={[0.008, 0.015, length, 4]} />
              <meshBasicMaterial color="#b388ff" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
            </mesh>
            {/* Branch */}
            <mesh position={[0.1, length * 0.6, 0]} rotation={[0, 0, 0.5]}>
              <cylinderGeometry args={[0.005, 0.01, length * 0.4, 4]} />
              <meshBasicMaterial color="#7c4dff" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
            </mesh>
          </group>
        );
      })}
      {/* Core glow */}
      <Sphere args={[0.25, 16, 16]}>
        <meshBasicMaterial color="#7c4dff" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
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
      
      {/* Chidori Lightning */}
      <group position={[1.2, 0.3, 0.5]}>
        <ChidoriLightning mouse={mouse} />
      </group>
      
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
