import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative">
        {/* Glowing orb */}
        <motion.div
          className="absolute -inset-20 rounded-full bg-primary/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Name */}
        <motion.h1
          className="relative font-mono text-6xl md:text-8xl font-bold tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="gradient-text animate-gradient">MATTHEW</span>
        </motion.h1>
      </div>

      {/* Progress bar */}
      <div className="mt-12 w-64">
        <div className="flex justify-between mb-2 font-mono text-sm text-muted-foreground">
          <span>Loading</span>
          <span>{Math.min(100, Math.floor(progress))}%</span>
        </div>
        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-secondary to-primary"
            style={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Decorative code snippets */}
      <motion.div
        className="absolute bottom-10 left-10 font-mono text-xs text-muted-foreground/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-primary">const</span> developer = <span className="text-secondary">"Matthew"</span>;
      </motion.div>

      <motion.div
        className="absolute top-10 right-10 font-mono text-xs text-muted-foreground/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <span className="text-primary">await</span> loadPortfolio();
      </motion.div>
    </motion.div>
  );
};
