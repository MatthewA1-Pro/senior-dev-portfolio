import { useRef, useState, useCallback } from "react";

interface TiltValues {
  rotateX: number;
  rotateY: number;
  scale: number;
}

export const useTilt3D = (intensity: number = 15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tiltValues, setTiltValues] = useState<TiltValues>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (-mouseY / (rect.height / 2)) * intensity;
      const rotateY = (mouseX / (rect.width / 2)) * intensity;

      setTiltValues({
        rotateX,
        rotateY,
        scale: 1.02,
      });
    },
    [intensity]
  );

  const handleMouseLeave = useCallback(() => {
    setTiltValues({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    });
  }, []);

  const tiltStyle = {
    transform: `perspective(1000px) rotateX(${tiltValues.rotateX}deg) rotateY(${tiltValues.rotateY}deg) scale(${tiltValues.scale})`,
    transition: tiltValues.scale === 1 ? "transform 0.5s ease-out" : "transform 0.1s ease-out",
  };

  return {
    ref,
    tiltStyle,
    handleMouseMove,
    handleMouseLeave,
  };
};
