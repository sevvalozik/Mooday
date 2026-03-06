import { useMemo } from 'react';

export const RainEffect = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${0.5 + Math.random() * 0.5}s`,
      opacity: 0.1 + Math.random() * 0.3,
    }));
  }, []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-gray-950" />
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute top-0 w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
          style={{
            left: drop.left,
            height: '15%',
            opacity: drop.opacity,
            animation: `rain ${drop.duration} linear ${drop.delay} infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes rain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(800%); }
        }
      `}</style>
    </>
  );
};
