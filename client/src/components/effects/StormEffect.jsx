import { useEffect, useState } from 'react';

export const StormEffect = () => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setFlash(true);
        setTimeout(() => setFlash(false), 150);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-gray-950 to-gray-950" />
      <div
        className={`absolute inset-0 transition-opacity duration-100 ${flash ? 'opacity-10' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent 60%)' }}
      />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(220, 20, 60, 0.3), transparent 60%)',
          animation: 'stormDrift 8s ease-in-out infinite alternate',
        }}
      />
      <style>{`
        @keyframes stormDrift {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(5%) translateY(3%); }
        }
      `}</style>
    </>
  );
};
