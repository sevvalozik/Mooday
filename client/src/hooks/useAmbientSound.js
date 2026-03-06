import { useEffect, useRef } from 'react';

// Ambient sound mapping — actual sound files would go in public/sounds/
const SOUND_MAP = {
  happiness: '/sounds/sunshine.mp3',
  sadness: '/sounds/rain.mp3',
  anger: '/sounds/storm.mp3',
  calm: '/sounds/nature.mp3',
  excitement: '/sounds/energy.mp3',
  anxiety: '/sounds/wind.mp3',
  tired: '/sounds/night.mp3',
  hopeful: '/sounds/sunrise.mp3',
};

export const useAmbientSound = (emotion, enabled = true) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!enabled || !emotion) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    const soundUrl = SOUND_MAP[emotion];
    if (!soundUrl) return;

    // Create audio element (will silently fail if file doesn't exist)
    const audio = new Audio(soundUrl);
    audio.loop = true;
    audio.volume = 0.15;
    audio.play().catch(() => {
      // Audio autoplay blocked or file not found — expected in dev
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [emotion, enabled]);

  return {
    setVolume: (vol) => {
      if (audioRef.current) audioRef.current.volume = vol;
    },
    pause: () => {
      if (audioRef.current) audioRef.current.pause();
    },
    resume: () => {
      if (audioRef.current) audioRef.current.play().catch(() => {});
    },
  };
};
