import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

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
  const [windActive, setWindActive] = useState(false);
  const [windDirection, setWindDirection] = useState(1); // 1 = right, -1 = left

  useEffect(() => {
    // Generate petals
    const generatePetals = () => {
      const newPetals: Petal[] = [];
      for (let i = 0; i < 30; i++) {
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

  // Wind gust effect - triggers occasionally
  useEffect(() => {
    const triggerWind = () => {
      setWindDirection(Math.random() > 0.5 ? 1 : -1);
      setWindActive(true);
      
      // Wind lasts 2-4 seconds
      const windDuration = 2000 + Math.random() * 2000;
      setTimeout(() => setWindActive(false), windDuration);
    };

    // Initial wind after 3 seconds
    const initialTimer = setTimeout(triggerWind, 3000);
    
    // Random wind gusts every 8-15 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance of wind
        triggerWind();
      }
    }, 8000 + Math.random() * 7000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const getWindOffset = (baseSwayAmount: number) => {
    if (!windActive) return baseSwayAmount;
    return baseSwayAmount * 2.5 * windDirection;
  };

  const getWindDuration = (baseDuration: number) => {
    if (!windActive) return baseDuration;
    return baseDuration * 0.6; // 40% faster during wind
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[2]">
      {/* Wind indicator - subtle blur effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: windActive 
            ? `linear-gradient(${windDirection > 0 ? '90deg' : '270deg'}, transparent 0%, hsl(340 70% 80% / 0.03) 50%, transparent 100%)`
            : 'transparent'
        }}
        transition={{ duration: 0.5 }}
      />

      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: -30,
          }}
          initial={{ y: -30, opacity: 0, x: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            x: windActive 
              ? [0, getWindOffset(petal.swayAmount), getWindOffset(petal.swayAmount) * 1.5, getWindOffset(petal.swayAmount) * 0.8, 0]
              : [0, petal.swayAmount, -petal.swayAmount, petal.swayAmount / 2, 0],
            rotate: windActive 
              ? [petal.rotation, petal.rotation + 720]
              : [petal.rotation, petal.rotation + 360],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: getWindDuration(petal.duration),
            delay: petal.delay,
            repeat: Infinity,
            ease: windActive ? "easeOut" : "linear",
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
      
      {/* Additional smaller petals for depth - more affected by wind */}
      {petals.slice(0, 18).map((petal) => (
        <motion.div
          key={`small-${petal.id}`}
          className="absolute opacity-60"
          style={{
            left: `${(petal.x + 30) % 100}%`,
            top: -20,
          }}
          initial={{ y: -20, opacity: 0, x: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            x: windActive 
              ? [0, getWindOffset(petal.swayAmount) * 1.8, getWindOffset(petal.swayAmount) * 2, getWindOffset(petal.swayAmount), 0]
              : [0, -petal.swayAmount * 0.7, petal.swayAmount * 0.7, 0],
            rotate: windActive 
              ? [petal.rotation + 45, petal.rotation + 765]
              : [petal.rotation + 45, petal.rotation + 405],
            opacity: [0, 0.6, 0.6, 0.6, 0],
          }}
          transition={{
            duration: getWindDuration(petal.duration * 1.2) * (windActive ? 0.7 : 1),
            delay: petal.delay + 5,
            repeat: Infinity,
            ease: windActive ? "easeOut" : "linear",
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

      {/* Extra tiny petals that appear during wind */}
      {windActive && petals.slice(0, 12).map((petal) => (
        <motion.div
          key={`wind-${petal.id}`}
          className="absolute"
          style={{
            left: windDirection > 0 ? '-5%' : '105%',
            top: `${20 + Math.random() * 60}%`,
          }}
          initial={{ opacity: 0, x: 0 }}
          animate={{
            x: windDirection > 0 ? ['0vw', '120vw'] : ['0vw', '-120vw'],
            y: [0, 100 + Math.random() * 200],
            rotate: [0, 720 * windDirection],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 1,
            ease: "easeOut",
          }}
        >
          <svg
            width={petal.size * 0.5}
            height={petal.size * 0.5}
            viewBox="0 0 24 24"
          >
            <ellipse
              cx="12"
              cy="12"
              rx="5"
              ry="8"
              fill="hsl(345, 70%, 82%)"
              opacity={0.6}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};