import { useMemo } from 'react';

export const NightEffect = () => {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 75}%`,
      size: 1 + Math.random() * 3,
      delay: `${Math.random() * 5}s`,
      duration: `${2 + Math.random() * 3}s`,
    })), []);

  const shootingStars = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      top: `${5 + Math.random() * 40}%`,
      left: `${Math.random() * 60}%`,
      delay: `${i * 4 + Math.random() * 3}s`,
      duration: `${1 + Math.random() * 0.5}s`,
    })), []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-950/30 to-gray-950" />

      {/* Deep sky gradient */}
      <div className="absolute inset-0 opacity-25"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(30, 30, 80, 0.6), transparent 60%), radial-gradient(ellipse at 80% 60%, rgba(25, 25, 60, 0.3), transparent 50%)',
        }}
      />

      {/* Moon */}
      <div className="absolute top-16 right-[15%] h-24 w-24 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #e8e8e8, #c0c0c0 50%, #909090)',
          boxShadow: '0 0 50px rgba(200, 200, 230, 0.2), 0 0 100px rgba(200, 200, 230, 0.1), 0 0 150px rgba(180, 180, 220, 0.05)',
          opacity: 0.35,
          animation: 'moonGlow 6s ease-in-out infinite',
        }}
      />
      {/* Moon craters */}
      <div className="absolute top-[5.5rem] right-[17.5%] h-3 w-3 rounded-full"
        style={{ background: 'rgba(120,120,120,0.3)', opacity: 0.3 }}
      />
      <div className="absolute top-[4.5rem] right-[19%] h-2 w-2 rounded-full"
        style={{ background: 'rgba(130,130,130,0.25)', opacity: 0.25 }}
      />

      {/* Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9), rgba(200, 200, 255, 0.4), transparent)',
            boxShadow: `0 0 ${s.size + 2}px rgba(200, 200, 255, 0.3)`,
            animation: `starTwinkle ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((ss) => (
        <div
          key={`ss-${ss.id}`}
          className="absolute"
          style={{
            top: ss.top,
            left: ss.left,
            width: 80,
            height: 2,
            background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.7), rgba(200, 200, 255, 0.3))',
            borderRadius: 1,
            animation: `shootingStar ${ss.duration} ease-in ${ss.delay} infinite`,
            transformOrigin: 'right center',
          }}
        />
      ))}

      {/* Subtle nebula */}
      <div className="absolute top-[20%] left-[10%] h-60 w-80 opacity-8"
        style={{
          background: 'radial-gradient(ellipse, rgba(100, 100, 180, 0.15), transparent 70%)',
          animation: 'nebulaFloat 12s ease-in-out infinite alternate',
        }}
      />

      <style>{`
        @keyframes moonGlow {
          0%, 100% { opacity: 0.35; box-shadow: 0 0 50px rgba(200, 200, 230, 0.2); }
          50% { opacity: 0.45; box-shadow: 0 0 70px rgba(200, 200, 230, 0.3); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }
        @keyframes shootingStar {
          0% { transform: translateX(0) translateY(0) scaleX(0); opacity: 0; }
          10% { opacity: 1; scaleX: 1; }
          100% { transform: translateX(200px) translateY(80px) scaleX(1.5); opacity: 0; }
        }
        @keyframes nebulaFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(20px, -10px) scale(1.1); }
        }
      `}</style>
    </>
  );
};
