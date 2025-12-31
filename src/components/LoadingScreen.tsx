import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

// Floating network nodes with connecting lines
const NetworkNodes = () => {
  const nodes = useMemo(() => {
    const nodeData = [];
    for (let i = 0; i < 40; i++) {
      nodeData.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 4,
      });
    }
    return nodeData;
  }, []);

  const lines = useMemo(() => {
    const lineData = [];
    for (let i = 0; i < 25; i++) {
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
    <div className="absolute inset-0 overflow-hidden">
      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full">
        {lines.map((line, i) => (
          <motion.line
            key={i}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="hsl(var(--primary) / 0.15)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.3, 0.1] }}
            transition={{
              duration: 2,
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
          className="absolute rounded-full bg-primary/40"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: node.size,
            height: node.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0.3],
            scale: [0, 1, 0.8],
            y: [0, -20, 0],
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

// Central wireframe orb with glow
const WireframeOrb = ({ phase }: { phase: 'loading' | 'transition' }) => {
  return (
    <div className="relative">
      {/* Outer glow rings */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/20"
          style={{
            width: 120 + i * 40,
            height: 120 + i * 40,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            rotate: phase === 'transition' ? 360 : 0,
            scale: phase === 'transition' ? [1, 0] : 1,
            opacity: phase === 'transition' ? [0.3, 0] : [0.1, 0.3, 0.1],
          }}
          transition={{
            rotate: { duration: 1.5, ease: "easeInOut" },
            scale: { duration: 1.5, ease: "easeInOut" },
            opacity: phase === 'transition' 
              ? { duration: 1.5 }
              : { duration: 2 + i * 0.5, repeat: Infinity },
          }}
        />
      ))}

      {/* Central glowing orb */}
      <motion.div
        className="relative w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.8) 0%, hsl(var(--primary) / 0.2) 50%, transparent 70%)',
          boxShadow: '0 0 60px hsl(var(--primary) / 0.5), 0 0 120px hsl(var(--primary) / 0.3)',
        }}
        animate={{
          scale: phase === 'transition' ? [1, 1.5, 0] : [1, 1.1, 1],
          opacity: phase === 'transition' ? [1, 0.8, 0] : 1,
        }}
        transition={{
          scale: phase === 'transition' 
            ? { duration: 1.5, ease: "easeInOut" }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* Inner bright core */}
        <motion.div
          className="w-8 h-8 rounded-full bg-foreground/90"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Wireframe dome structure */}
      <svg 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48"
        viewBox="0 0 200 200"
      >
        {/* Horizontal circles */}
        {[0.3, 0.5, 0.7, 0.9].map((scale, i) => (
          <motion.ellipse
            key={`h-${i}`}
            cx="100"
            cy="100"
            rx={80 * scale}
            ry={30 * scale}
            fill="none"
            stroke="hsl(var(--primary) / 0.3)"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: phase === 'transition' ? 0 : [0.2, 0.5, 0.2],
              rotate: phase === 'transition' ? 180 : 0,
            }}
            transition={{
              opacity: { duration: 2, delay: i * 0.2, repeat: Infinity },
              rotate: { duration: 1.5 },
            }}
            style={{ transformOrigin: '100px 100px' }}
          />
        ))}

        {/* Vertical arcs */}
        {[...Array(8)].map((_, i) => (
          <motion.path
            key={`v-${i}`}
            d={`M 100 20 Q ${100 + Math.cos(i * Math.PI / 4) * 80} 100 100 180`}
            fill="none"
            stroke="hsl(var(--primary) / 0.25)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: phase === 'transition' ? 0 : 1, 
              opacity: phase === 'transition' ? 0 : 0.4,
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.1,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'transition'>('loading');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase('transition');
          setTimeout(onComplete, 1500);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Network background */}
      <NetworkNodes />

      {/* Radial gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, hsl(var(--background)) 70%)',
        }}
      />

      {/* Central orb */}
      <WireframeOrb phase={phase} />

      {/* Name reveal */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            className="relative z-10 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.h1 
              className="font-display text-4xl md:text-6xl tracking-[0.3em] text-foreground/90"
              style={{
                textShadow: '0 0 40px hsl(var(--primary) / 0.5)',
              }}
            >
              MATTHEW
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            className="relative z-10 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-48 h-[2px] bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-secondary to-primary"
                  style={{ width: `${Math.min(100, progress)}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span className="font-mono text-xs text-muted-foreground w-10">
                {Math.min(100, Math.floor(progress))}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative code snippets */}
      <motion.div
        className="absolute bottom-8 left-8 font-mono text-[10px] text-muted-foreground/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'loading' ? 1 : 0 }}
        transition={{ delay: 1 }}
      >
        <span className="text-primary/60">init</span>.portfolio();
      </motion.div>

      <motion.div
        className="absolute top-8 right-8 font-mono text-[10px] text-muted-foreground/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'loading' ? 1 : 0 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-secondary/60">await</span> ready();
      </motion.div>
    </motion.div>
  );
};
