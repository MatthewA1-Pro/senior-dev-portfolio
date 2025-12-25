import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  swayAmount: number;
}

export const SakuraPetals = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate petals
    const generatePetals = () => {
      const newPetals: Petal[] = [];
      for (let i = 0; i < 25; i++) {
        newPetals.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 10,
          duration: 12 + Math.random() * 8,
          size: 8 + Math.random() * 12,
          rotation: Math.random() * 360,
          swayAmount: 30 + Math.random() * 50,
        });
      }
      setPetals(newPetals);
    };

    generatePetals();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: -30,
          }}
          initial={{ y: -30, opacity: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, petal.swayAmount, -petal.swayAmount, petal.swayAmount / 2, 0],
            rotate: [petal.rotation, petal.rotation + 360],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.9, 0.95, 1],
          }}
        >
          {/* Sakura petal shape */}
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 24 24"
            className="drop-shadow-sm"
          >
            <defs>
              <linearGradient id={`petal-gradient-${petal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(340, 80%, 85%)" />
                <stop offset="50%" stopColor="hsl(340, 70%, 75%)" />
                <stop offset="100%" stopColor="hsl(350, 60%, 70%)" />
              </linearGradient>
            </defs>
            <path
              d="M12 2C12 2 8 6 8 10C8 12 9.5 14 12 14C14.5 14 16 12 16 10C16 6 12 2 12 2Z"
              fill={`url(#petal-gradient-${petal.id})`}
              opacity={0.85}
            />
            <path
              d="M12 14C12 14 8 16 6 19C5 20.5 5.5 22 7 22C9 22 11 20 12 18C13 20 15 22 17 22C18.5 22 19 20.5 18 19C16 16 12 14 12 14Z"
              fill={`url(#petal-gradient-${petal.id})`}
              opacity={0.7}
            />
          </svg>
        </motion.div>
      ))}
      
      {/* Additional smaller petals for depth */}
      {petals.slice(0, 15).map((petal, index) => (
        <motion.div
          key={`small-${petal.id}`}
          className="absolute opacity-60"
          style={{
            left: `${(petal.x + 30) % 100}%`,
            top: -20,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, -petal.swayAmount * 0.7, petal.swayAmount * 0.7, 0],
            rotate: [petal.rotation + 45, petal.rotation + 405],
            opacity: [0, 0.6, 0.6, 0.6, 0],
          }}
          transition={{
            duration: petal.duration * 1.2,
            delay: petal.delay + 5,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.9, 0.95, 1],
          }}
        >
          <svg
            width={petal.size * 0.6}
            height={petal.size * 0.6}
            viewBox="0 0 24 24"
          >
            <ellipse
              cx="12"
              cy="12"
              rx="6"
              ry="10"
              fill="hsl(340, 75%, 80%)"
              opacity={0.7}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};