export const SunEffect = () => {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/10 via-gray-950 to-gray-950" />
      <div
        className="absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #FFD700 0%, #FF8C00 40%, transparent 70%)',
          animation: 'sunPulse 4s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-40 opacity-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(255, 215, 0, 0.3), transparent)',
        }}
      />
      <style>{`
        @keyframes sunPulse {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.15; }
          50% { transform: translateX(-50%) scale(1.15); opacity: 0.25; }
        }
      `}</style>
    </>
  );
};
