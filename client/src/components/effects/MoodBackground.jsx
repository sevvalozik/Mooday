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

const useTheme = () => {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return theme;
};

export const ThemeCelestial = () => {
  const theme = useTheme();

  if (theme === 'light') {
    return (
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Sun glow outer */}
        <div className="absolute -top-16 right-[8%] h-48 w-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,210,50,0.5) 0%, rgba(255,170,0,0.2) 40%, rgba(255,140,0,0.05) 65%, transparent 80%)',
            animation: 'themeSunPulse 5s ease-in-out infinite',
          }}
        />
        {/* Sun core */}
        <div className="absolute -top-4 right-[11%] h-28 w-28 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,240,120,0.9) 0%, rgba(255,210,60,0.5) 40%, transparent 70%)',
            animation: 'themeSunPulse 5s ease-in-out 0.5s infinite',
          }}
        />
        {/* Warm light wash on page */}
        <div className="absolute top-0 right-0 h-96 w-96 opacity-25"
          style={{ background: 'radial-gradient(circle at 75% 5%, rgba(255,200,50,0.6), transparent 55%)' }}
        />
        <style>{`
          @keyframes themeSunPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.85; }
          }
        `}</style>
      </div>
    );
  }

  if (theme === 'dark') {
    return (
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Moon */}
        <div className="absolute top-10 right-[10%] h-24 w-24 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #f0f0f0 0%, #d4d4d8 40%, #a1a1aa 80%)',
            boxShadow: '0 0 50px rgba(200,200,230,0.15), 0 0 100px rgba(200,200,230,0.08)',
            animation: 'themeMoonGlow 6s ease-in-out infinite',
            opacity: 0.3,
          }}
        />
        {/* Moon craters */}
        <div className="absolute top-14 right-[12%] h-4 w-4 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(136,136,136,0.3), transparent)', opacity: 0.2 }}
        />
        <div className="absolute top-[4.5rem] right-[14%] h-3 w-3 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(150,150,150,0.3), transparent)', opacity: 0.15 }}
        />
        {/* Moon glow wash */}
        <div className="absolute top-0 right-0 h-64 w-64 opacity-10"
          style={{ background: 'radial-gradient(circle at 80% 12%, rgba(200,200,240,0.5), transparent 55%)' }}
        />
        <style>{`
          @keyframes themeMoonGlow {
            0%, 100% { opacity: 0.3; box-shadow: 0 0 50px rgba(200,200,230,0.15); }
            50% { opacity: 0.4; box-shadow: 0 0 70px rgba(200,200,230,0.25); }
          }
        `}</style>
      </div>
    );
  }

  return null;
};

export const MoodBackground = ({ emotion }) => {
  const theme = useTheme();
  const showEffects = theme !== 'light';
  const EffectComponent = emotion && showEffects ? BACKGROUND_MAP[emotion] : null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0 bg-gray-950" />
      {EffectComponent && <EffectComponent />}
    </div>
  );
};
