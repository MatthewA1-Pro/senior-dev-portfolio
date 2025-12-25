import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// Naruto hand seal symbols (using Japanese text representations)
const HAND_SEALS = {
  rasengan: ["子", "丑", "寅"], // Ne, Ushi, Tora (Rat, Ox, Tiger)
  chidori: ["丑", "卯", "申"], // Ushi, U, Saru (Ox, Hare, Monkey)
  amaterasu: ["巳", "亥", "未"], // Mi, I, Hitsuji (Snake, Boar, Ram)
  susanoo: ["辰", "戌", "酉"], // Tatsu, Inu, Tori (Dragon, Dog, Bird)
  kamui: ["寅", "巳", "子"], // Tora, Mi, Ne (Tiger, Snake, Rat)
  sixpaths: ["卯", "辰", "午", "未", "申"], // Full sequence
};

interface HandSealsProps {
  jutsu: keyof typeof HAND_SEALS | null;
  onComplete?: () => void;
}

export const HandSeals = ({ jutsu, onComplete }: HandSealsProps) => {
  const [currentSealIndex, setCurrentSealIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (jutsu) {
      setIsActive(true);
      setCurrentSealIndex(0);
      
      const seals = HAND_SEALS[jutsu] || HAND_SEALS.rasengan;
      let index = 0;
      
      const interval = setInterval(() => {
        index++;
        if (index >= seals.length) {
          clearInterval(interval);
          setTimeout(() => {
            setIsActive(false);
            onComplete?.();
          }, 200);
        } else {
          setCurrentSealIndex(index);
        }
      }, 180);
      
      return () => clearInterval(interval);
    }
  }, [jutsu, onComplete]);
  
  if (!jutsu || !isActive) return null;
  
  const seals = HAND_SEALS[jutsu] || HAND_SEALS.rasengan;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Chakra burst background */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2, opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Hand seal display */}
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Current seal */}
          <motion.div
            key={currentSealIndex}
            className="text-6xl md:text-8xl font-bold text-primary"
            style={{
              textShadow: "0 0 30px hsl(var(--primary)), 0 0 60px hsl(var(--primary) / 0.5)",
            }}
            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 1.2, opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.15 }}
          >
            {seals[currentSealIndex]}
          </motion.div>
          
          {/* Seal indicator dots */}
          <div className="flex gap-2 mt-4">
            {seals.map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= currentSealIndex ? "bg-primary" : "bg-muted"
                }`}
                animate={{
                  scale: i === currentSealIndex ? [1, 1.5, 1] : 1,
                }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
          
          {/* Circular chakra rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-primary/30"
              style={{
                width: 150 + i * 60,
                height: 150 + i * 60,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
