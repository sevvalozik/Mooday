import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { MoodSphereCore } from './MoodSphereCore.jsx';
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

const FriendOrb = ({ friend, planetIndex, orbitRadius, onClick }) => {
  const groupRef = useRef();
  const emotion = friend.latestMood?.emotion || 'calm';
  const orbitSpeed = 0.12 - planetIndex * 0.01;
  const startAngle = (planetIndex / 8) * Math.PI * 2;

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      const angle = startAngle + t * orbitSpeed;
      groupRef.current.position.x = Math.cos(angle) * orbitRadius;
      groupRef.current.position.z = Math.sin(angle) * orbitRadius;
      groupRef.current.position.y = Math.sin(t * 0.3 + planetIndex) * 0.15;
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
  const sunRef = useRef();

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#FFD700" distance={25} decay={2} />
      <pointLight position={[10, 5, 10]} intensity={0.2} />

      <Stars radius={50} depth={50} count={3000} factor={3} saturation={0.5} fade speed={0.5} />

      {/* User sphere as "sun" */}
      <group ref={sunRef}>
        <MoodSphereCore
          emotion={userMood?.emotion || 'calm'}
          intensity={userMood?.intensity || 5}
          size={0.9}
        />
      </group>

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

      <EffectComposer>
        <Bloom luminanceThreshold={0.4} intensity={0.8} radius={0.6} />
      </EffectComposer>
    </>
  );
};

export const FriendGalaxy = ({ friends = [], userMood }) => {
  const navigate = useNavigate();

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden">
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
