import { useCallback } from 'react';

// Web Audio API-based sound effects for Naruto jutsu
export const useJutsuSounds = () => {
  const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

  // Kamui swirl sound - ethereal whoosh
  const playKamuiSound = useCallback(() => {
    if (!audioContext) return;
    
    const duration = 1.5;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + duration);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }, [audioContext]);

  // Byakugan activation - sharp crystalline sound
  const playByakuganSound = useCallback(() => {
    if (!audioContext) return;
    
    const duration = 0.5;
    
    // High frequency ping
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1200, audioContext.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + duration);
    gain1.gain.setValueAtTime(0.2, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    osc1.connect(gain1);
    gain1.connect(audioContext.destination);
    osc1.start();
    osc1.stop(audioContext.currentTime + duration);
    
    // Second harmonic
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(2400, audioContext.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1600, audioContext.currentTime + duration);
    gain2.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    osc2.start();
    osc2.stop(audioContext.currentTime + duration);
  }, [audioContext]);

  // Rasengan charging sound - spinning energy
  const playRasenganSound = useCallback(() => {
    if (!audioContext) return;
    
    const duration = 0.8;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(400, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + duration * 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }, [audioContext]);

  // Amaterasu ignite - dark crackling
  const playAmaterasuSound = useCallback(() => {
    if (!audioContext) return;
    
    const duration = 0.6;
    
    // Noise for crackling
    const bufferSize = audioContext.sampleRate * duration;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500;
    filter.Q.value = 2;
    
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    
    noise.start();
  }, [audioContext]);

  // Six Paths activation - divine resonance
  const playSixPathsSound = useCallback(() => {
    if (!audioContext) return;
    
    const duration = 1.2;
    
    // Deep resonant tone
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(110, audioContext.currentTime);
    gain1.gain.setValueAtTime(0, audioContext.currentTime);
    gain1.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.2);
    gain1.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + duration * 0.7);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    osc1.connect(gain1);
    gain1.connect(audioContext.destination);
    osc1.start();
    osc1.stop(audioContext.currentTime + duration);
    
    // High shimmer
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, audioContext.currentTime);
    gain2.gain.setValueAtTime(0, audioContext.currentTime);
    gain2.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    osc2.start();
    osc2.stop(audioContext.currentTime + duration);
    
    // Golden chime
    const osc3 = audioContext.createOscillator();
    const gain3 = audioContext.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(1320, audioContext.currentTime + 0.1);
    gain3.gain.setValueAtTime(0.08, audioContext.currentTime + 0.1);
    gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    osc3.connect(gain3);
    gain3.connect(audioContext.destination);
    osc3.start(audioContext.currentTime + 0.1);
    osc3.stop(audioContext.currentTime + duration);
  }, [audioContext]);

  // Susanoo activation - powerful bass
  const playSusanooSound = useCallback(() => {
    if (!audioContext) return;
    
    const duration = 0.8;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(40, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }, [audioContext]);

  // Generic whoosh
  const playWhoosh = useCallback(() => {
    if (!audioContext) return;
    
    const duration = 0.3;
    const bufferSize = audioContext.sampleRate * duration;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.5;
    }
    
    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(500, audioContext.currentTime);
    filter.frequency.linearRampToValueAtTime(2000, audioContext.currentTime + duration);
    
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    
    noise.start();
  }, [audioContext]);

  return {
    playKamuiSound,
    playByakuganSound,
    playRasenganSound,
    playAmaterasuSound,
    playSixPathsSound,
    playSusanooSound,
    playWhoosh,
  };
};
