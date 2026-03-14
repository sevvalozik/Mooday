import { useMemo } from 'react';

export const CalmEffect = () => {
  const leaves = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 4 + Math.random() * 7,
      delay: `${Math.random() * 12}s`,
      duration: `${10 + Math.random() * 8}s`,
      opacity: 0.15 + Math.random() * 0.2,
      sway: 30 + Math.random() * 60,
    })), []);

  const fireflies = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      top: `${15 + Math.random() * 65}%`,
      size: 3 + Math.random() * 4,
      delay: `${Math.random() * 8}s`,
      duration: `${4 + Math.random() * 4}s`,
    })), []);

  const waves = useMemo(() =>
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: `${i * 3}s`,
      opacity: 0.08 + i * 0.03,
    })), []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/25 via-teal-950/10 to-gray-950" />

      {/* Aurora-like gradient waves */}
      {waves.map((wave) => (
        <div key={wave.id} className="absolute inset-x-0 top-0 h-96"
          style={{
            background: 'linear-gradient(135deg, rgba(46, 139, 87, 0.4) 0%, rgba(0, 128, 128, 0.25) 50%, rgba(32, 178, 170, 0.15) 100%)',
            opacity: wave.opacity,
            animation: `auroraCalm 8s ease-in-out ${wave.delay} infinite alternate`,
          }}
        />
      ))}

      {/* Soft green ambient glow */}
      <div className="absolute inset-0 opacity-15"
        style={{
          background: 'radial-gradient(ellipse at 40% 60%, rgba(46, 139, 87, 0.4), transparent 55%), radial-gradient(ellipse at 70% 30%, rgba(0, 128, 128, 0.3), transparent 50%)',
        }}
      />

      {/* Floating leaves */}
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute rounded-full"
          style={{
            left: leaf.left,
            bottom: '-3%',
            width: leaf.size,
            height: leaf.size,
            backgroundColor: '#2E8B57',
            opacity: leaf.opacity,
            boxShadow: '0 0 6px rgba(46, 139, 87, 0.3)',
            animation: `calmFloat ${leaf.duration} ease-in-out ${leaf.delay} infinite`,
            '--sway': `${leaf.sway}px`,
          }}
        />
      ))}

      {/* Fireflies */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            background: 'radial-gradient(circle, rgba(144, 238, 144, 0.9), transparent)',
            boxShadow: '0 0 12px rgba(144, 238, 144, 0.5), 0 0 24px rgba(144, 238, 144, 0.2)',
            animation: `firefly ${f.duration} ease-in-out ${f.delay} infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes auroraCalm {
          0% { transform: translateX(-3%) skewY(-1deg); }
          100% { transform: translateX(3%) skewY(1deg); }
        }
        @keyframes calmFloat {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.2; }
          50% { transform: translateY(-50vh) translateX(var(--sway, 40px)) rotate(180deg); }
          90% { opacity: 0.15; }
          100% { transform: translateY(-100vh) translateX(0) rotate(360deg); opacity: 0; }
        }
        @keyframes firefly {
          0%, 100% { opacity: 0; transform: translate(0, 0) scale(0.5); }
          25% { opacity: 0.9; transform: translate(10px, -8px) scale(1.2); }
          50% { opacity: 0.4; transform: translate(-5px, -15px) scale(0.9); }
          75% { opacity: 0.8; transform: translate(8px, -5px) scale(1.1); }
        }
      `}</style>
    </>
  );
};
