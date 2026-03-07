import { useMemo } from 'react';

export const CalmEffect = () => {
  const leaves = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 3 + Math.random() * 5,
      delay: `${Math.random() * 12}s`,
      duration: `${10 + Math.random() * 8}s`,
      opacity: 0.08 + Math.random() * 0.12,
      sway: 30 + Math.random() * 60,
    })), []);

  const fireflies = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      top: `${20 + Math.random() * 60}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${4 + Math.random() * 4}s`,
    })), []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/15 via-teal-950/5 to-gray-950" />

      {/* Aurora-like gradient waves */}
      <div className="absolute inset-x-0 top-0 h-80 opacity-10"
        style={{
          background: 'linear-gradient(135deg, rgba(46, 139, 87, 0.3) 0%, rgba(0, 128, 128, 0.2) 50%, rgba(46, 139, 87, 0.1) 100%)',
          animation: 'auroraCalm 8s ease-in-out infinite alternate',
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
            animation: `calmFloat ${leaf.duration} ease-in-out ${leaf.delay} infinite`,
            '--sway': `${leaf.sway}px`,
          }}
        />
      ))}

      {/* Fireflies */}
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: f.left,
            top: f.top,
            background: 'radial-gradient(circle, rgba(144, 238, 144, 0.8), transparent)',
            boxShadow: '0 0 8px rgba(144, 238, 144, 0.4)',
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
          10% { opacity: var(--sway, 0.1); }
          50% { transform: translateY(-50vh) translateX(var(--sway, 40px)) rotate(180deg); }
          90% { opacity: var(--sway, 0.1); }
          100% { transform: translateY(-100vh) translateX(0) rotate(360deg); opacity: 0; }
        }
        @keyframes firefly {
          0%, 100% { opacity: 0; transform: translate(0, 0); }
          25% { opacity: 0.8; transform: translate(10px, -8px); }
          50% { opacity: 0.3; transform: translate(-5px, -15px); }
          75% { opacity: 0.7; transform: translate(8px, -5px); }
        }
      `}</style>
    </>
  );
};
