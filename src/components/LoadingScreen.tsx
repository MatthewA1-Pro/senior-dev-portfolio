import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Cinematic Pulse Background */}
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle Hidden Leaf Symbol */}
      <motion.div
        className="relative z-10 opacity-20 mb-12"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor" className="text-primary">
          <path d="M50 10 C 20 10, 10 40, 10 50 C 10 70, 40 90, 50 90 C 70 90, 90 70, 90 50 C 90 30, 70 10, 50 10 Z M50 25 C 65 25, 75 35, 75 50 C 75 65, 65 75, 50 75 C 35 75, 25 65, 25 50 C 25 35, 35 25, 50 25 Z" />
        </svg>
      </motion.div>

      {/* Progress Info */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h1 className="font-display text-4xl tracking-[0.4em] text-white/90">MATTHEW</h1>
        
        <div className="w-48 h-[1px] bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.5em]">
          Channeling Chakra {progress}%
        </span>
      </div>

      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
    </motion.div>
  );
};
