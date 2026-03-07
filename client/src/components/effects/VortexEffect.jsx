import { useMemo } from 'react';

export const VortexEffect = () => {
  const rings = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      size: 200 + i * 150,
      duration: `${8 + i * 2}s`,
      opacity: 0.06 - i * 0.008,
      direction: i % 2 === 0 ? 'normal' : 'reverse',
    })), []);

  const particles = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${20 + Math.random() * 60}%`,
      top: `${20 + Math.random() * 60}%`,
      size: 2 + Math.random() * 3,
      delay: `${Math.random() * 6}s`,
      duration: `${3 + Math.random() * 3}s`,
    })), []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-gray-950 to-gray-950" />

      {/* Spinning vortex rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {rings.map((ring) => (
          <div
            key={ring.id}
            className="absolute rounded-full"
            style={{
              width: ring.size,
              height: ring.size,
              border: '1px solid rgba(139, 0, 139, 0.2)',
              opacity: ring.opacity,
              animation: `vortexSpin ${ring.duration} linear infinite ${ring.direction}`,
            }}
          />
        ))}
      </div>

      {/* Anxious floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, rgba(139, 0, 139, 0.6), transparent)',
            animation: `anxiousFloat ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}

      {/* Pulsing overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 0, 139, 0.4), transparent 60%)',
          animation: 'anxiousPulse 2s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes vortexSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes anxiousFloat {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(8px, -12px) scale(1.3); opacity: 0.7; }
          50% { transform: translate(-6px, 5px) scale(0.8); opacity: 0.4; }
          75% { transform: translate(10px, 8px) scale(1.1); opacity: 0.6; }
        }
        @keyframes anxiousPulse {
          0%, 100% { opacity: 0.03; transform: scale(1); }
          50% { opacity: 0.08; transform: scale(1.1); }
        }
      `}</style>
    </>
  );
};
