import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader } from './shaders/vertexShader.js';
import { fragmentShader } from './shaders/fragmentShader.js';
import { crystalVertexShader, crystalFragmentShader } from './shaders/crystalShaders.js';
import { nebulaVertexShader, nebulaFragmentShader } from './shaders/nebulaShaders.js';
import { wireframeVertexShader, wireframeFragmentShader } from './shaders/wireframeShaders.js';
import { getEmotionColors, EMOTIONS } from '../../utils/emotionConfig.js';

const SHADER_MAP = {
  default: { vertex: vertexShader, fragment: fragmentShader, transparent: false },
  crystal: { vertex: crystalVertexShader, fragment: crystalFragmentShader, transparent: true },
  nebula: { vertex: nebulaVertexShader, fragment: nebulaFragmentShader, transparent: false },
  wireframe: { vertex: wireframeVertexShader, fragment: wireframeFragmentShader, transparent: true },
};

const SphereInner = ({ emotion, intensity, size, style }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  const config = EMOTIONS[emotion] || EMOTIONS.calm;
  const colors = getEmotionColors(emotion);
  const shaders = SHADER_MAP[style] || SHADER_MAP.default;

  const uniforms = useMemo(
    () => ({
      uTime: { value: performance.now() / 1000 },
      uColorA: { value: new THREE.Vector3(...colors.colorA) },
      uColorB: { value: new THREE.Vector3(...colors.colorB) },
      uArousal: { value: config.arousal },
      uIntensity: { value: intensity / 10 },
      uValence: { value: config.valence },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [style]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;

      const target = getEmotionColors(emotion);
      const currentA = materialRef.current.uniforms.uColorA.value;
      const currentB = materialRef.current.uniforms.uColorB.value;

      currentA.x += (target.colorA[0] - currentA.x) * 0.02;
      currentA.y += (target.colorA[1] - currentA.y) * 0.02;
      currentA.z += (target.colorA[2] - currentA.z) * 0.02;

      currentB.x += (target.colorB[0] - currentB.x) * 0.02;
      currentB.y += (target.colorB[1] - currentB.y) * 0.02;
      currentB.z += (target.colorB[2] - currentB.z) * 0.02;

      const targetArousal = (EMOTIONS[emotion] || EMOTIONS.calm).arousal;
      const targetValence = (EMOTIONS[emotion] || EMOTIONS.calm).valence;
      materialRef.current.uniforms.uArousal.value +=
        (targetArousal - materialRef.current.uniforms.uArousal.value) * 0.02;
      materialRef.current.uniforms.uIntensity.value +=
        (intensity / 10 - materialRef.current.uniforms.uIntensity.value) * 0.02;
      materialRef.current.uniforms.uValence.value +=
        (targetValence - materialRef.current.uniforms.uValence.value) * 0.02;
    }

    if (meshRef.current) {
      const baseSpeed = style === 'crystal' ? 0.001 : style === 'wireframe' ? 0.004 : 0.002;
      meshRef.current.rotation.y += baseSpeed + config.arousal * 0.005;
    }
  });

  const segments = style === 'wireframe' ? 32 : 128;

  return (
    <mesh ref={meshRef} scale={size}>
      <sphereGeometry args={[1, segments, segments]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={shaders.vertex}
        fragmentShader={shaders.fragment}
        uniforms={uniforms}
        transparent={shaders.transparent}
        side={style === 'wireframe' ? THREE.DoubleSide : THREE.FrontSide}
      />
    </mesh>
  );
};

export const MoodSphereCore = ({ emotion = 'calm', intensity = 5, size = 1, style = 'default' }) => {
  return <SphereInner emotion={emotion} intensity={intensity} size={size} style={style} />;
};
