import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Float } from "@react-three/drei";
import * as THREE from "three";
import { SoundToggle } from "./SoundToggle";
import { useCinematicAudio } from "@/hooks/useCinematicAudio";
import { RunningNaruto } from "./three/NarutoModels";

interface LoadingScreenProps {
  onComplete: () => void;
  onSoundStateChange?: (enabled: boolean) => void;
}

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

  // Audio auto-play removed to prevent crashes

  // Play rising tension near completion - Only if sound manually enabled
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
    // Force reveal timeout - safety measure against black screen
    const forceRevealTimer = setTimeout(() => {
      console.warn("Loading timeout - force revealing UI");
      onComplete();
    }, 12000); // 12 seconds max loading time

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
              clearTimeout(forceRevealTimer);
              onComplete();
            }
          }, 40); // Slower kamui transition
          
          return 100;
        }
        // Slower, smoother progress increments
        return prev + Math.random() * 2 + 0.8;
      });
    }, 180); // Slower interval for cinematic feel

    return () => {
      clearInterval(interval);
      clearTimeout(forceRevealTimer);
    };
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

      {/* 3D Rotating Chakra Globe - RESTORED */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas dpr={[1, 1]} gl={{ antialias: false }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="hsl(var(--primary))" />
          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
              <Sphere args={[2, 32, 32]}>
                <meshPhongMaterial 
                  color="hsl(var(--primary))" 
                  wireframe 
                  transparent 
                  opacity={0.3} 
                />
              </Sphere>
            </Float>
            <Sphere args={[0.5, 16, 16]}>
              <meshBasicMaterial color="hsl(var(--primary))" />
            </Sphere>
          </Suspense>
        </Canvas>
      </div>

      {/* 2D Network overlay - Subtle connectivity */}
      <div className="absolute inset-0 z-1 pointer-events-none opacity-40">
        <NetworkNodes2D />
      </div>

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

      {/* Hidden Leaf Symbol Background - Cinematic Fade */}
      <motion.div
        className="absolute z-0 opacity-5 pointer-events-none"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.08 }}
        transition={{ duration: 4, ease: "easeOut" }}
      >
        <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor" className="text-primary">
          <path d="M50 10 C 20 10, 10 40, 10 50 C 10 70, 40 90, 50 90 C 70 90, 90 70, 90 50 C 90 30, 70 10, 50 10 Z M50 25 C 65 25, 75 35, 75 50 C 75 65, 65 75, 50 75 C 35 75, 25 65, 25 50 C 25 35, 35 25, 50 25 Z" />
        </svg>
      </motion.div>

      {/* 3D Running Naruto Centerpiece */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: phase === 'loading' ? "0%" : "100%", opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <RunningNaruto scale={1.2} />
      </motion.div>

      {/* Chakra Trail Effect (CSS based for performance) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
        <motion.div 
          className="absolute h-[2px] bg-primary/30 blur-sm w-full top-1/2"
          animate={{ x: ['-100%', '100%'], opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Name reveal */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            className="relative z-20 mt-32"
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
              className="text-center font-mono text-[10px] text-muted-foreground mt-2 tracking-[0.5em] uppercase"
            >
              Initializing Shinobi Interface
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
    </motion.div>
  );
};
