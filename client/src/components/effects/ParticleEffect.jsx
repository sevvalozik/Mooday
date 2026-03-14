import { useMemo } from 'react';

export const ParticleEffect = () => {
  const fireworks = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 85}%`,
      size: 3 + Math.random() * 6,
      delay: `${Math.random() * 6}s`,
      duration: `${2 + Math.random() * 3}s`,
      color: ['#FF8C00', '#FF4500', '#FFD700', '#FF6347', '#FFA500', '#FF1493'][Math.floor(Math.random() * 6)],
    })), []);

  const trails = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 6}s`,
      duration: `${1.2 + Math.random() * 0.8}s`,
    })), []);

  const burstRings = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: `${15 + Math.random() * 70}%`,
      top: `${10 + Math.random() * 60}%`,
      delay: `${i * 2 + Math.random() * 2}s`,
      duration: `${2 + Math.random() * 1.5}s`,
      color: ['#FF8C00', '#FFD700', '#FF4500'][Math.floor(Math.random() * 3)],
    })), []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-orange-950/25 via-gray-950 to-gray-950" />

      {/* Energy waves */}
      <div className="absolute inset-0 opacity-15"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 140, 0, 0.4), transparent 55%)',
          animation: 'energyPulse 3s ease-in-out infinite',
        }}
      />

      {/* Burst rings */}
      {burstRings.map((ring) => (
        <div
          key={`ring-${ring.id}`}
          className="absolute rounded-full"
          style={{
            left: ring.left,
            top: ring.top,
            width: 0,
            height: 0,
            border: `2px solid ${ring.color}60`,
            animation: `burstRing ${ring.duration} ease-out ${ring.delay} infinite`,
          }}
        />
      ))}

      {/* Shooting stars / trails */}
      {trails.map((t) => (
        <div
          key={t.id}
          className="absolute top-0"
          style={{
            left: t.left,
            width: 2,
            height: '18%',
            background: 'linear-gradient(to bottom, rgba(255, 140, 0, 0.7), rgba(255, 69, 0, 0.4), transparent)',
            boxShadow: '0 0 6px rgba(255, 140, 0, 0.3)',
            animation: `shootingStar ${t.duration} ease-in ${t.delay} infinite`,
          }}
        />
      ))}

      {/* Floating particles */}
      {fireworks.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${p.color}, transparent)`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}50`,
            animation: `excitedParticle ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}

      {/* Warm ambient glow */}
      <div className="absolute bottom-0 left-0 right-0 h-48 opacity-15"
        style={{ background: 'linear-gradient(to top, rgba(255, 140, 0, 0.3), transparent)' }}
      />

      <style>{`
        @keyframes energyPulse {
          0%, 100% { transform: scale(1); opacity: 0.12; }
          50% { transform: scale(1.3); opacity: 0.25; }
        }
        @keyframes shootingStar {
          0% { transform: translateY(-100%) translateX(0); opacity: 0; }
          10% { opacity: 0.9; }
          100% { transform: translateY(600%) translateX(40px); opacity: 0; }
        }
        @keyframes excitedParticle {
          0% { opacity: 0; transform: scale(0) translateY(0); }
          30% { opacity: 0.9; transform: scale(1.3) translateY(-12px); }
          70% { opacity: 0.7; transform: scale(0.9) translateY(-30px); }
          100% { opacity: 0; transform: scale(0) translateY(-50px); }
        }
        @keyframes burstRing {
          0% { width: 0; height: 0; opacity: 0.8; margin-left: 0; margin-top: 0; }
          100% { width: 120px; height: 120px; opacity: 0; margin-left: -60px; margin-top: -60px; }
        }
      `}</style>
    </>
  );
};
