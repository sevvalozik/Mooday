import { useEffect, useState } from 'react';
import { RainEffect } from './RainEffect.jsx';
import { SunEffect } from './SunEffect.jsx';
import { StormEffect } from './StormEffect.jsx';
import { ParticleEffect } from './ParticleEffect.jsx';
import { CalmEffect } from './CalmEffect.jsx';
import { NightEffect } from './NightEffect.jsx';
import { VortexEffect } from './VortexEffect.jsx';

const BACKGROUND_MAP = {
  happiness: SunEffect,
  sadness: RainEffect,
  anger: StormEffect,
  calm: CalmEffect,
  excitement: ParticleEffect,
  anxiety: VortexEffect,
  tired: NightEffect,
  hopeful: SunEffect,
};

const ThemeCelestial = () => {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  if (theme === 'light') {
    return (
      <>
        {/* Sun for light mode */}
        <div className="absolute -top-20 right-[10%] h-40 w-40 rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,220,50,0.6) 0%, rgba(255,180,0,0.3) 40%, rgba(255,140,0,0.1) 65%, transparent 80%)',
            animation: 'themeSunPulse 5s ease-in-out infinite',
            filter: 'blur(1px)',
          }}
        />
        <div className="absolute -top-10 right-[12%] h-28 w-28 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,235,100,0.8) 0%, rgba(255,200,50,0.4) 50%, transparent 75%)',
            animation: 'themeSunPulse 5s ease-in-out 0.5s infinite',
          }}
        />
        {/* Warm rays */}
        <div className="absolute top-0 right-0 h-80 w-80 opacity-20"
          style={{ background: 'radial-gradient(circle at 70% 10%, rgba(255,200,50,0.5), transparent 60%)' }}
        />
        <style>{`
          @keyframes themeSunPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.85; }
          }
        `}</style>
      </>
    );
  }

  if (theme === 'dark') {
    return (
      <>
        {/* Moon for dark mode */}
        <div className="absolute top-12 right-[12%] h-24 w-24 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #f0f0f0 0%, #d4d4d8 40%, #a1a1aa 80%)',
            boxShadow: '0 0 50px rgba(200,200,230,0.15), 0 0 100px rgba(200,200,230,0.08)',
            animation: 'themeMoonGlow 6s ease-in-out infinite',
            opacity: 0.3,
          }}
        />
        {/* Moon craters */}
        <div className="absolute top-16 right-[14%] h-4 w-4 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #888, transparent)' }}
        />
        <div className="absolute top-20 right-[16%] h-3 w-3 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #999, transparent)' }}
        />
        {/* Moon light wash */}
        <div className="absolute top-0 right-0 h-60 w-60 opacity-10"
          style={{ background: 'radial-gradient(circle at 80% 15%, rgba(200,200,240,0.4), transparent 60%)' }}
        />
        <style>{`
          @keyframes themeMoonGlow {
            0%, 100% { opacity: 0.3; box-shadow: 0 0 50px rgba(200,200,230,0.15); }
            50% { opacity: 0.4; box-shadow: 0 0 70px rgba(200,200,230,0.25); }
          }
        `}</style>
      </>
    );
  }

  // Cosmic/Nebula — no extra celestial
  return null;
};

export const MoodBackground = ({ emotion }) => {
  const EffectComponent = emotion ? BACKGROUND_MAP[emotion] : null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gray-950" />
      {EffectComponent && <EffectComponent />}
      <ThemeCelestial />
    </div>
  );
};
