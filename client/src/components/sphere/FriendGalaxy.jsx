import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { MoodSphereCore } from './MoodSphereCore.jsx';
import { useNavigate } from 'react-router-dom';

const FriendOrb = ({ friend, position, onClick }) => {
  const groupRef = useRef();
  const emotion = friend.latestMood?.emotion || 'calm';
  const intensity = friend.latestMood?.intensity || 5;

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      <MoodSphereCore emotion={emotion} intensity={intensity} size={0.35} />
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="top"
        font={undefined}
      >
        @{friend.username}
      </Text>
    </group>
  );
};

const GalaxyScene = ({ friends, onFriendClick, userMood }) => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />

      {/* User sphere at center */}
      <MoodSphereCore
        emotion={userMood?.emotion || 'calm'}
        intensity={userMood?.intensity || 5}
        size={0.8}
      />

      {/* Friend orbs in orbit */}
      {friends.map((friend, index) => {
        const angle = (index / friends.length) * Math.PI * 2;
        const radius = 3 + (index % 2) * 0.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (index % 3 - 1) * 0.5;

        return (
          <FriendOrb
            key={friend.id}
            friend={friend}
            position={[x, y, z]}
            onClick={() => onFriendClick(friend.id)}
          />
        );
      })}

      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.3}
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.5} intensity={1.0} />
      </EffectComposer>
    </>
  );
};

export const FriendGalaxy = ({ friends = [], userMood }) => {
  const navigate = useNavigate();

  const handleFriendClick = (friendId) => {
    navigate(`/friends/${friendId}`);
  };

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <Suspense fallback={null}>
          <GalaxyScene
            friends={friends}
            onFriendClick={handleFriendClick}
            userMood={userMood}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
