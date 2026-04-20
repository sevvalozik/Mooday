import { useEffect, useState, useMemo } from 'react';

export const StormEffect = () => {
  const [flashes, setFlashes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.2) {
        const id = Date.now();
        const left = 10 + Math.random() * 80;
        setFlashes((prev) => [...prev, { id, left }]);
        setTimeout(() => {
          setFlashes((prev) => [...prev, { id: id + 1, left: left + (Math.random() - 0.5) * 10 }]);
        }, 80 + Math.random() * 80);
        setTimeout(() => {
          setFlashes((prev) => prev.filter((f) => f.id !== id && f.id !== id + 1));
        }, 600);
      }
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const rainDrops = useMemo(() =>
    Array.from({ length: 150 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1}s`,
      duration: `${0.25 + Math.random() * 0.25}s`,
      opacity: 0.2 + Math.random() * 0.35,
      width: Math.random() > 0.6 ? 2 : 1,
    })), []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-gray-950 to-gray-950" />

      {/* Storm clouds */}
      <div className="absolute inset-x-0 top-0 h-72 opacity-50"
        style={{
          background: 'radial-gradient(ellipse at 30% 0%, rgba(120, 0, 0, 0.6) 0%, transparent 55%), radial-gradient(ellipse at 70% 10%, rgba(100, 0, 20, 0.5) 0%, transparent 45%), radial-gradient(ellipse at 50% 5%, rgba(60, 0, 0, 0.4) 0%, transparent 60%)',
          animation: 'stormClouds 5s ease-in-out infinite alternate',
        }}
      />

      {/* Lightning flashes */}
      {flashes.map((flash) => (
        <div key={flash.id} className="absolute top-0" style={{ left: `${flash.left}%` }}>
          <div className="absolute -left-[30vw] -top-10 h-[60vh] w-[60vw] opacity-50"
            style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.95), transparent 70%)' }}
          />
          <svg className="absolute -left-3 top-0 h-[55vh] w-10" viewBox="0 0 24 200" fill="none" style={{ opacity: 1 }}>
            <path
              d={`M12,0 L${8 + Math.random() * 8},40 L${14 + Math.random() * 4},38 L${6 + Math.random() * 6},90 L${15 + Math.random() * 4},85 L${4 + Math.random() * 8},150 L${10 + Math.random() * 4},145 L${6 + Math.random() * 6},200`}
              stroke="white" strokeWidth="3" opacity="1"
            />
            <path
              d={`M12,0 L${8 + Math.random() * 8},40 L${14 + Math.random() * 4},38 L${6 + Math.random() * 6},90 L${15 + Math.random() * 4},85 L${4 + Math.random() * 8},150`}
              stroke="rgba(255,220,220,0.7)" strokeWidth="8" opacity="0.6"
            />
          </svg>
        </div>
      ))}

      {/* Rain */}
      {rainDrops.map((drop) => (
        <div
          key={drop.id}
          className="absolute top-0 bg-gradient-to-b from-transparent via-red-300/30 to-transparent"
          style={{
            left: drop.left,
            height: '14%',
            width: drop.width,
            opacity: drop.opacity,
            animation: `stormRain ${drop.duration} linear ${drop.delay} infinite`,
          }}
        />
      ))}

      {/* Red ambient glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 opacity-20"
        style={{ background: 'linear-gradient(to top, rgba(180, 0, 0, 0.4), transparent)' }}
      />

      <style>{`
        @keyframes stormClouds {
          0% { transform: translateX(-2%) scale(1); }
          100% { transform: translateX(2%) scale(1.05); }
        }
        @keyframes stormRain {
          0% { transform: translateY(-100%) skewX(-8deg); }
          100% { transform: translateY(900%) skewX(-8deg); }
        }
      `}</style>
    </>
  );
};
