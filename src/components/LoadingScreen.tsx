import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Float } from "@react-three/drei";
import * as THREE from "three";
import { SoundToggle } from "./SoundToggle";
import { useCinematicAudio } from "@/hooks/useCinematicAudio";

interface LoadingScreenProps {
  onComplete: () => void;
  onSoundStateChange?: (enabled: boolean) => void;
}

// 3D Floating wireframe nodes - igloo.inc inspired
const WireframeNodes = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const nodes = useMemo(() => {
    const data = [];
    for (let i = 0; i < 60; i++) {
      data.push({
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4
        ] as [number, number, number],
        scale: Math.random() * 0.08 + 0.02,
        speed: Math.random() * 0.5 + 0.2,
      });
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <Float key={i} speed={node.speed} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={node.position}>
            <icosahedronGeometry args={[node.scale, 0]} />
            <meshBasicMaterial color="#e85a5a" wireframe transparent opacity={0.6} />
          </mesh>
          {/* Glow around each node */}
          <Sphere args={[node.scale * 2, 8, 8]} position={node.position}>
            <meshBasicMaterial color="#e85a5a" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
          </Sphere>
        </Float>
      ))}
    </group>
  );
};

// Connecting energy lines between nodes
const EnergyLines = () => {
  const linesRef = useRef<THREE.Group>(null);
  
  const lines = useMemo(() => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3),
        new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2),
        new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3)
      );
      data.push(curve);
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <group ref={linesRef}>
      {lines.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 20, 0.003, 4, false]} />
          <meshBasicMaterial 
            color="#ffd700" 
            transparent 
            opacity={0.3 + Math.sin(i) * 0.2} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
      ))}
    </group>
  );
};

// Central rotating orb with Kamui-ready design
const CentralOrb = ({ phase, progress }: { phase: 'loading' | 'kamui'; progress: number }) => {
  const orbRef = useRef<THREE.Group>(null);
  const spiralRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (orbRef.current) {
      const baseSpeed = phase === 'kamui' ? 5 : 0.3;
      orbRef.current.rotation.y += baseSpeed * 0.016;
      orbRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
    
    if (spiralRef.current && phase === 'kamui') {
      spiralRef.current.rotation.z += 0.15;
      spiralRef.current.scale.setScalar(Math.max(0.01, 1 - progress * 0.02));
    }
  });

  const kamuiScale = phase === 'kamui' ? Math.max(0.1, 1 - progress * 0.015) : 1;

  return (
    <group ref={orbRef} scale={kamuiScale}>
      {/* Outer wireframe sphere */}
      <mesh>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshBasicMaterial color="#e85a5a" wireframe transparent opacity={0.3} />
      </mesh>
      
      {/* Middle ring structures */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[i * 0.5, i * 0.3, i * 0.2]}>
          <torusGeometry args={[0.9 + i * 0.1, 0.01, 8, 64]} />
          <meshBasicMaterial 
            color={i === 1 ? "#ffd700" : "#e85a5a"} 
            transparent 
            opacity={0.5 - i * 0.1} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
      ))}
      
      {/* Inner glowing core */}
      <Sphere args={[0.4, 32, 32]}>
        <meshBasicMaterial color="#ff4444" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </Sphere>
      
      {/* Hot center */}
      <Sphere args={[0.2, 16, 16]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </Sphere>
      
      {/* Outer glow */}
      <Sphere args={[1.5, 16, 16]}>
        <meshBasicMaterial color="#ff2222" transparent opacity={0.08} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </Sphere>

      {/* Kamui spiral rings - appear during transition */}
      {phase === 'kamui' && (
        <group ref={spiralRef}>
          {[...Array(8)].map((_, i) => (
            <mesh key={i} rotation={[0, 0, progress * i * 0.5]}>
              <ringGeometry args={[0.15 + i * 0.15, 0.18 + i * 0.15, 32]} />
              <meshBasicMaterial 
                color={i % 2 === 0 ? "#ff0000" : "#000000"} 
                transparent 
                opacity={0.6 - i * 0.05} 
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// Orbiting particles around center
const OrbitingParticles = ({ phase }: { phase: 'loading' | 'kamui' }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const speed = phase === 'kamui' ? 3 : 0.5;
      groupRef.current.rotation.y = clock.getElapsedTime() * speed;
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 2;
        return (
          <Float key={i} speed={2} floatIntensity={0.3}>
            <Sphere 
              args={[0.05, 8, 8]} 
              position={[Math.cos(angle) * radius, Math.sin(angle) * 0.3, Math.sin(angle) * radius]}
            >
              <meshBasicMaterial color="#ffd700" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
            </Sphere>
          </Float>
        );
      })}
    </group>
  );
};

// 3D Scene
const LoadingScene = ({ phase, progress }: { phase: 'loading' | 'kamui'; progress: number }) => {
  const { camera } = useThree();
  
  useFrame(({ clock }) => {
    camera.position.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.5;
    camera.position.y = Math.cos(clock.getElapsedTime() * 0.15) * 0.3;
    
    // Pull camera back during Kamui
    if (phase === 'kamui') {
      camera.position.z = 5 + progress * 0.1;
    }
    
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={['#0a0a12', 3, 10]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]} intensity={0.5} color="#ff4444" />
      <pointLight position={[-3, -3, 3]} intensity={0.3} color="#ffd700" />
      
      <WireframeNodes />
      <EnergyLines />
      <CentralOrb phase={phase} progress={progress} />
      <OrbitingParticles phase={phase} />
    </>
  );
};

// 2D Network nodes overlay
const NetworkNodes2D = () => {
  const nodes = useMemo(() => {
    const nodeData = [];
    for (let i = 0; i < 30; i++) {
      nodeData.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 2,
        duration: 4 + Math.random() * 4,
      });
    }
    return nodeData;
  }, []);

  const lines = useMemo(() => {
    const lineData = [];
    for (let i = 0; i < 20; i++) {
      lineData.push({
        x1: Math.random() * 100,
        y1: Math.random() * 100,
        x2: Math.random() * 100,
        y2: Math.random() * 100,
        delay: Math.random() * 1.5,
      });
    }
    return lineData;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full">
        {lines.map((line, i) => (
          <motion.line
            key={i}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="hsl(var(--primary) / 0.12)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.3, 0.1] }}
            transition={{
              duration: 2.5,
              delay: line.delay,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>

      {/* Floating nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/50"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: node.size,
            height: node.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.7, 0.2],
            scale: [0, 1, 0.7],
            y: [0, -15, 0],
          }}
          transition={{
            duration: node.duration,
            delay: node.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export const LoadingScreen = ({ onComplete, onSoundStateChange }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'kamui'>('loading');
  const kamuiProgressRef = useRef(0);
  
  const {
    isSoundEnabled,
    toggleSound,
    playAmbientDrone,
    playRisingTension,
    playKamuiVortex,
    playHeartbeat,
  } = useCinematicAudio();

  // Notify parent of sound state changes
  useEffect(() => {
    onSoundStateChange?.(isSoundEnabled);
  }, [isSoundEnabled, onSoundStateChange]);

  // Play ambient drone when sound is first enabled
  useEffect(() => {
    if (isSoundEnabled && phase === 'loading') {
      playAmbientDrone();
    }
  }, [isSoundEnabled, phase, playAmbientDrone]);

  // Play heartbeat periodically during loading
  useEffect(() => {
    if (!isSoundEnabled || phase !== 'loading') return;
    
    const interval = setInterval(() => {
      if (progress > 30 && progress < 90) {
        playHeartbeat();
      }
    }, 1200);
    
    return () => clearInterval(interval);
  }, [isSoundEnabled, phase, progress, playHeartbeat]);

  // Play rising tension near completion
  useEffect(() => {
    if (isSoundEnabled && progress > 80 && progress < 85) {
      playRisingTension();
    }
  }, [isSoundEnabled, progress, playRisingTension]);

  // Play kamui vortex sound
  useEffect(() => {
    if (isSoundEnabled && phase === 'kamui') {
      playKamuiVortex();
    }
  }, [isSoundEnabled, phase, playKamuiVortex]);

  useEffect(() => {
    // Slower, more cinematic loading - like a movie scene
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase('kamui');
          
          // Slower Kamui transition for dramatic effect
          const kamuiInterval = setInterval(() => {
            kamuiProgressRef.current += 1;
            if (kamuiProgressRef.current >= 80) {
              clearInterval(kamuiInterval);
              onComplete();
            }
          }, 40); // Slower kamui transition
          
          return 100;
        }
        // Slower, smoother progress increments
        return prev + Math.random() * 2 + 0.8;
      });
    }, 180); // Slower interval for cinematic feel

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Sound Toggle */}
      <SoundToggle
        isSoundEnabled={isSoundEnabled}
        onToggle={toggleSound}
        className="top-6 right-6"
      />

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
          <LoadingScene phase={phase} progress={kamuiProgressRef.current} />
        </Canvas>
      </div>

      {/* 2D Network overlay */}
      <NetworkNodes2D />

      {/* Radial gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, hsl(var(--background)) 70%)',
        }}
      />

      {/* Kamui vortex overlay */}
      <AnimatePresence>
        {phase === 'kamui' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-96 h-96 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, hsl(var(--primary)) 25%, transparent 50%, hsl(var(--primary) / 0.5) 75%, transparent 100%)',
              }}
              animate={{ 
                rotate: 1080,
                scale: [1, 2, 0],
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name reveal */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            className="relative z-10 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.h1 
              className="font-display text-4xl sm:text-5xl md:text-6xl tracking-[0.25em] text-foreground/90"
              style={{
                textShadow: '0 0 40px hsl(var(--primary) / 0.6)',
              }}
            >
              MATTHEW
            </motion.h1>
            <motion.p
              className="text-center font-mono text-xs text-muted-foreground mt-2 tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              FULL-STACK DEVELOPER
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            className="relative z-10 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-48 sm:w-64 h-[2px] bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-secondary to-primary"
                  style={{ width: `${Math.min(100, progress)}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span className="font-mono text-xs text-primary w-12">
                {Math.min(100, Math.floor(progress))}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative code snippets */}
      <motion.div
        className="absolute bottom-6 left-6 font-mono text-[10px] text-muted-foreground/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'loading' ? 1 : 0 }}
        transition={{ delay: 1 }}
      >
        <span className="text-primary/50">init</span>.portfolio();
      </motion.div>

      <motion.div
        className="absolute top-6 right-6 font-mono text-[10px] text-muted-foreground/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'loading' ? 1 : 0 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-secondary/50">await</span> ready();
      </motion.div>
      
      {/* Corner accents */}
      <motion.div
        className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-primary/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: phase === 'loading' ? 1 : 0, scale: 1 }}
        transition={{ delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-primary/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: phase === 'loading' ? 1 : 0, scale: 1 }}
        transition={{ delay: 0.5 }}
      />
    </motion.div>
  );
};
