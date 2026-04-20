import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetSphere } from './PlanetSphere.jsx';
import { MoodSphereCore } from './MoodSphereCore.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.js';
import { EMOTIONS } from '../../utils/emotionConfig.js';

const useTheme = () => {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return theme;
};

const OrbitRing = ({ radius, opacity = 0.08, color = '#ffffff' }) => {
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
      <lineBasicMaterial color={color} transparent opacity={opacity} />
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

const GalaxyScene = ({ friends, onFriendClick, userMood, sphereStyle, isLight }) => {
  return (
    <>
      <ambientLight intensity={isLight ? 1.2 : 0.4} />
      <pointLight position={[0, 0, 0]} intensity={isLight ? 2.0 : 1.5} color={isLight ? '#ffffff' : '#FFD700'} distance={25} decay={2} />
      <pointLight position={[10, 5, 10]} intensity={isLight ? 0.8 : 0.3} />

      {!isLight && <Stars radius={50} depth={50} count={3000} factor={3} saturation={0.5} fade speed={0.3} />}

      {/* User sphere as "sun" — uses selected sphere style */}
      <MoodSphereCore
        emotion={userMood?.emotion || 'calm'}
        intensity={userMood?.intensity || 5}
        size={0.85}
        style={sphereStyle || 'default'}
      />

      {/* Orbit rings */}
      {friends.map((_, i) => (
        <OrbitRing key={`ring-${i}`} radius={2.5 + i * 1.2} opacity={isLight ? 0.55 : 0.45} color={isLight ? '#1d4ed8' : '#a5b4fc'} />
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
  const sphereStyle = useAuthStore((s) => s.sphereStyle);
  const theme = useTheme();
  const isLight = theme === 'light';

  const wrapperBg = isLight
    ? 'linear-gradient(to bottom, #4A90D9 0%, #74B3E8 20%, #A8D0F0 45%, #C8E4F8 70%, #E0F0FC 100%)'
    : '#050810';

  return (
    <div
      className="h-[320px] sm:h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden relative"
      style={{ background: wrapperBg }}
    >
      {/* Gündüz gökyüzü elementleri */}
      {isLight && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          {/* Güneş */}
          <div className="absolute" style={{
            top: '-20px', right: '10%',
            width: '90px', height: '90px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,240,100,1) 0%, rgba(255,210,50,0.8) 40%, rgba(255,180,0,0.2) 70%, transparent 85%)',
            boxShadow: '0 0 40px rgba(255,220,50,0.5)',
            animation: 'sunPulse 4s ease-in-out infinite',
          }} />
          {/* Güneş ışınları */}
          <div className="absolute" style={{
            top: '-40px', right: '6%',
            width: '160px', height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,220,80,0.15) 0%, transparent 70%)',
          }} />
          {/* Büyük bulut 1 */}
          <div className="absolute" style={{
            top: '12%', left: '-5%',
            width: '200px', height: '60px',
            borderRadius: '50px',
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 4px 20px rgba(255,255,255,0.4)',
            animation: 'cloudMove1 35s linear infinite',
          }} />
          <div className="absolute" style={{
            top: '6%', left: '2%',
            width: '120px', height: '50px',
            borderRadius: '50px',
            background: 'rgba(255,255,255,0.75)',
            animation: 'cloudMove1 35s linear infinite',
          }} />
          {/* Büyük bulut 2 */}
          <div className="absolute" style={{
            top: '8%', left: '30%',
            width: '160px', height: '50px',
            borderRadius: '50px',
            background: 'rgba(255,255,255,0.80)',
            animation: 'cloudMove2 45s linear infinite',
          }} />
          <div className="absolute" style={{
            top: '3%', left: '36%',
            width: '100px', height: '45px',
            borderRadius: '50px',
            background: 'rgba(255,255,255,0.70)',
            animation: 'cloudMove2 45s linear infinite',
          }} />
          {/* Küçük bulut */}
          <div className="absolute" style={{
            top: '5%', right: '30%',
            width: '100px', height: '35px',
            borderRadius: '50px',
            background: 'rgba(255,255,255,0.65)',
            animation: 'cloudMove3 28s linear infinite',
          }} />
          {/* Kuşlar */}
          <div className="absolute" style={{
            top: '18%', left: '20%',
            fontSize: '12px', opacity: 0.5,
            animation: 'birdFly 20s linear infinite',
          }}>〜〜〜</div>
          <div className="absolute" style={{
            top: '25%', left: '60%',
            fontSize: '10px', opacity: 0.35,
            animation: 'birdFly 28s linear 5s infinite',
          }}>〜〜</div>
          <style>{`
            @keyframes sunPulse {
              0%,100% { transform: scale(1); opacity:1; }
              50% { transform: scale(1.06); opacity:0.9; }
            }
            @keyframes cloudMove1 {
              0% { transform: translateX(-120%); }
              100% { transform: translateX(120vw); }
            }
            @keyframes cloudMove2 {
              0% { transform: translateX(-80%); }
              100% { transform: translateX(120vw); }
            }
            @keyframes cloudMove3 {
              0% { transform: translateX(120vw); }
              100% { transform: translateX(-200px); }
            }
            @keyframes birdFly {
              0% { transform: translateX(-60px); opacity:0; }
              10% { opacity:0.5; }
              90% { opacity:0.4; }
              100% { transform: translateX(120vw); opacity:0; }
            }
          `}</style>
        </div>
      )}
      <Canvas
        camera={{ position: [0, 4, 8], fov: 50 }}
        gl={{ alpha: true }}
        style={{ background: 'transparent', position: 'relative', zIndex: 2 }}
      >
        <Suspense fallback={null}>
          <GalaxyScene
            friends={friends}
            onFriendClick={(id) => navigate(`/friends/${id}`)}
            userMood={userMood}
            sphereStyle={sphereStyle}
            isLight={isLight}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
