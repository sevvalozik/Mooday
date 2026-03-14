import { useMemo } from 'react';

export const SunEffect = () => {
  const rays = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      rotation: (i / 16) * 360,
      delay: `${i * 0.2}s`,
      width: 3 + Math.random() * 4,
    })), []);

  const sparkles = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      top: `${5 + Math.random() * 70}%`,
      size: 3 + Math.random() * 5,
      delay: `${Math.random() * 5}s`,
      duration: `${2 + Math.random() * 3}s`,
    })), []);

  const floatingOrbs = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      size: 6 + Math.random() * 12,
    })), []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-orange-950/10 to-gray-950" />

      {/* Sun glow */}
      <div className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 160, 0, 0.25) 25%, rgba(255, 100, 0, 0.1) 50%, transparent 70%)',
          animation: 'sunPulse 4s ease-in-out infinite',
        }}
      />

      {/* Light rays */}
      <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2">
        {rays.map((ray) => (
          <div
            key={ray.id}
            className="absolute left-1/2 top-1/2 origin-bottom"
            style={{
              width: ray.width,
              height: '220%',
              background: 'linear-gradient(to bottom, rgba(255, 215, 0, 0.35), rgba(255, 180, 0, 0.1) 60%, transparent 85%)',
              transform: `translate(-50%, -100%) rotate(${ray.rotation}deg)`,
              animation: `rayPulse 3s ease-in-out ${ray.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Warm light wash */}
      <div className="absolute top-0 left-0 right-0 h-72 opacity-30"
        style={{ background: 'linear-gradient(to bottom, rgba(255, 200, 50, 0.5), transparent)' }}
      />

      {/* Floating golden orbs */}
      {floatingOrbs.map((orb) => (
        <div
          key={`orb-${orb.id}`}
          className="absolute rounded-full"
          style={{
            left: orb.left,
            bottom: '-5%',
            width: orb.size,
            height: orb.size,
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6), rgba(255, 165, 0, 0.2), transparent)',
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
            animation: `orbFloat ${orb.duration} ease-in-out ${orb.delay} infinite`,
          }}
        />
      ))}

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
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.9), transparent)',
            boxShadow: '0 0 8px rgba(255, 215, 0, 0.4)',
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
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
        @keyframes sparkleFloat {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
          50% { opacity: 0.8; transform: translateY(-15px) scale(1); }
        }
        @keyframes orbFloat {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          15% { opacity: 0.7; }
          50% { transform: translateY(-55vh) scale(1); opacity: 0.5; }
          85% { opacity: 0.3; }
          100% { transform: translateY(-110vh) scale(0.3); opacity: 0; }
        }
      `}</style>
    </>
  );
};
