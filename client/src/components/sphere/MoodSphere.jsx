import { Suspense } from 'react';
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

  // Adjust bloom per style — crystal needs much less bloom
  const bloomIntensity = style === 'wireframe' ? 0.6 : style === 'nebula' ? 0.5 : style === 'crystal' ? 0.15 : 0.5;

  return (
    <div className={`${size === 'large' ? 'h-80 w-80' : size === 'medium' ? 'h-48 w-48' : 'h-24 w-24'}`}>
      <Canvas camera={{ position: [0, 0, size === 'large' ? 4 : 3], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />
          <pointLight position={[-10, -10, -5]} intensity={0.2} color={config.color} />

          <MoodSphereCore emotion={emotion} intensity={intensity} size={sphereSize} style={style} />
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
