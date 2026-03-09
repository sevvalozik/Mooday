import { Suspense, useState, useEffect } from 'react';
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

  // Fade transition state to prevent flash/blink when switching styles
  const [visible, setVisible] = useState(true);
  const [activeStyle, setActiveStyle] = useState(style);

  useEffect(() => {
    if (style !== activeStyle) {
      setVisible(false);
      const timer = setTimeout(() => {
        setActiveStyle(style);
        setVisible(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [style, activeStyle]);

  // Adjust bloom per style — crystal needs much less bloom
  const bloomIntensity = style === 'crystal' ? 0.15 : 0.5;

  return (
    <div className={`${size === 'large' ? 'h-80 w-80' : size === 'medium' ? 'h-48 w-48' : 'h-24 w-24'} transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <Canvas camera={{ position: [0, 0, size === 'large' ? 4 : 3], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={0.2} color={config.color} />

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

          <EffectComposer>
            <Bloom
              luminanceThreshold={0.4}
              luminanceSmoothing={0.9}
              intensity={bloomIntensity}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};
