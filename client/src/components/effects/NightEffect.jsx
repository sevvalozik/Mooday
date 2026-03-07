import { useMemo } from 'react';

export const NightEffect = () => {
  const stars = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 70}%`,
      size: 1 + Math.random() * 2,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
    })), []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-indigo-950/20 to-gray-950" />

      {/* Moon */}
      <div className="absolute top-16 right-[15%] h-20 w-20 rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #e8e8e8, #b0b0b0 60%, #808080)',
          boxShadow: '0 0 40px rgba(200, 200, 220, 0.15), 0 0 80px rgba(200, 200, 220, 0.05)',
          animation: 'moonGlow 6s ease-in-out infinite',
        }}
      />

      {/* Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animation: `starTwinkle ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes moonGlow {
          0%, 100% { opacity: 0.25; box-shadow: 0 0 40px rgba(200, 200, 220, 0.15); }
          50% { opacity: 0.3; box-shadow: 0 0 60px rgba(200, 200, 220, 0.2); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </>
  );
};
