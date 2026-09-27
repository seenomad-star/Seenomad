import { useCallback, useRef } from "react";
import { useGamification } from "@/contexts/GamificationContext";

export type SoundType = "mechanical" | "typewriter" | "soft" | "thocky" | "clicky" | "asmr" | "scifi" | "none";

// Audio context for generating sounds
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

// Sound configurations for each type
const soundConfigs = {
  mechanical: {
    frequency: 800,
    duration: 0.08,
    attack: 0.005,
    decay: 0.05,
    volume: 0.3,
    type: "square" as OscillatorType,
    clickFreq: 2000,
  },
  typewriter: {
    frequency: 400,
    duration: 0.12,
    attack: 0.01,
    decay: 0.08,
    volume: 0.25,
    type: "sawtooth" as OscillatorType,
    clickFreq: 1200,
  },
  soft: {
    frequency: 600,
    duration: 0.05,
    attack: 0.01,
    decay: 0.03,
    volume: 0.15,
    type: "sine" as OscillatorType,
    clickFreq: 1500,
  },
  thocky: {
    frequency: 250,
    duration: 0.12,
    attack: 0.005,
    decay: 0.1,
    volume: 0.4,
    type: "sine" as OscillatorType,
    clickFreq: 600,
  },
  clicky: {
    frequency: 1000,
    duration: 0.06,
    attack: 0.002,
    decay: 0.04,
    volume: 0.35,
    type: "square" as OscillatorType,
    clickFreq: 3000,
  },
  asmr: {
    frequency: 400,
    duration: 0.15,
    attack: 0.02,
    decay: 0.1,
    volume: 0.2,
    type: "triangle" as OscillatorType,
    clickFreq: 800,
  },
  scifi: {
    frequency: 1200,
    duration: 0.1,
    attack: 0.005,
    decay: 0.08,
    volume: 0.3,
    type: "sawtooth" as OscillatorType,
    clickFreq: 4000,
  },
};

export const useKeyboardSounds = () => {
  const lastPlayTime = useRef(0);
  const minInterval = 30; // Minimum ms between sounds

  const { userStats } = useGamification();
  const equippedSound = (userStats.equippedCosmetics?.sound?.replace('sound_', '') || 'mechanical') as SoundType;

  const playSound = useCallback((overriddenType?: SoundType, isCorrect: boolean = true) => {
    const soundType = overriddenType || equippedSound;
    if (soundType === "none") return;

    const now = Date.now();
    if (now - lastPlayTime.current < minInterval) return;
    lastPlayTime.current = now;

    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const config = soundConfigs[soundType];
      const currentTime = ctx.currentTime;

      // Create oscillator for the main tone
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(
        isCorrect ? config.frequency : config.frequency * 0.7,
        currentTime
      );

      // Envelope for natural sound
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(
        config.volume * (isCorrect ? 1 : 0.6),
        currentTime + config.attack
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        currentTime + config.duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(currentTime);
      oscillator.stop(currentTime + config.duration);

      // Add click sound for mechanical/typewriter
      if (soundType === "mechanical" || soundType === "typewriter") {
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();

        clickOsc.type = "square";
        clickOsc.frequency.setValueAtTime(config.clickFreq, currentTime);

        clickGain.gain.setValueAtTime(config.volume * 0.5, currentTime);
        clickGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.02);

        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);

        clickOsc.start(currentTime);
        clickOsc.stop(currentTime + 0.02);
      }

      // Add return sound for typewriter
      if (soundType === "typewriter") {
        const returnOsc = ctx.createOscillator();
        const returnGain = ctx.createGain();

        returnOsc.type = "sine";
        returnOsc.frequency.setValueAtTime(300, currentTime + 0.02);

        returnGain.gain.setValueAtTime(0, currentTime + 0.02);
        returnGain.gain.linearRampToValueAtTime(config.volume * 0.3, currentTime + 0.03);
        returnGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.08);

        returnOsc.connect(returnGain);
        returnGain.connect(ctx.destination);

        returnOsc.start(currentTime + 0.02);
        returnOsc.stop(currentTime + 0.08);
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, []);

  const playErrorSound = useCallback((soundType: SoundType) => {
    if (soundType === "none") return;

    try {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const currentTime = ctx.currentTime;

      // Create a buzzer-like error sound
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(200, currentTime);
      oscillator.frequency.linearRampToValueAtTime(150, currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.15, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(currentTime);
      oscillator.stop(currentTime + 0.1);
    } catch (error) {
      console.error("Error playing error sound:", error);
    }
  }, []);

  return { playSound, playErrorSound };
};
