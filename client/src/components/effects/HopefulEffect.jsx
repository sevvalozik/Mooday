import { useMemo } from 'react';

export const HopefulEffect = () => {
  const fireflies = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      startY: `${30 + Math.random() * 65}%`,
      size: 2 + Math.random() * 4,
      delay: `${Math.random() * 8}s`,
      duration: `${4 + Math.random() * 5}s`,
      color: ['rgba(255,105,180,0.9)', 'rgba(255,160,210,0.8)', 'rgba(255,200,230,0.9)', 'rgba(255,130,190,0.85)'][
        Math.floor(Math.random() * 4)
      ],
    })),
    []
  );

  const beams = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: `${10 + i * 14}%`,
      delay: `${i * 0.7}s`,
    })),
    []
  );

  const stars = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60}%`,
      size: 1.5 + Math.random() * 2.5,
      delay: `${Math.random() * 6}s`,
      duration: `${2 + Math.random() * 3}s`,
    })),
    []
  );

  return (
    <>
      {/* Dark base with subtle rose tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-rose-950/20 to-gray-950" />

      {/* Horizon dawn glow — warm rose/pink from the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64"
        style={{
          background:
            'linear-gradient(to top, rgba(255,80,140,0.18) 0%, rgba(255,130,180,0.10) 35%, rgba(255,170,200,0.04) 65%, transparent 100%)',
        }}
      />

      {/* Horizon line glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background:
            'linear-gradient(to right, transparent 5%, rgba(255,105,180,0.55) 30%, rgba(255,160,210,0.7) 50%, rgba(255,105,180,0.55) 70%, transparent 95%)',
          animation: 'horizonPulse 4s ease-in-out infinite',
        }}
      />

      {/* Rising light beams from horizon */}
      {beams.map((beam) => (
        <div
          key={beam.id}
          className="absolute bottom-0"
          style={{
            left: beam.left,
            width: 1.5,
            height: '45%',
            background:
              'linear-gradient(to top, rgba(255,105,180,0.22), rgba(255,160,200,0.08) 55%, transparent 85%)',
            animation: `beamRise 5s ease-in-out ${beam.delay} infinite`,
          }}
        />
      ))}

      {/* Wide soft glow center-bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-3/4 opacity-25"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(255,105,180,0.5), rgba(255,160,200,0.2) 45%, transparent 70%)',
          animation: 'centerGlow 5s ease-in-out infinite',
        }}
      />

      {/* Faint twinkling stars */}
      {stars.map((s) => (
        <div
          key={`star-${s.id}`}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: 'radial-gradient(circle, rgba(255,200,230,0.95), transparent)',
            boxShadow: '0 0 4px rgba(255,160,200,0.4)',
            animation: `starTwinkle ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      {/* Floating fireflies / light motes */}
      {fireflies.map((f) => (
        <div
          key={`ff-${f.id}`}
          className="absolute rounded-full"
          style={{
            left: f.left,
            top: f.startY,
            width: f.size,
            height: f.size,
            background: `radial-gradient(circle, ${f.color}, transparent)`,
            boxShadow: `0 0 ${f.size * 3}px ${f.color.replace(')', ', 0.4)').replace('rgba(', 'rgba(')}`,
            animation: `fireflyDrift ${f.duration} ease-in-out ${f.delay} infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes horizonPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes beamRise {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 0.9; transform: scaleY(1.1); }
        }
        @keyframes centerGlow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.35; }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.85; transform: scale(1.2); }
        }
        @keyframes fireflyDrift {
          0% { opacity: 0; transform: translateY(0) translateX(0) scale(0.5); }
          20% { opacity: 0.85; transform: translateY(-18px) translateX(8px) scale(1); }
          50% { opacity: 0.65; transform: translateY(-40px) translateX(-6px) scale(0.9); }
          80% { opacity: 0.4; transform: translateY(-65px) translateX(10px) scale(0.7); }
          100% { opacity: 0; transform: translateY(-90px) translateX(0) scale(0.3); }
        }
      `}</style>
    </>
  );
};
