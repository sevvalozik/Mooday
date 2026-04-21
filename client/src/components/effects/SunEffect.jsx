import { useMemo } from 'react';

export const SunEffect = () => {
  const sparkles = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      top: `${10 + Math.random() * 75}%`,
      size: 2 + Math.random() * 4,
      delay: `${Math.random() * 5}s`,
      duration: `${2.5 + Math.random() * 3}s`,
    })), []);

  const floatingOrbs = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${7 + Math.random() * 6}s`,
      size: 5 + Math.random() * 10,
    })), []);

  return (
    <>
      {/* Dark warm base */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-orange-950/15 to-gray-950" />

      {/* Sun — tucked in top-left corner, background-like */}
      <div
        className="absolute -top-32 -left-32 h-[26rem] w-[26rem] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,220,60,0.28) 0%, rgba(255,170,0,0.14) 35%, rgba(255,120,0,0.06) 60%, transparent 75%)',
          animation: 'sunPulse 5s ease-in-out infinite',
        }}
      />

      {/* Subtle rays — fan only from top-left, behind everything */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = -20 + i * 14; // angles roughly pointing right/down from top-left
        return (
          <div
            key={i}
            className="absolute top-0 left-0 origin-top-left"
            style={{
              width: 2 + i % 3,
              height: '65%',
              background:
                'linear-gradient(to bottom, rgba(255,210,60,0.18), rgba(255,180,0,0.06) 55%, transparent 85%)',
              transform: `rotate(${angle}deg)`,
              transformOrigin: '0 0',
              animation: `rayPulse 4s ease-in-out ${i * 0.25}s infinite`,
            }}
          />
        );
      })}

      {/* Warm top-left wash */}
      <div
        className="absolute top-0 left-0 h-80 w-80 opacity-25"
        style={{
          background:
            'radial-gradient(circle at 10% 5%, rgba(255,200,60,0.55), transparent 65%)',
        }}
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
            background:
              'radial-gradient(circle, rgba(255,215,0,0.55), rgba(255,165,0,0.2), transparent)',
            boxShadow: '0 0 12px rgba(255,215,0,0.25)',
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
            background: 'radial-gradient(circle, rgba(255,215,0,0.85), transparent)',
            boxShadow: '0 0 6px rgba(255,215,0,0.35)',
            animation: `sparkleFloat ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes sunPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.75; }
        }
        @keyframes rayPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes sparkleFloat {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
          50% { opacity: 0.8; transform: translateY(-14px) scale(1); }
        }
        @keyframes orbFloat {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          15% { opacity: 0.6; }
          50% { transform: translateY(-50vh) scale(1); opacity: 0.4; }
          85% { opacity: 0.2; }
          100% { transform: translateY(-105vh) scale(0.3); opacity: 0; }
        }
      `}</style>
    </>
  );
};
