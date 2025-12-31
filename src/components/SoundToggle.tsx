import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface SoundToggleProps {
  isSoundEnabled: boolean;
  onToggle: () => void;
  className?: string;
}

export const SoundToggle = ({ isSoundEnabled, onToggle, className = "" }: SoundToggleProps) => {
  return (
    <motion.button
      className={`fixed z-50 p-3 rounded-full glass-card hover:anime-border transition-all duration-300 group ${className}`}
      onClick={onToggle}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isSoundEnabled ? "Mute sound" : "Enable sound"}
    >
      {isSoundEnabled ? (
        <Volume2 className="w-5 h-5 text-primary transition-colors" />
      ) : (
        <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      )}
      
      {/* Sound waves animation when enabled */}
      {isSoundEnabled && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full border border-primary/30"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border border-primary/20"
            animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          />
        </>
      )}
    </motion.button>
  );
};
