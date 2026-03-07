import { useMemo } from 'react';

export const ParticleEffect = () => {
  const fireworks = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 80}%`,
      size: 2 + Math.random() * 5,
      delay: `${Math.random() * 6}s`,
      duration: `${2 + Math.random() * 3}s`,
      color: ['#FF8C00', '#FF4500', '#FFD700', '#FF6347', '#FFA500'][Math.floor(Math.random() * 5)],
    })), []);

  const trails = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${1.5 + Math.random() * 1}s`,
    })), []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-orange-950/15 via-gray-950 to-gray-950" />

      {/* Energy waves */}
      <div className="absolute inset-0 opacity-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 140, 0, 0.3), transparent 60%)',
          animation: 'energyPulse 3s ease-in-out infinite',
        }}
      />

      {/* Shooting stars / trails */}
      {trails.map((t) => (
        <div
          key={t.id}
          className="absolute top-0"
          style={{
            left: t.left,
            width: 2,
            height: '15%',
            background: 'linear-gradient(to bottom, rgba(255, 140, 0, 0.6), rgba(255, 69, 0, 0.3), transparent)',
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
            boxShadow: `0 0 ${p.size * 2}px ${p.color}40`,
            animation: `excitedParticle ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes energyPulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.3); opacity: 0.2; }
        }
        @keyframes shootingStar {
          0% { transform: translateY(-100%) translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(700%) translateX(50px); opacity: 0; }
        }
        @keyframes excitedParticle {
          0% { opacity: 0; transform: scale(0) translateY(0); }
          30% { opacity: 0.8; transform: scale(1.2) translateY(-10px); }
          70% { opacity: 0.6; transform: scale(0.8) translateY(-25px); }
          100% { opacity: 0; transform: scale(0) translateY(-40px); }
        }
      `}</style>
    </>
  );
};
