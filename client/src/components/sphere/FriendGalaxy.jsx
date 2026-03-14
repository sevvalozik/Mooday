import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetSphere } from './PlanetSphere.jsx';
import { useNavigate } from 'react-router-dom';
import { EMOTIONS } from '../../utils/emotionConfig.js';

const OrbitRing = ({ radius, opacity = 0.08 }) => {
  const geometry = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={opacity} />
    </line>
  );
};

/* Simple glowing sun sphere — no shader displacement, no jitter */
const SunSphere = ({ emotion = 'calm' }) => {
  const meshRef = useRef();
  const glowRef = useRef();
  const config = EMOTIONS[emotion] || EMOTIONS.calm;
  const color = new THREE.Color(config.color);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
    if (glowRef.current) {
      // Very gentle breathing glow
      const pulse = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1 + 0.9;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.85, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

const FriendOrb = ({ friend, planetIndex, orbitRadius, onClick }) => {
  const groupRef = useRef();
  const emotion = friend.latestMood?.emotion || 'calm';
  const orbitSpeed = 0.08 - planetIndex * 0.008;
  const startAngle = (planetIndex / 8) * Math.PI * 2;

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      const angle = startAngle + t * orbitSpeed;
      groupRef.current.position.x = Math.cos(angle) * orbitRadius;
      groupRef.current.position.z = Math.sin(angle) * orbitRadius;
      // No y-axis bobbing — keeps planets stable
      groupRef.current.position.y = 0;
    }
  });

  const emotionConfig = EMOTIONS[emotion] || EMOTIONS.calm;

  return (
    <group ref={groupRef} onClick={onClick}>
      <PlanetSphere emotion={emotion} size={0.4} planetIndex={planetIndex} />
      <Text
        position={[0, -0.65, 0]}
        fontSize={0.13}
        color="white"
        anchorX="center"
        anchorY="top"
        outlineWidth={0.015}
        outlineColor="#000000"
      >
        {friend.displayName || `@${friend.username}`}
      </Text>
      <Text
        position={[0, -0.85, 0]}
        fontSize={0.09}
        color={emotionConfig.color}
        anchorX="center"
        anchorY="top"
      >
        {emotionConfig.icon} {emotionConfig.label}
      </Text>
    </group>
  );
};

const GalaxyScene = ({ friends, onFriendClick, userMood }) => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#FFD700" distance={25} decay={2} />
      <pointLight position={[10, 5, 10]} intensity={0.3} />

      <Stars radius={50} depth={50} count={3000} factor={3} saturation={0.5} fade speed={0.3} />

      {/* User sphere as "sun" — simple glowing sphere, no shader jitter */}
      <SunSphere emotion={userMood?.emotion || 'calm'} />

      {/* Orbit rings */}
      {friends.map((_, i) => (
        <OrbitRing key={`ring-${i}`} radius={2.5 + i * 1.2} opacity={0.04 + i * 0.008} />
      ))}

      {/* Friend planets */}
      {friends.map((friend, i) => (
        <FriendOrb
          key={friend.id}
          friend={friend}
          orbitRadius={2.5 + i * 1.2}
          planetIndex={i}
          onClick={() => onFriendClick(friend.id)}
        />
      ))}

      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.15}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
      />

      {/* No Bloom / EffectComposer — removed to eliminate jitter */}
    </>
  );
};

export const FriendGalaxy = ({ friends = [], userMood }) => {
  const navigate = useNavigate();

  return (
    <div className="h-[320px] sm:h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 4, 8], fov: 50 }}>
        <Suspense fallback={null}>
          <GalaxyScene
            friends={friends}
            onFriendClick={(id) => navigate(`/friends/${id}`)}
            userMood={userMood}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
