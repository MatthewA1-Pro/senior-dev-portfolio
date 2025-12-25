import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  swayAmount: number;
}

// Create whoosh sound using Web Audio API
const createWhooshSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const duration = 1.5;
    const sampleRate = audioContext.sampleRate;
    const bufferSize = duration * sampleRate;
    const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate white noise with envelope for whoosh effect
    for (let i = 0; i < bufferSize; i++) {
      const t = i / sampleRate;
      // Envelope: quick attack, slow decay
      const envelope = Math.pow(Math.sin(Math.PI * t / duration), 0.3) * Math.exp(-t * 1.5);
      // Filtered noise
      data[i] = (Math.random() * 2 - 1) * envelope * 0.15;
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    
    // Low-pass filter for softer sound
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    
    // Gain control
    const gain = audioContext.createGain();
    gain.gain.value = 0.3;
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    
    source.start();
    
    // Clean up after playing
    source.onended = () => {
      audioContext.close();
    };
  } catch (e) {
    // Audio not supported or blocked
  }
};

export const SakuraPetals = () => {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [windActive, setWindActive] = useState(false);
  const [windDirection, setWindDirection] = useState(1);
  const [windKey, setWindKey] = useState(0); // For wind petals
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    // Generate fewer petals for better performance
    const generatePetals = () => {
      const newPetals: Petal[] = [];
      for (let i = 0; i < 18; i++) {
        newPetals.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 12,
          duration: 14 + Math.random() * 6,
          size: 10 + Math.random() * 10,
          rotation: Math.random() * 360,
          swayAmount: 25 + Math.random() * 40,
        });
      }
      setPetals(newPetals);
    };

    generatePetals();
  }, []);

  // Wind gust effect
  useEffect(() => {
    const triggerWind = () => {
      setWindDirection(Math.random() > 0.5 ? 1 : -1);
      setWindActive(true);
      setWindKey(prev => prev + 1);
      
      // Play whoosh sound
      if (!hasPlayedSound.current) {
        hasPlayedSound.current = true;
        createWhooshSound();
        // Allow next sound after 2 seconds
        setTimeout(() => {
          hasPlayedSound.current = false;
        }, 2000);
      }
      
      // Wind lasts 2-3 seconds
      const windDuration = 2000 + Math.random() * 1000;
      setTimeout(() => setWindActive(false), windDuration);
    };

    // Initial wind after 4 seconds
    const initialTimer = setTimeout(triggerWind, 4000);
    
    // Wind gusts every 10-18 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        triggerWind();
      }
    }, 10000 + Math.random() * 8000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]">
      {/* Wind visual indicator - using opacity instead of gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-pink-200/5"
        animate={{ opacity: windActive ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Main petals */}
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute will-change-transform"
          style={{ left: `${petal.x}%`, top: -30 }}
          animate={{
            y: ["0vh", "110vh"],
            x: windActive 
              ? [0, petal.swayAmount * 2 * windDirection, petal.swayAmount * 2.5 * windDirection, 0]
              : [0, petal.swayAmount, -petal.swayAmount, 0],
            rotate: windActive 
              ? [petal.rotation, petal.rotation + 540]
              : [petal.rotation, petal.rotation + 360],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: windActive ? petal.duration * 0.7 : petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.05, 0.95, 1],
          }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`pg-${petal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(340, 80%, 85%)" />
                <stop offset="100%" stopColor="hsl(350, 60%, 70%)" />
              </linearGradient>
            </defs>
            <path
              d="M12 2C12 2 8 6 8 10C8 12 9.5 14 12 14C14.5 14 16 12 16 10C16 6 12 2 12 2Z"
              fill={`url(#pg-${petal.id})`}
              opacity={0.85}
            />
          </svg>
        </motion.div>
      ))}
      
      {/* Smaller background petals - fewer for performance */}
      {petals.slice(0, 10).map((petal) => (
        <motion.div
          key={`sm-${petal.id}`}
          className="absolute will-change-transform opacity-50"
          style={{ left: `${(petal.x + 40) % 100}%`, top: -20 }}
          animate={{
            y: ["0vh", "110vh"],
            x: windActive 
              ? [0, petal.swayAmount * 1.5 * windDirection, 0]
              : [0, -petal.swayAmount * 0.6, petal.swayAmount * 0.6, 0],
            rotate: [petal.rotation, petal.rotation + 360],
            opacity: [0, 0.5, 0.5, 0],
          }}
          transition={{
            duration: petal.duration * 1.3,
            delay: petal.delay + 6,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.05, 0.95, 1],
          }}
        >
          <svg width={petal.size * 0.6} height={petal.size * 0.6} viewBox="0 0 24 24">
            <ellipse cx="12" cy="12" rx="6" ry="10" fill="hsl(340, 75%, 80%)" opacity={0.6} />
          </svg>
        </motion.div>
      ))}

      {/* Wind burst petals - only appear during wind */}
      <AnimatePresence>
        {windActive && (
          <>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={`wind-${windKey}-${i}`}
                className="absolute will-change-transform"
                style={{
                  left: windDirection > 0 ? '-5%' : '105%',
                  top: `${15 + i * 12}%`,
                }}
                initial={{ opacity: 0, x: 0 }}
                animate={{
                  x: windDirection > 0 ? '120vw' : '-120vw',
                  y: [0, 50 + Math.random() * 100],
                  rotate: [0, 360 * windDirection],
                  opacity: [0, 0.7, 0.7, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2.5 + Math.random(),
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
              >
                <svg width={12} height={12} viewBox="0 0 24 24">
                  <ellipse cx="12" cy="12" rx="5" ry="8" fill="hsl(345, 70%, 82%)" opacity={0.6} />
                </svg>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};