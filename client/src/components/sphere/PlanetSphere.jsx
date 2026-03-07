import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EMOTIONS } from '../../utils/emotionConfig.js';

// Planet types based on mood or index
const PLANET_TYPES = [
  'rocky',      // Mars-like, cratered
  'gas',        // Jupiter-like, banded
  'ringed',     // Saturn-like with rings
  'ice',        // Neptune-like, blue swirl
  'lava',       // Volcanic, glowing cracks
  'ocean',      // Earth-like, blue-green
  'crystal',    // Crystalline, faceted look
  'nebula',     // Gaseous, cloud-like
];

const getPlanetType = (index) => PLANET_TYPES[index % PLANET_TYPES.length];

// Simple vertex shader — no displacement, smooth planets
const planetVertex = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Different fragment shaders per planet type
const planetFragments = {
  rocky: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uColor2;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    void main() {
      vec3 light = normalize(vec3(1.0, 1.0, 0.5));
      float diffuse = max(dot(vNormal, light), 0.0);

      // Craters
      float craters = 0.0;
      for (float i = 0.0; i < 8.0; i++) {
        vec2 craterPos = vec2(hash(vec2(i, 0.0)), hash(vec2(0.0, i)));
        float dist = length(vUv - craterPos);
        craters += smoothstep(0.08, 0.03, dist) * 0.3;
      }

      vec3 surface = mix(uColor, uColor2, craters + vUv.y * 0.3);
      vec3 color = surface * (0.3 + diffuse * 0.7);
      float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
      color += uColor * fresnel * 0.2;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  gas: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uColor2;

    void main() {
      vec3 light = normalize(vec3(1.0, 1.0, 0.5));
      float diffuse = max(dot(vNormal, light), 0.0);

      // Banded atmosphere
      float bands = sin(vUv.y * 20.0 + uTime * 0.2) * 0.5 + 0.5;
      bands += sin(vUv.y * 40.0 - uTime * 0.1) * 0.2;
      float storm = sin(vUv.x * 10.0 + vUv.y * 5.0 + uTime * 0.3) * 0.15;

      vec3 surface = mix(uColor, uColor2, bands + storm);
      vec3 color = surface * (0.3 + diffuse * 0.7);
      float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
      color += mix(uColor, uColor2, 0.5) * fresnel * 0.3;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  ice: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uColor2;

    void main() {
      vec3 light = normalize(vec3(1.0, 1.0, 0.5));
      float diffuse = max(dot(vNormal, light), 0.0);

      // Swirling ice clouds
      float swirl = sin(vUv.x * 8.0 + vUv.y * 6.0 + uTime * 0.2) * 0.5 + 0.5;
      swirl += cos(vUv.x * 12.0 - vUv.y * 4.0 + uTime * 0.15) * 0.3;

      vec3 surface = mix(uColor, uColor2, swirl * 0.6);
      vec3 color = surface * (0.35 + diffuse * 0.65);
      float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
      color += vec3(0.5, 0.7, 1.0) * fresnel * 0.4;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  lava: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uColor2;

    void main() {
      vec3 light = normalize(vec3(1.0, 1.0, 0.5));
      float diffuse = max(dot(vNormal, light), 0.0);

      // Lava cracks
      float cracks = sin(vUv.x * 15.0 + uTime * 0.5) * sin(vUv.y * 15.0 + uTime * 0.3);
      cracks = smoothstep(0.3, 0.5, abs(cracks));
      float glow = 1.0 - cracks;

      vec3 rockColor = uColor2 * 0.3;
      vec3 lavaColor = uColor * 2.0;
      vec3 surface = mix(lavaColor, rockColor, cracks);
      vec3 color = surface * (0.5 + diffuse * 0.5);
      color += uColor * glow * 0.5;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  ocean: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uColor2;

    void main() {
      vec3 light = normalize(vec3(1.0, 1.0, 0.5));
      float diffuse = max(dot(vNormal, light), 0.0);

      // Continents
      float continents = sin(vUv.x * 6.0 + 1.0) * sin(vUv.y * 5.0 + 2.0);
      continents = smoothstep(0.0, 0.3, continents);
      // Clouds
      float clouds = sin(vUv.x * 10.0 + uTime * 0.1) * sin(vUv.y * 8.0 - uTime * 0.08);
      clouds = smoothstep(0.2, 0.4, clouds) * 0.3;

      vec3 oceanColor = uColor;
      vec3 landColor = uColor2;
      vec3 surface = mix(oceanColor, landColor, continents);
      surface = mix(surface, vec3(1.0), clouds);
      vec3 color = surface * (0.3 + diffuse * 0.7);
      float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
      color += vec3(0.3, 0.5, 1.0) * fresnel * 0.25;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

// Fallback for types without custom fragment
const defaultFragment = planetFragments.gas;

// Color palettes per emotion
const PLANET_COLORS = {
  happiness:  { c1: [1.0, 0.84, 0.0],  c2: [1.0, 0.55, 0.0] },
  sadness:    { c1: [0.2, 0.3, 0.8],   c2: [0.1, 0.15, 0.4] },
  anger:      { c1: [0.86, 0.08, 0.24], c2: [0.4, 0.0, 0.0] },
  calm:       { c1: [0.18, 0.55, 0.34], c2: [0.1, 0.35, 0.2] },
  excitement: { c1: [1.0, 0.55, 0.0],   c2: [1.0, 0.27, 0.0] },
  anxiety:    { c1: [0.55, 0.0, 0.55],  c2: [0.3, 0.0, 0.3] },
  tired:      { c1: [0.44, 0.5, 0.56],  c2: [0.25, 0.28, 0.32] },
  hopeful:    { c1: [1.0, 0.41, 0.71],  c2: [0.8, 0.2, 0.5] },
};

export const PlanetSphere = ({ emotion = 'calm', size = 0.35, planetIndex = 0 }) => {
  const meshRef = useRef();
  const ringRef = useRef();
  const type = getPlanetType(planetIndex);
  const colors = PLANET_COLORS[emotion] || PLANET_COLORS.calm;
  const config = EMOTIONS[emotion] || EMOTIONS.calm;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Vector3(...colors.c1) },
    uColor2: { value: new THREE.Vector3(...colors.c2) },
  }), [emotion, planetIndex]);

  const fragment = planetFragments[type] || defaultFragment;
  const hasRing = type === 'ringed' || type === 'gas';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = t;
      meshRef.current.rotation.y = t * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = -0.4;
      ringRef.current.rotation.z = t * 0.05;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} scale={size}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          vertexShader={planetVertex}
          fragmentShader={fragment}
          uniforms={uniforms}
        />
      </mesh>
      {hasRing && (
        <mesh ref={ringRef} scale={size}>
          <ringGeometry args={[1.3, 1.8, 64]} />
          <meshBasicMaterial
            color={new THREE.Color(...colors.c1)}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};
