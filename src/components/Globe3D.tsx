import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Sphere, Float } from "@react-three/drei";
import * as THREE from "three";
import mangekyoItachiImg from "@/assets/mangekyo-itachi.jpeg";
import mangekyoSasukeImg from "@/assets/mangekyo-sasuke.jpeg";

// Mouse position tracker with click detection
const useMousePosition = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    let frameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setMouse({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: -(e.clientY / window.innerHeight) * 2 + 1
        });
      });
    };
    const handleMouseDown = () => setIsHovering(true);
    const handleMouseUp = () => setIsHovering(false);
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
  
  return { mouse, isHovering };
};

// Create circular particle texture (not squares)
const createCircleTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 32; // Reduced from 64
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(16, 16, 16, 0, Math.PI * 2);
  ctx.fill();
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

// Glitter/Snow particles - now circular
const GlitterParticles = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const circleTexture = useMemo(() => createCircleTexture(), []);
  
  const particles = useMemo(() => {
    const positions = [];
    const sizes = [];
    const colors = [];
    const count = 150; // Reduced from 400
    
    for (let i = 0; i < count; i++) {
      // Spread across the whole scene
      positions.push(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
      );
      
      sizes.push(Math.random() * 0.05 + 0.02);
      
      // Golden/white glitter colors
      const colorType = Math.random();
      if (colorType < 0.4) {
        colors.push(1, 0.9, 0.5); // Gold
      } else if (colorType < 0.7) {
        colors.push(1, 0.95, 0.8); // Light gold
      } else {
        colors.push(1, 1, 1); // White sparkle
      }
    }
    
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes)
    };
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const time = clock.getElapsedTime();
      particlesRef.current.rotation.y = time * 0.02 + mouse.x * 0.02;
      particlesRef.current.rotation.x = mouse.y * 0.01;
      
      // Twinkle effect
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(time * 2 + i) * 0.0008;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.positions.length / 3} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particles.colors.length / 3} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.07} 
        transparent 
        opacity={0.8} 
        vertexColors 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
        map={circleTexture}
        alphaTest={0.01}
        depthWrite={false}
      />
    </points>
  );
};

// Six Paths Sage Mode - Golden energy aura (no squares)
const SixPathsAura = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group>
      {/* Six Paths rings only - no particles/squares */}
      <group ref={ringsRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, i * Math.PI / 3]}>
            <torusGeometry args={[1.6 + i * 0.15, 0.015, 16, 64]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.4 - i * 0.1} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Kurama/Nine-Tails Chakra Cloak - with circular particles
const KuramaChakraCloak = ({ mouse, isActive }: { mouse: { x: number; y: number }; isActive: boolean }) => {
  const cloakRef = useRef<THREE.Group>(null);
  const flameParticlesRef = useRef<THREE.Points>(null);
  const circleTexture = useMemo(() => createCircleTexture(), []);
  
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
        <pointsMaterial 
          size={0.15} 
          transparent 
          opacity={opacity} 
          vertexColors 
          sizeAttenuation 
          blending={THREE.AdditiveBlending}
          map={circleTexture}
          alphaTest={0.01}
          depthWrite={false}
        />
      </points>
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

// Sage Mode Particles - circular
const SageModeParticles = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const circleTexture = useMemo(() => createCircleTexture(), []);
  
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
      <pointsMaterial 
        size={0.1} 
        transparent 
        opacity={0.45} 
        vertexColors 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
        map={circleTexture}
        alphaTest={0.01}
        depthWrite={false}
      />
    </points>
  );
};

// Chakra Particles - circular
const ChakraParticles = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const circleTexture = useMemo(() => createCircleTexture(), []);
  
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
      <pointsMaterial 
        size={0.05} 
        transparent 
        opacity={0.35} 
        vertexColors 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
        map={circleTexture}
        alphaTest={0.01}
        depthWrite={false}
      />
    </points>
  );
};

// Rasengan - Realistic with layered spheres and dynamic spirals
const Rasengan = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);
  const spiralsRef = useRef<THREE.Group>(null);
  const outerRingsRef = useRef<THREE.Group>(null);

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
      
      {/* Spiral particle trail - using spheres instead of square particles */}
      {[...Array(20)].map((_, i) => {
        const t = (i / 20) * Math.PI * 4;
        const r = 0.2 + (i / 20) * 0.2;
        return (
          <Sphere key={i} args={[0.015, 8, 8]} position={[Math.cos(t) * r, Math.sin(t) * r, (i / 20 - 0.5) * 0.2]}>
            <meshBasicMaterial color="#81d4fa" transparent opacity={0.7 - i * 0.02} blending={THREE.AdditiveBlending} />
          </Sphere>
        );
      })}
      
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

// Mangekyo Sharingan - Itachi with Kamui effect
const MangekyoItachi = ({ position, onKamui }: { position: [number, number, number]; onKamui?: () => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [isKamui, setIsKamui] = useState(false);
  const kamuiProgress = useRef(0);
  const texture = useLoader(THREE.TextureLoader, mangekyoItachiImg);
  
  const handleClick = () => {
    setIsKamui(true);
    kamuiProgress.current = 0;
    onKamui?.();
    setTimeout(() => setIsKamui(false), 2000);
  };
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Base rotation + Kamui spiral acceleration
      const baseRotation = -clock.getElapsedTime() * 0.08;
      const kamuiRotation = isKamui ? kamuiProgress.current * 20 : 0;
      meshRef.current.rotation.z = baseRotation + kamuiRotation;
      
      // Kamui suction scale effect
      if (isKamui) {
        kamuiProgress.current += 0.02;
        const suctionScale = Math.max(0.1, 1 - kamuiProgress.current * 0.8);
        meshRef.current.scale.setScalar(suctionScale);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.15) * 0.03;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.01} floatIntensity={0.08}>
      <group ref={groupRef} position={position} onClick={handleClick}>
        {/* Mangekyo with image texture */}
        <mesh ref={meshRef}>
          <circleGeometry args={[0.45, 64]} />
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent />
        </mesh>
        
        {/* Kamui spiral rings - visible during suction */}
        {isKamui && [...Array(5)].map((_, i) => (
          <mesh key={i} rotation={[0, 0, kamuiProgress.current * (i + 1) * 3]}>
            <ringGeometry args={[0.1 + i * 0.08, 0.12 + i * 0.08, 32]} />
            <meshBasicMaterial 
              color="#ff0000" 
              transparent 
              opacity={0.3 - i * 0.05} 
              blending={THREE.AdditiveBlending} 
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
        
        {/* Glow - intensifies during Kamui */}
        <Sphere args={[0.55, 16, 16]} position={[0, 0, -0.1]}>
          <meshBasicMaterial 
            color="#ff0000" 
            transparent 
            opacity={isKamui ? 0.4 : 0.08} 
            blending={THREE.AdditiveBlending} 
          />
        </Sphere>
      </group>
    </Float>
  );
};

// Mangekyo Sharingan - Sasuke with Kamui effect
const MangekyoSasuke = ({ position, onKamui }: { position: [number, number, number]; onKamui?: () => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [isKamui, setIsKamui] = useState(false);
  const kamuiProgress = useRef(0);
  const texture = useLoader(THREE.TextureLoader, mangekyoSasukeImg);
  
  const handleClick = () => {
    setIsKamui(true);
    kamuiProgress.current = 0;
    onKamui?.();
    setTimeout(() => setIsKamui(false), 2000);
  };
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const baseRotation = clock.getElapsedTime() * 0.06;
      const kamuiRotation = isKamui ? kamuiProgress.current * 20 : 0;
      meshRef.current.rotation.z = baseRotation + kamuiRotation;
      
      if (isKamui) {
        kamuiProgress.current += 0.02;
        const suctionScale = Math.max(0.1, 1 - kamuiProgress.current * 0.8);
        meshRef.current.scale.setScalar(suctionScale);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.01} floatIntensity={0.08}>
      <group ref={groupRef} position={position} onClick={handleClick}>
        {/* Mangekyo with image texture */}
        <mesh ref={meshRef}>
          <circleGeometry args={[0.45, 64]} />
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent />
        </mesh>
        
        {/* Kamui spiral rings */}
        {isKamui && [...Array(5)].map((_, i) => (
          <mesh key={i} rotation={[0, 0, kamuiProgress.current * (i + 1) * 3]}>
            <ringGeometry args={[0.1 + i * 0.08, 0.12 + i * 0.08, 32]} />
            <meshBasicMaterial 
              color="#7c4dff" 
              transparent 
              opacity={0.3 - i * 0.05} 
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
        
        {/* Glow */}
        <Sphere args={[0.55, 16, 16]} position={[0, 0, -0.1]}>
          <meshBasicMaterial 
            color="#7c4dff" 
            transparent 
            opacity={isKamui ? 0.4 : 0.08} 
            blending={THREE.AdditiveBlending} 
          />
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
          <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 20, 0.02, 12, false]} />
          <meshBasicMaterial color="#9c4dff" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      {ribs.map((points, i) => (
        <mesh key={`mirror-${i}`} scale={[-1, 1, 1]}>
          <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 20, 0.02, 12, false]} />
          <meshBasicMaterial color="#9c4dff" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
};

// Truth Seeking Orbs - proper 3D spheres (not square particles)
const TruthSeekingOrbs = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Orbit around scene
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15 + mouse.x * 0.1;
      groupRef.current.rotation.x = mouse.y * 0.05;
    }
  });

  // 9 orbs arranged in a circle behind the scene
  const orbCount = 9;
  
  return (
    <group ref={groupRef}>
      {[...Array(orbCount)].map((_, i) => {
        const angle = (i / orbCount) * Math.PI * 2;
        const radius = 2.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius * 0.6;
        const y = Math.sin(angle * 2) * 0.3; // Slight vertical wave
        
        return (
          <Float key={i} speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
            <group position={[x, y, z]}>
              {/* Core - pure black */}
              <Sphere args={[0.12, 24, 24]}>
                <meshBasicMaterial color="#050505" />
              </Sphere>
              
              {/* Dark purple rim */}
              <Sphere args={[0.13, 24, 24]}>
                <meshBasicMaterial 
                  color="#1a0030" 
                  transparent 
                  opacity={0.8}
                  side={THREE.BackSide}
                />
              </Sphere>
              
              {/* Outer glow */}
              <Sphere args={[0.18, 16, 16]}>
                <meshBasicMaterial 
                  color="#4a0080" 
                  transparent 
                  opacity={0.25} 
                  blending={THREE.AdditiveBlending}
                  side={THREE.BackSide}
                />
              </Sphere>
              
              {/* Golden Six Paths highlight */}
              <Sphere args={[0.14, 16, 16]}>
                <meshBasicMaterial 
                  color="#ffd700" 
                  transparent 
                  opacity={0.15} 
                  blending={THREE.AdditiveBlending}
                />
              </Sphere>
            </group>
          </Float>
        );
      })}
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
      {/* Lightning bolts as thin cylinders with more segments */}
      {[...Array(10)].map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const length = 0.6 + Math.random() * 0.3;
        return (
          <group key={i} rotation={[Math.random() * 0.5, angle, Math.random() * 0.3]}>
            <mesh position={[0, length / 2, 0]}>
              <cylinderGeometry args={[0.006, 0.012, length, 8]} />
              <meshBasicMaterial color="#b388ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
            </mesh>
            {/* Branch */}
            <mesh position={[0.08, length * 0.6, 0]} rotation={[0, 0, 0.5]}>
              <cylinderGeometry args={[0.004, 0.008, length * 0.35, 8]} />
              <meshBasicMaterial color="#7c4dff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
            </mesh>
          </group>
        );
      })}
      {/* Core glow */}
      <Sphere args={[0.2, 16, 16]}>
        <meshBasicMaterial color="#7c4dff" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </Sphere>
      {/* Inner bright core */}
      <Sphere args={[0.1, 16, 16]}>
        <meshBasicMaterial color="#e1bee7" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
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
      
      {/* Glitter particles - replacing floating squares */}
      <GlitterParticles mouse={mouse} />
      
      {/* Six Paths Sage Mode Aura */}
      <SixPathsAura mouse={mouse} />
      
      {/* Truth Seeking Orbs - orbiting spheres */}
      <TruthSeekingOrbs mouse={mouse} />
      
      {/* Kurama Chakra Cloak */}
      <KuramaChakraCloak mouse={mouse} isActive={isHovering} />
      
      {/* Sage Mode particles */}
      <SageModeParticles mouse={mouse} />
      
      {/* Chakra particles */}
      <ChakraParticles mouse={mouse} />
      
      {/* Rasengan - centered */}
      <group position={[0, 0, 1.2]}>
        <Rasengan mouse={mouse} />
      </group>
      
      {/* Chidori Lightning - centered near Rasengan */}
      <group position={[0, 0, -1.2]}>
        <ChidoriLightning mouse={mouse} />
      </group>
      
      {/* Susanoo Ribcage */}
      <SusanooRibcage isActive={isHovering} mouse={mouse} />
      
      {/* Amaterasu flames - appear on click */}
      <AmaterasuFlames position={[1.5, -1, 0.3]} isActive={isHovering} />
      <AmaterasuFlames position={[-1.5, 1, -0.2]} isActive={isHovering} />
      
      {/* Mangekyo Sharingan */}
      <MangekyoItachi position={[2.5, 0.8, -0.4]} />
      <MangekyoSasuke position={[-2.5, -0.8, 0]} />
    </>
  );
};

export const Globe3D = () => {
  const { mouse, isHovering } = useMousePosition();
  
  return (
    <div className="absolute inset-0 opacity-90 pointer-events-none">
      {/* Video Background - Cinematic Sharingan */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
        style={{ 
          zIndex: -1,
          filter: 'contrast(1.1) saturate(1.2) brightness(0.8)',
        }}
      >
        <source src="/videos/sharingan-video.mp4" type="video/mp4" />
      </video>
      
      {/* Cinematic vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 55 }} 
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          precision: "lowp"
        }}
        dpr={[1, 1.5]}
      >
        <Scene mouse={mouse} isHovering={isHovering} />
      </Canvas>
    </div>
  );
};
