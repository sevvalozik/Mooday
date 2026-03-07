import { useMemo } from 'react';

export const RainEffect = () => {
  const drops = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${0.6 + Math.random() * 0.6}s`,
      opacity: 0.08 + Math.random() * 0.2,
      height: 10 + Math.random() * 15,
    })), []);

  const ripples = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      bottom: `${Math.random() * 20}%`,
      delay: `${Math.random() * 4}s`,
      duration: `${1.5 + Math.random() * 1.5}s`,
    })), []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-slate-950 to-gray-950" />

      {/* Fog layer */}
      <div className="absolute inset-0 opacity-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 80%, rgba(65, 105, 225, 0.3), transparent 70%)',
          animation: 'fogDrift 10s ease-in-out infinite alternate',
        }}
      />

      {/* Rain drops */}
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute top-0 w-px"
          style={{
            left: drop.left,
            height: `${drop.height}%`,
            opacity: drop.opacity,
            background: 'linear-gradient(to bottom, transparent, rgba(100, 149, 237, 0.4), transparent)',
            animation: `rain ${drop.duration} linear ${drop.delay} infinite`,
          }}
        />
      ))}

      {/* Water ripples at bottom */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute h-1 w-8 rounded-full"
          style={{
            left: r.left,
            bottom: r.bottom,
            border: '1px solid rgba(100, 149, 237, 0.2)',
            animation: `ripple ${r.duration} ease-out ${r.delay} infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes rain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(700%); }
        }
        @keyframes ripple {
          0% { transform: scaleX(0.5) scaleY(1); opacity: 0.3; }
          100% { transform: scaleX(2) scaleY(0.3); opacity: 0; }
        }
        @keyframes fogDrift {
          0% { transform: translateX(-5%); }
          100% { transform: translateX(5%); }
        }
      `}</style>
    </>
  );
};
