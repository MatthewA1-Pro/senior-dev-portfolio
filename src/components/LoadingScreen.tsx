import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

// Japanese-style Jutsu voice announcer - Obito/dramatic anime style
const useJutsuVoice = () => {
  const speak = useCallback((text: string, volume: number = 1) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.65; // Slower, more dramatic
      utterance.pitch = 0.4; // Deep, menacing tone like Obito
      utterance.volume = Math.min(1, volume);
      utterance.lang = 'ja-JP'; // Japanese language for authentic pronunciation
      
      // Try to get a Japanese voice, fallback to deep male voice
      const voices = speechSynthesis.getVoices();
      const japaneseVoice = voices.find(v => v.lang.includes('ja'));
      const deepVoice = voices.find(v => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Takumi'));
      
      if (japaneseVoice) {
        utterance.voice = japaneseVoice;
      } else if (deepVoice) {
        utterance.voice = deepVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  }, []);

  return { speak };
};

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'kamui'>('loading');
  const [hasInteracted, setHasInteracted] = useState(false);
  const { speak } = useJutsuVoice();

  // Enable audio on any interaction
  useEffect(() => {
    const enableAudio = () => {
      setHasInteracted(true);
      // Immediately speak Kamui in Japanese style - like Obito
      speak("カムイ", 1); // "Kamui" in Japanese
    };

    window.addEventListener('click', enableAudio, { once: true });
    window.addEventListener('touchstart', enableAudio, { once: true });
    window.addEventListener('keydown', enableAudio, { once: true });

    return () => {
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('touchstart', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };
  }, [speak]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase('kamui');
          // Speak when Kamui activates - dramatic Japanese style
          if (hasInteracted) {
            speak("神威！時空間移動！", 1); // "Kamui! Jikuukan Idou!" (Space-time migration)
          }
          setTimeout(onComplete, 1500);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete, speak, hasInteracted]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden cursor-pointer"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => setHasInteracted(true)}
    >
      {/* Click prompt */}
      {!hasInteracted && (
        <motion.div
          className="absolute top-20 text-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-mono text-sm text-primary animate-pulse">Click anywhere to enable jutsu voices</p>
        </motion.div>
      )}

      {/* Kamui Swirl Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer spiraling rings */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2"
            style={{
              width: 100 + i * 80,
              height: 100 + i * 80,
              borderColor: i % 2 === 0 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(236, 72, 153, 0.2)',
            }}
            animate={{
              rotate: phase === 'kamui' ? [0, i % 2 === 0 ? 360 : -360] : 0,
              scale: phase === 'kamui' ? [1, 0] : 1,
              opacity: phase === 'kamui' ? [0.5, 0] : 0.3,
            }}
            transition={{
              duration: 1.2,
              delay: i * 0.05,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Central Kamui vortex */}
        <motion.div
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(139, 92, 246, 0.5), transparent, rgba(236, 72, 153, 0.5), transparent)',
          }}
          animate={{
            rotate: [0, 720],
            scale: phase === 'kamui' ? [1, 3, 0] : [0.8, 1, 0.8],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: phase === 'kamui' 
              ? { duration: 1.2, ease: "easeInOut" }
              : { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Inner spiral lines */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-0.5 origin-left"
            style={{
              width: 60,
              left: '50%',
              background: `linear-gradient(90deg, rgba(139, 92, 246, 0.8), transparent)`,
              transform: `rotate(${i * 30}deg)`,
            }}
            animate={{
              rotate: phase === 'kamui' ? [i * 30, i * 30 + 720] : i * 30,
              scaleX: phase === 'kamui' ? [1, 0] : [0.5, 1, 0.5],
              opacity: phase === 'kamui' ? [0.8, 0] : [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: phase === 'kamui' ? 1 : 2,
              repeat: phase === 'kamui' ? 0 : Infinity,
              ease: "easeInOut",
              delay: i * 0.02,
            }}
          />
        ))}
      </div>

      {/* Sharingan Center Eye */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: phase === 'kamui' ? [1, 0] : 1,
          rotate: phase === 'kamui' ? [0, 180] : 0,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {/* Eye outer */}
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-800 to-red-950 flex items-center justify-center shadow-[0_0_60px_rgba(220,38,38,0.5)]">
          {/* Pupil */}
          <motion.div 
            className="absolute w-6 h-6 rounded-full bg-black"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Mangekyo pattern */}
          <motion.div
            className="absolute inset-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute w-full h-full"
                style={{ transform: `rotate(${i * 120}deg)` }}
              >
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-8 bg-black rounded-full" 
                  style={{ transform: 'rotate(15deg)' }} 
                />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Name */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            className="relative z-10 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h1 className="font-display text-4xl md:text-6xl tracking-widest">
              <span className="gradient-text animate-gradient">MATTHEW</span>
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div 
            className="relative z-10 mt-8 w-64"
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex justify-between mb-2 font-mono text-sm text-muted-foreground">
              <span>Kamui Loading</span>
              <span>{Math.min(100, Math.floor(progress))}%</span>
            </div>
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-600 via-purple-500 to-red-600"
                style={{ width: `${Math.min(100, progress)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-10 left-10 font-mono text-xs text-muted-foreground/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'loading' ? 1 : 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-red-500">jutsu</span>.kamui(<span className="text-purple-400">"dimension"</span>);
      </motion.div>

      <motion.div
        className="absolute top-10 right-10 font-mono text-xs text-muted-foreground/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'loading' ? 1 : 0 }}
        transition={{ delay: 0.7 }}
      >
        <span className="text-red-500">await</span> sharingan.activate();
      </motion.div>
    </motion.div>
  );
};
