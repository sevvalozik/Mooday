import { useEffect, useState, useMemo } from 'react';

export const StormEffect = () => {
  const [flashes, setFlashes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const id = Date.now();
        const left = 10 + Math.random() * 80;
        setFlashes((prev) => [...prev, { id, left }]);
        setTimeout(() => {
          setFlashes((prev) => [...prev, { id: id + 1, left: left + (Math.random() - 0.5) * 10 }]);
        }, 100 + Math.random() * 100);
        setTimeout(() => {
          setFlashes((prev) => prev.filter((f) => f.id !== id && f.id !== id + 1));
        }, 500);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const rainDrops = useMemo(() =>
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1}s`,
      duration: `${0.3 + Math.random() * 0.3}s`,
      opacity: 0.15 + Math.random() * 0.25,
      width: Math.random() > 0.7 ? 2 : 1,
    })), []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-gray-950 to-gray-950" />

      <div className="absolute inset-x-0 top-0 h-60 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 30% 0%, rgba(100, 0, 0, 0.5) 0%, transparent 60%), radial-gradient(ellipse at 70% 10%, rgba(80, 0, 20, 0.4) 0%, transparent 50%)',
          animation: 'stormClouds 6s ease-in-out infinite alternate',
        }}
      />

      {flashes.map((flash) => (
        <div key={flash.id} className="absolute top-0" style={{ left: `${flash.left}%` }}>
          <div className="absolute -left-[30vw] -top-10 h-[60vh] w-[60vw] opacity-20"
            style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.8), transparent 70%)' }}
          />
          <svg className="absolute -left-3 top-0 h-[40vh] w-6 opacity-90" viewBox="0 0 24 200" fill="none">
            <path
              d={`M12,0 L${8 + Math.random() * 8},40 L${14 + Math.random() * 4},38 L${6 + Math.random() * 6},90 L${15 + Math.random() * 4},85 L${4 + Math.random() * 8},150`}
              stroke="white" strokeWidth="2" opacity="0.9"
            />
          </svg>
        </div>
      ))}

      {rainDrops.map((drop) => (
        <div
          key={drop.id}
          className="absolute top-0 bg-gradient-to-b from-transparent via-red-300/20 to-transparent"
          style={{
            left: drop.left,
            height: '12%',
            width: drop.width,
            opacity: drop.opacity,
            animation: `stormRain ${drop.duration} linear ${drop.delay} infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes stormClouds {
          0% { transform: translateX(-2%) scale(1); }
          100% { transform: translateX(2%) scale(1.05); }
        }
        @keyframes stormRain {
          0% { transform: translateY(-100%) skewX(-5deg); }
          100% { transform: translateY(900%) skewX(-5deg); }
        }
      `}</style>
    </>
  );
};
