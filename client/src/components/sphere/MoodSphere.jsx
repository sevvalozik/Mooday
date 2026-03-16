import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { MoodSphereCore } from './MoodSphereCore.jsx';
import { OrbitalParticles } from './OrbitalParticles.jsx';
import { EMOTIONS } from '../../utils/emotionConfig.js';

export const MoodSphere = ({ emotion = 'calm', intensity = 5, size = 'large', interactive = true, style = 'default' }) => {
  const config = EMOTIONS[emotion] || EMOTIONS.calm;
  const sphereSize = size === 'large' ? 1 : size === 'medium' ? 0.6 : 0.35;
  const particleCount = size === 'large' ? 200 : size === 'medium' ? 100 : 50;

  // Smooth style transition — no remount, just crossfade
  const [activeStyle, setActiveStyle] = useState(style);
  const [opacity, setOpacity] = useState(1);
  const timerRef = useRef(null);

  useEffect(() => {
    if (style !== activeStyle) {
      // Fade out
      setOpacity(0);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setActiveStyle(style);
        // Fade back in
        requestAnimationFrame(() => setOpacity(1));
      }, 250);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [style, activeStyle]);

  const isCrystal = activeStyle === 'crystal';

  return (
    <div
      className={`${size === 'large' ? 'h-80 w-80' : size === 'medium' ? 'h-48 w-48' : 'h-24 w-24'}`}
      style={{ opacity, transition: 'opacity 0.3s ease-in-out' }}
    >
      <Canvas camera={{ position: [0, 0, size === 'large' ? 4 : 3], fov: 45 }} gl={{ alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={isCrystal ? 0.4 : 0.2} />
          <pointLight position={[10, 10, 10]} intensity={isCrystal ? 0.8 : 0.6} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={0.2} color={config.color} />
          {isCrystal && <pointLight position={[-5, 8, 5]} intensity={0.3} color="#ffffff" />}

          <MoodSphereCore emotion={emotion} intensity={intensity} size={sphereSize} style={activeStyle} />
          <OrbitalParticles emotion={emotion} count={particleCount} />

          {interactive && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
          )}

          {!isCrystal && (
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.4}
                luminanceSmoothing={0.9}
                intensity={0.5}
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
