import { useMemo } from 'react';

export const ParticleEffect = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
    }));
  }, []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-orange-950/10 to-gray-950" />
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, #FF8C00, #FF4500)`,
            animation: `sparkle ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) translateY(0); }
          50% { opacity: 0.6; transform: scale(1) translateY(-20px); }
        }
      `}</style>
    </>
  );
};
