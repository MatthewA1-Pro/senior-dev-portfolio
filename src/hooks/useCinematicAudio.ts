import { useRef, useState, useCallback, useEffect } from 'react';

interface AudioContextState {
  context: AudioContext | null;
  masterGain: GainNode | null;
}

export const useCinematicAudio = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioState = useRef<AudioContextState>({ context: null, masterGain: null });
  const activeNodes = useRef<AudioNode[]>([]);

  const initAudio = useCallback(() => {
    if (audioState.current.context) return;
    
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const masterGain = context.createGain();
    masterGain.connect(context.destination);
    masterGain.gain.value = 0.3;
    
    audioState.current = { context, masterGain };
    setIsInitialized(true);
  }, []);

  const toggleSound = useCallback(() => {
    if (!isInitialized) {
      initAudio();
      setIsSoundEnabled(true);
    } else {
      setIsSoundEnabled(prev => !prev);
    }
  }, [isInitialized, initAudio]);

  // Deep ambient drone
  const playAmbientDrone = useCallback(() => {
    if (!isSoundEnabled || !audioState.current.context || !audioState.current.masterGain) return;
    
    const { context, masterGain } = audioState.current;
    const now = context.currentTime;
    
    // Create layered oscillators for rich ambient sound
    const frequencies = [55, 82.5, 110, 165];
    
    frequencies.forEach((freq, i) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      filter.type = 'lowpass';
      filter.frequency.value = 200;
      filter.Q.value = 1;
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08 - i * 0.015, now + 3);
      gain.gain.setValueAtTime(0.08 - i * 0.015, now + 12);
      gain.gain.linearRampToValueAtTime(0, now + 15);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      osc.start(now);
      osc.stop(now + 15);
      
      activeNodes.current.push(osc, gain, filter);
    });
  }, [isSoundEnabled]);

  // Whoosh/transition sound
  const playWhoosh = useCallback(() => {
    if (!isSoundEnabled || !audioState.current.context || !audioState.current.masterGain) return;
    
    const { context, masterGain } = audioState.current;
    const now = context.currentTime;
    
    // Noise-based whoosh
    const bufferSize = context.sampleRate * 0.8;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    
    const source = context.createBufferSource();
    source.buffer = buffer;
    
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(2000, now + 0.3);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.8);
    filter.Q.value = 0.5;
    
    const gain = context.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
    gain.gain.linearRampToValueAtTime(0, now + 0.8);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    source.start(now);
    
    activeNodes.current.push(source, filter, gain);
  }, [isSoundEnabled]);

  // Rising tension sound
  const playRisingTension = useCallback(() => {
    if (!isSoundEnabled || !audioState.current.context || !audioState.current.masterGain) return;
    
    const { context, masterGain } = audioState.current;
    const now = context.currentTime;
    
    const osc = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(40, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 4);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 4);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 2);
    gain.gain.linearRampToValueAtTime(0.1, now + 3.5);
    gain.gain.linearRampToValueAtTime(0, now + 4);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    osc.start(now);
    osc.stop(now + 4);
    
    activeNodes.current.push(osc, gain, filter);
  }, [isSoundEnabled]);

  // Kamui vortex sound
  const playKamuiVortex = useCallback(() => {
    if (!isSoundEnabled || !audioState.current.context || !audioState.current.masterGain) return;
    
    const { context, masterGain } = audioState.current;
    const now = context.currentTime;
    
    // Spinning/vortex effect
    const osc1 = context.createOscillator();
    const osc2 = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const panner = context.createStereoPanner();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(80, now);
    osc1.frequency.exponentialRampToValueAtTime(400, now + 1.5);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(85, now);
    osc2.frequency.exponentialRampToValueAtTime(420, now + 1.5);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.exponentialRampToValueAtTime(1500, now + 1.5);
    filter.Q.value = 2;
    
    // Spinning panner effect
    const panLFO = context.createOscillator();
    const panGain = context.createGain();
    panLFO.frequency.setValueAtTime(2, now);
    panLFO.frequency.exponentialRampToValueAtTime(15, now + 1.5);
    panGain.gain.value = 0.8;
    panLFO.connect(panGain);
    panGain.connect(panner.pan);
    panLFO.start(now);
    panLFO.stop(now + 1.5);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
    gain.gain.linearRampToValueAtTime(0.18, now + 1);
    gain.gain.linearRampToValueAtTime(0, now + 1.5);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(panner);
    panner.connect(gain);
    gain.connect(masterGain);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.5);
    osc2.stop(now + 1.5);
    
    activeNodes.current.push(osc1, osc2, gain, filter, panLFO, panGain);
  }, [isSoundEnabled]);

  // Text reveal chime - more musical
  const playTextReveal = useCallback(() => {
    if (!isSoundEnabled || !audioState.current.context || !audioState.current.masterGain) return;
    
    const { context, masterGain } = audioState.current;
    const now = context.currentTime;
    
    // Musical chord reveal
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.06, now + i * 0.05 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(now + i * 0.05);
      osc.stop(now + 0.6);
      
      activeNodes.current.push(osc, gain);
    });
  }, [isSoundEnabled]);

  // Epic reveal/cinematic music
  const playRevealMusic = useCallback(() => {
    if (!isSoundEnabled || !audioState.current.context || !audioState.current.masterGain) return;
    
    const { context, masterGain } = audioState.current;
    const now = context.currentTime;
    
    // Bass foundation
    const bassOsc = context.createOscillator();
    const bassGain = context.createGain();
    const bassFilter = context.createBiquadFilter();
    
    bassOsc.type = 'sawtooth';
    bassOsc.frequency.setValueAtTime(55, now);
    
    bassFilter.type = 'lowpass';
    bassFilter.frequency.value = 150;
    
    bassGain.gain.setValueAtTime(0, now);
    bassGain.gain.linearRampToValueAtTime(0.15, now + 1);
    bassGain.gain.setValueAtTime(0.15, now + 8);
    bassGain.gain.linearRampToValueAtTime(0, now + 12);
    
    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(masterGain);
    bassOsc.start(now);
    bassOsc.stop(now + 12);
    
    // Rising synth pad
    const padNotes = [110, 138.59, 164.81, 220]; // A2, C#3, E3, A3
    padNotes.forEach((freq, i) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.linearRampToValueAtTime(2000, now + 6);
      
      gain.gain.setValueAtTime(0, now + i * 0.5);
      gain.gain.linearRampToValueAtTime(0.08, now + 2 + i * 0.5);
      gain.gain.setValueAtTime(0.08, now + 8);
      gain.gain.linearRampToValueAtTime(0, now + 12);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      osc.start(now + i * 0.5);
      osc.stop(now + 12);
      
      activeNodes.current.push(osc, gain, filter);
    });
    
    // Rhythmic pulse
    for (let beat = 0; beat < 12; beat++) {
      const pulseOsc = context.createOscillator();
      const pulseGain = context.createGain();
      
      pulseOsc.type = 'sine';
      pulseOsc.frequency.value = 82.41; // E2
      
      const beatTime = now + beat * 0.75;
      pulseGain.gain.setValueAtTime(0.12, beatTime);
      pulseGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.3);
      
      pulseOsc.connect(pulseGain);
      pulseGain.connect(masterGain);
      
      pulseOsc.start(beatTime);
      pulseOsc.stop(beatTime + 0.4);
      
      activeNodes.current.push(pulseOsc, pulseGain);
    }
    
    // Bright ascending arpeggios
    const arpNotes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    arpNotes.forEach((freq, i) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      const startTime = now + 3 + i * 0.2;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.06, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(startTime);
      osc.stop(startTime + 1);
      
      activeNodes.current.push(osc, gain);
    });
    
    // Cymbal shimmer
    const shimmerBuffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
    const shimmerData = shimmerBuffer.getChannelData(0);
    for (let i = 0; i < shimmerData.length; i++) {
      shimmerData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / shimmerData.length, 0.5);
    }
    
    const shimmerSource = context.createBufferSource();
    shimmerSource.buffer = shimmerBuffer;
    
    const shimmerFilter = context.createBiquadFilter();
    shimmerFilter.type = 'highpass';
    shimmerFilter.frequency.value = 8000;
    
    const shimmerGain = context.createGain();
    shimmerGain.gain.setValueAtTime(0, now + 2);
    shimmerGain.gain.linearRampToValueAtTime(0.04, now + 2.5);
    shimmerGain.gain.linearRampToValueAtTime(0, now + 5);
    
    shimmerSource.connect(shimmerFilter);
    shimmerFilter.connect(shimmerGain);
    shimmerGain.connect(masterGain);
    
    shimmerSource.start(now + 2);
    
    activeNodes.current.push(bassOsc, bassGain, bassFilter, shimmerSource, shimmerFilter, shimmerGain);
  }, [isSoundEnabled]);

  // Scroll transition swoosh
  const playScrollTransition = useCallback(() => {
    if (!isSoundEnabled || !audioState.current.context || !audioState.current.masterGain) return;
    
    const { context, masterGain } = audioState.current;
    const now = context.currentTime;
    
    // Quick melodic swoosh
    const osc = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
    
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 1;
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    
    osc.start(now);
    osc.stop(now + 0.4);
    
    activeNodes.current.push(osc, gain, filter);
  }, [isSoundEnabled]);

  // Heartbeat/pulse
  const playHeartbeat = useCallback(() => {
    if (!isSoundEnabled || !audioState.current.context || !audioState.current.masterGain) return;
    
    const { context, masterGain } = audioState.current;
    const now = context.currentTime;
    
    const playBeat = (time: number) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = 50;
      
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
      
      osc.connect(gain);
      gain.connect(masterGain);
      
      osc.start(time);
      osc.stop(time + 0.15);
      
      activeNodes.current.push(osc, gain);
    };
    
    // Double beat pattern
    playBeat(now);
    playBeat(now + 0.15);
  }, [isSoundEnabled]);

  // Cleanup
  useEffect(() => {
    return () => {
      activeNodes.current.forEach(node => {
        try {
          if (node instanceof AudioScheduledSourceNode) {
            node.stop();
          }
          node.disconnect();
        } catch (e) {
          // Node may already be disconnected
        }
      });
      if (audioState.current.context) {
        audioState.current.context.close();
      }
    };
  }, []);

  return {
    isSoundEnabled,
    isInitialized,
    toggleSound,
    playAmbientDrone,
    playWhoosh,
    playRisingTension,
    playKamuiVortex,
    playTextReveal,
    playHeartbeat,
    playRevealMusic,
    playScrollTransition,
  };
};
