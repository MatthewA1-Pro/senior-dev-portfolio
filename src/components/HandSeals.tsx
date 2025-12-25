import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// Import hand seal images
import tigerSeal from "@/assets/handseal-tiger.png";
import snakeSeal from "@/assets/handseal-snake.png";
import ramSeal from "@/assets/handseal-ram.png";
import ratSeal from "@/assets/handseal-rat.png";
import oxSeal from "@/assets/handseal-ox.png";
import monkeySeal from "@/assets/handseal-monkey.png";

// Hand seal image mappings
const SEAL_IMAGES: Record<string, string> = {
  tiger: tigerSeal,
  snake: snakeSeal,
  ram: ramSeal,
  rat: ratSeal,
  ox: oxSeal,
  monkey: monkeySeal,
};

// Seal names for display
const SEAL_NAMES: Record<string, string> = {
  tiger: "寅 Tiger",
  snake: "巳 Snake",
  ram: "未 Ram",
  rat: "子 Rat",
  ox: "丑 Ox",
  monkey: "申 Monkey",
};

// Jutsu hand seal sequences using actual seal names
const HAND_SEALS = {
  rasengan: ["tiger", "ram", "snake"],
  chidori: ["ox", "monkey", "tiger"],
  amaterasu: ["snake", "rat", "ram"],
  susanoo: ["tiger", "snake", "ox"],
  kamui: ["rat", "monkey", "tiger"],
  sixpaths: ["ram", "tiger", "snake", "ox", "monkey"],
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
          }, 300);
        } else {
          setCurrentSealIndex(index);
        }
      }, 350); // Slightly longer to appreciate the images
      
      return () => clearInterval(interval);
    }
  }, [jutsu, onComplete]);
  
  if (!jutsu || !isActive) return null;
  
  const seals = HAND_SEALS[jutsu] || HAND_SEALS.rasengan;
  const currentSeal = seals[currentSealIndex];
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Dark overlay with chakra burst */}
        <motion.div
          className="absolute inset-0 bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        
        {/* Chakra burst background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2, opacity: [0, 0.8, 0.4] }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Hand seal display */}
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Current seal image */}
          <motion.div
            key={currentSealIndex}
            className="relative"
            initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 1.2, opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={SEAL_IMAGES[currentSeal]}
              alt={`${currentSeal} seal`}
              className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover"
              style={{
                boxShadow: "0 0 40px hsl(var(--primary)), 0 0 80px hsl(var(--primary) / 0.5)",
              }}
            />
            
            {/* Glowing ring around image */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary/50"
              animate={{
                boxShadow: [
                  "0 0 20px hsl(var(--primary))",
                  "0 0 40px hsl(var(--primary))",
                  "0 0 20px hsl(var(--primary))",
                ],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.div>
          
          {/* Seal name */}
          <motion.div
            key={`name-${currentSealIndex}`}
            className="mt-4 text-xl md:text-2xl font-bold text-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textShadow: "0 0 20px hsl(var(--primary))",
            }}
          >
            {SEAL_NAMES[currentSeal]}
          </motion.div>
          
          {/* Seal indicator dots */}
          <div className="flex gap-3 mt-4">
            {seals.map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i <= currentSealIndex ? "bg-primary" : "bg-muted"
                }`}
                animate={{
                  scale: i === currentSealIndex ? [1, 1.5, 1] : 1,
                  boxShadow: i === currentSealIndex 
                    ? "0 0 15px hsl(var(--primary))" 
                    : "none",
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
          
          {/* Circular chakra rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-primary/20"
              style={{
                width: 280 + i * 80,
                height: 280 + i * 80,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.1, 0.2],
                rotate: [0, 180],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
