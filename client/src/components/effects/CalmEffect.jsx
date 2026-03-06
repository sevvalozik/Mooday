import { useMemo } from 'react';

export const CalmEffect = () => {
  const leaves = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 3 + Math.random() * 4,
      delay: `${Math.random() * 10}s`,
      duration: `${8 + Math.random() * 6}s`,
      opacity: 0.1 + Math.random() * 0.15,
    }));
  }, []);

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/10 to-gray-950" />
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute rounded-full"
          style={{
            left: leaf.left,
            bottom: '-5%',
            width: leaf.size,
            height: leaf.size,
            backgroundColor: '#2E8B57',
            opacity: leaf.opacity,
            animation: `float ${leaf.duration} ease-in-out ${leaf.delay} infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.15; }
          90% { opacity: 0.15; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
      `}</style>
    </>
  );
};
