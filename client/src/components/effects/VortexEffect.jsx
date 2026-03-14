import { useMemo } from 'react';

export const VortexEffect = () => {
  const rings = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: 180 + i * 130,
      duration: `${6 + i * 2}s`,
      opacity: 0.15 - i * 0.015,
      direction: i % 2 === 0 ? 'normal' : 'reverse',
      borderWidth: 2 - i * 0.2,
    })), []);

  const particles = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: `${15 + Math.random() * 70}%`,
      top: `${15 + Math.random() * 70}%`,
      size: 3 + Math.random() * 4,
      delay: `${Math.random() * 6}s`,
      duration: `${2 + Math.random() * 3}s`,
    })), []);

  const spiralDots = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * Math.PI * 4;
      const radius = 80 + i * 12;
      return {
        id: i,
        x: 50 + Math.cos(angle) * (radius / 6),
        y: 50 + Math.sin(angle) * (radius / 6),
        size: 2 + Math.random() * 3,
        delay: `${i * 0.3}s`,
        duration: `${3 + Math.random() * 2}s`,
      };
    }), []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-gray-950 to-gray-950" />

      {/* Spinning vortex rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {rings.map((ring) => (
          <div
            key={ring.id}
            className="absolute rounded-full"
            style={{
              width: ring.size,
              height: ring.size,
              border: `${ring.borderWidth}px solid rgba(139, 0, 139, 0.35)`,
              boxShadow: `inset 0 0 30px rgba(139, 0, 139, 0.08), 0 0 15px rgba(139, 0, 139, 0.1)`,
              opacity: ring.opacity,
              animation: `vortexSpin ${ring.duration} linear infinite ${ring.direction}`,
            }}
          />
        ))}
      </div>

      {/* Spiral dots */}
      {spiralDots.map((dot) => (
        <div
          key={`spiral-${dot.id}`}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            background: 'radial-gradient(circle, rgba(186, 85, 211, 0.8), transparent)',
            boxShadow: '0 0 8px rgba(186, 85, 211, 0.4)',
            animation: `spiralPulse ${dot.duration} ease-in-out ${dot.delay} infinite`,
          }}
        />
      ))}

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
            background: 'radial-gradient(circle, rgba(186, 85, 211, 0.7), transparent)',
            boxShadow: '0 0 10px rgba(139, 0, 139, 0.3)',
            animation: `anxiousFloat ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}

      {/* Pulsing overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 0, 139, 0.5), transparent 55%)',
          animation: 'anxiousPulse 2s ease-in-out infinite',
        }}
      />

      {/* Edge vignette */}
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(50, 0, 50, 0.3) 100%)',
        }}
      />

      <style>{`
        @keyframes vortexSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes anxiousFloat {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(12px, -15px) scale(1.4); opacity: 0.8; }
          50% { transform: translate(-8px, 8px) scale(0.7); opacity: 0.4; }
          75% { transform: translate(14px, 10px) scale(1.2); opacity: 0.7; }
        }
        @keyframes anxiousPulse {
          0%, 100% { opacity: 0.06; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }
        @keyframes spiralPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.3); }
        }
      `}</style>
    </>
  );
};
