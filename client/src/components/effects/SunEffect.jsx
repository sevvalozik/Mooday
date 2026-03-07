import { useMemo } from 'react';

export const SunEffect = () => {
  const rays = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      rotation: (i / 12) * 360,
      delay: `${i * 0.3}s`,
      width: 2 + Math.random() * 3,
    })), []);

  const sparkles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      top: `${5 + Math.random() * 60}%`,
      size: 2 + Math.random() * 3,
      delay: `${Math.random() * 5}s`,
      duration: `${2 + Math.random() * 3}s`,
    })), []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/15 via-orange-950/5 to-gray-950" />

      {/* Sun glow */}
      <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.25) 0%, rgba(255, 140, 0, 0.15) 30%, rgba(255, 69, 0, 0.05) 60%, transparent 80%)',
          animation: 'sunPulse 4s ease-in-out infinite',
        }}
      />

      {/* Light rays */}
      <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2">
        {rays.map((ray) => (
          <div
            key={ray.id}
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{
              width: ray.width,
              height: '200%',
              background: 'linear-gradient(to bottom, rgba(255, 215, 0, 0.15), transparent 80%)',
              transform: `translate(-50%, -100%) rotate(${ray.rotation}deg)`,
              animation: `rayPulse 3s ease-in-out ${ray.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Warm light wash */}
      <div className="absolute top-0 left-0 right-0 h-60 opacity-15"
        style={{ background: 'linear-gradient(to bottom, rgba(255, 200, 50, 0.4), transparent)' }}
      />

      {/* Floating sparkles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: 'radial-gradient(circle, #FFD700, transparent)',
            animation: `sparkleFloat ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes sunPulse {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 1; }
          50% { transform: translateX(-50%) scale(1.15); opacity: 0.8; }
        }
        @keyframes rayPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes sparkleFloat {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
          50% { opacity: 0.7; transform: translateY(-15px) scale(1); }
        }
      `}</style>
    </>
  );
};
