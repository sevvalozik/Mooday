import { useMemo, useEffect, useState } from 'react';

const SKY_CONFIGS = {
  happiness: {
    sky: 'linear-gradient(to bottom, #87CEEB 0%, #B0E0FF 30%, #E8F4FD 60%, #f8fafc 100%)',
    clouds: true,
    cloudColor: 'rgba(255,255,255,0.9)',
    particles: { color: 'rgba(255,215,0,0.4)', glow: 'rgba(255,200,0,0.2)', count: 15 },
    warmWash: 'radial-gradient(ellipse at 70% 10%, rgba(255,220,80,0.2), transparent 60%)',
  },
  sadness: {
    sky: 'linear-gradient(to bottom, #9EAFC2 0%, #B8C6D4 25%, #D0D8E0 50%, #E8ECF0 80%, #f0f2f5 100%)',
    clouds: true,
    cloudColor: 'rgba(180,190,200,0.7)',
    rain: true,
    particles: null,
    warmWash: null,
  },
  anger: {
    sky: 'linear-gradient(to bottom, #8B7088 0%, #A08898 20%, #C4A0AA 45%, #E8D0D0 75%, #f5eaec 100%)',
    clouds: true,
    cloudColor: 'rgba(120,90,100,0.4)',
    particles: { color: 'rgba(220,20,60,0.15)', glow: 'rgba(200,0,0,0.08)', count: 10 },
    warmWash: 'radial-gradient(ellipse at 30% 20%, rgba(200,50,50,0.08), transparent 50%)',
  },
  calm: {
    sky: 'linear-gradient(to bottom, #90C8E8 0%, #A8D8EA 25%, #C8E6F0 50%, #E4F2F8 80%, #f5fafe 100%)',
    clouds: true,
    cloudColor: 'rgba(255,255,255,0.85)',
    particles: { color: 'rgba(46,139,87,0.25)', glow: 'rgba(46,139,87,0.12)', count: 12 },
    warmWash: 'radial-gradient(ellipse at 50% 60%, rgba(46,139,87,0.06), transparent 55%)',
  },
  excitement: {
    sky: 'linear-gradient(to bottom, #80B8F0 0%, #A0C8FF 20%, #D0E0FF 50%, #F0E8FF 80%, #faf8ff 100%)',
    clouds: false,
    particles: { color: 'rgba(255,140,0,0.35)', glow: 'rgba(255,100,0,0.15)', count: 25 },
    warmWash: 'radial-gradient(ellipse at 50% 40%, rgba(255,140,0,0.1), transparent 55%)',
    sparkles: true,
  },
  anxiety: {
    sky: 'linear-gradient(to bottom, #A0A0B8 0%, #B0B0C4 25%, #C8C8D4 50%, #E0E0E8 80%, #f0f0f4 100%)',
    clouds: true,
    cloudColor: 'rgba(140,140,160,0.5)',
    particles: { color: 'rgba(139,0,139,0.2)', glow: 'rgba(139,0,139,0.08)', count: 18 },
    warmWash: null,
    haze: true,
  },
  tired: {
    sky: 'linear-gradient(to bottom, #C4A8D0 0%, #D4B8D8 15%, #E0C8D8 35%, #ECD8E0 55%, #F4E8EE 80%, #faf5f8 100%)',
    clouds: true,
    cloudColor: 'rgba(200,180,210,0.5)',
    particles: { color: 'rgba(112,128,144,0.2)', glow: 'rgba(100,100,140,0.08)', count: 8 },
    warmWash: 'radial-gradient(ellipse at 80% 15%, rgba(200,160,220,0.12), transparent 50%)',
  },
  hopeful: {
    sky: 'linear-gradient(to bottom, #FDCB82 0%, #F8D8A0 15%, #FAE0B8 30%, #FCE8D0 50%, #FDF2E8 75%, #fefaf5 100%)',
    clouds: true,
    cloudColor: 'rgba(255,240,220,0.8)',
    particles: { color: 'rgba(255,105,180,0.25)', glow: 'rgba(255,105,180,0.1)', count: 14 },
    warmWash: 'radial-gradient(ellipse at 30% 20%, rgba(255,180,100,0.15), transparent 55%)',
  },
};

const Clouds = ({ color = 'rgba(255,255,255,0.9)', count = 6 }) => {
  const clouds = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      top: `${5 + Math.random() * 35}%`,
      width: 120 + Math.random() * 200,
      height: 40 + Math.random() * 50,
      delay: `${i * -8 + Math.random() * -5}s`,
      duration: `${40 + Math.random() * 30}s`,
      opacity: 0.5 + Math.random() * 0.5,
    })), [count]);

  return (
    <>
      {clouds.map((c) => (
        <div
          key={c.id}
          className="absolute rounded-full"
          style={{
            top: c.top,
            width: c.width,
            height: c.height,
            background: `radial-gradient(ellipse, ${color}, transparent 70%)`,
            opacity: c.opacity,
            animation: `cloudDrift ${c.duration} linear ${c.delay} infinite`,
          }}
        />
      ))}
    </>
  );
};

const LightRain = () => {
  const drops = useMemo(() =>
    Array.from({ length: 180 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.5}s`,
      duration: `${0.5 + Math.random() * 0.4}s`,
      opacity: 0.45 + Math.random() * 0.4,
      width: Math.random() > 0.5 ? 2 : 1,
    })), []);

  return drops.map((d) => (
    <div
      key={d.id}
      className="absolute top-0"
      style={{
        left: d.left,
        width: d.width,
        height: '10%',
        opacity: d.opacity,
        background: 'linear-gradient(to bottom, transparent, rgba(80,110,180,0.8), rgba(60,90,160,0.6), transparent)',
        animation: `lightRain ${d.duration} linear ${d.delay} infinite`,
      }}
    />
  ));
};

const FloatingParticles = ({ color, glow, count }) => {
  const items = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      top: `${10 + Math.random() * 70}%`,
      size: 3 + Math.random() * 5,
      delay: `${Math.random() * 8}s`,
      duration: `${4 + Math.random() * 5}s`,
    })), [count]);

  return items.map((p) => (
    <div
      key={p.id}
      className="absolute rounded-full"
      style={{
        left: p.left,
        top: p.top,
        width: p.size,
        height: p.size,
        background: `radial-gradient(circle, ${color}, transparent)`,
        boxShadow: `0 0 ${p.size + 4}px ${glow}`,
        animation: `lightFloat ${p.duration} ease-in-out ${p.delay} infinite`,
      }}
    />
  ));
};

const Sparkles = () => {
  const items = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60}%`,
      size: 2 + Math.random() * 3,
      delay: `${Math.random() * 5}s`,
      duration: `${1.5 + Math.random() * 2}s`,
      color: ['rgba(255,140,0,0.5)', 'rgba(255,69,0,0.4)', 'rgba(255,215,0,0.5)', 'rgba(255,20,147,0.3)'][Math.floor(Math.random() * 4)],
    })), []);

  return items.map((s) => (
    <div
      key={s.id}
      className="absolute rounded-full"
      style={{
        left: s.left,
        top: s.top,
        width: s.size,
        height: s.size,
        background: `radial-gradient(circle, ${s.color}, transparent)`,
        animation: `lightSparkle ${s.duration} ease-in-out ${s.delay} infinite`,
      }}
    />
  ));
};

const HazeOverlay = () => (
  <div className="absolute inset-0" style={{
    background: 'radial-gradient(ellipse at 50% 50%, rgba(140,140,170,0.08), transparent 60%)',
    animation: 'hazeShift 6s ease-in-out infinite alternate',
  }} />
);

const LightningBolts = () => {
  const [flashes, setFlashes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        const id = Date.now();
        const left = 10 + Math.random() * 80;
        setFlashes((prev) => [...prev, { id, left }]);
        setTimeout(() => {
          setFlashes((prev) => [...prev, { id: id + 1, left: left + (Math.random() - 0.5) * 10 }]);
        }, 80 + Math.random() * 80);
        setTimeout(() => {
          setFlashes((prev) => prev.filter((f) => f.id !== id && f.id !== id + 1));
        }, 350);
      }
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return flashes.map((flash) => (
    <div key={flash.id} className="absolute top-0" style={{ left: `${flash.left}%` }}>
      <div className="absolute -left-[30vw] -top-10 h-[60vh] w-[60vw]"
        style={{ background: 'radial-gradient(ellipse, rgba(180,100,120,0.25), transparent 70%)', opacity: 0.5 }}
      />
      <svg className="absolute -left-3 top-0 h-[45vh] w-8" viewBox="0 0 24 200" fill="none" style={{ opacity: 0.85 }}>
        <path
          d={`M12,0 L${8 + Math.random() * 8},40 L${14 + Math.random() * 4},38 L${6 + Math.random() * 6},90 L${15 + Math.random() * 4},85 L${4 + Math.random() * 8},150 L${10 + Math.random() * 4},145 L${6 + Math.random() * 6},200`}
          stroke="rgba(140,60,80,0.9)" strokeWidth="2" opacity="0.9"
        />
        <path
          d={`M12,0 L${8 + Math.random() * 8},40 L${14 + Math.random() * 4},38 L${6 + Math.random() * 6},90`}
          stroke="rgba(200,100,120,0.4)" strokeWidth="5" opacity="0.35"
        />
      </svg>
    </div>
  ));
};

export const LightSkyEffect = ({ emotion }) => {
  const config = SKY_CONFIGS[emotion] || SKY_CONFIGS.calm;

  return (
    <>
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{ background: config.sky }} />

      {/* Warm wash */}
      {config.warmWash && (
        <div className="absolute inset-0" style={{ background: config.warmWash }} />
      )}

      {/* Clouds */}
      {config.clouds && <Clouds color={config.cloudColor} />}

      {/* Rain for sadness */}
      {config.rain && <LightRain />}

      {/* Floating particles */}
      {config.particles && (
        <FloatingParticles
          color={config.particles.color}
          glow={config.particles.glow}
          count={config.particles.count}
        />
      )}

      {/* Sparkles for excitement */}
      {config.sparkles && <Sparkles />}

      {/* Haze for anxiety */}
      {config.haze && <HazeOverlay />}

      {/* Lightning for anger */}
      {emotion === 'anger' && <LightningBolts />}

      <style>{`
        @keyframes cloudDrift {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(calc(100vw + 120%)); }
        }
        @keyframes lightRain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1200%); }
        }
        @keyframes lightFloat {
          0%, 100% { opacity: 0.2; transform: translateY(0) scale(0.8); }
          50% { opacity: 0.7; transform: translateY(-20px) scale(1.2); }
        }
        @keyframes lightSparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 0.9; transform: scale(1.3) rotate(180deg); }
        }
        @keyframes hazeShift {
          0% { transform: translateX(-3%) scale(1); opacity: 0.6; }
          100% { transform: translateX(3%) scale(1.05); opacity: 1; }
        }
      `}</style>
    </>
  );
};
