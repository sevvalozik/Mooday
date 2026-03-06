# Mooday — Design Document

## 1. Project Vision

Mooday reimagines mood tracking as a **visual, social, and immersive experience**. Instead of picking an emoji from a dropdown, your emotional state becomes a living, breathing 3D sphere — its colors shift, its surface ripples, particles orbit around it. Your friends' spheres float in a galaxy alongside yours. Mood is not a data point; it's an experience.

**Core Philosophy:** The sphere IS the interface. Every visual detail — color, motion, distortion, glow — communicates emotion without words.

## 2. Circumplex Model of Emotion

Mooday maps emotions using Russell's Circumplex Model with two axes:

- **Valence** (X-axis): Negative ← → Positive (how pleasant the emotion is)
- **Arousal** (Y-axis): Low ← → High (how energizing the emotion is)

This maps to visuals:
- **Valence → Color**: Warm golds/pinks for positive, cool blues/purples for negative
- **Arousal → Animation**: Calm = slow, gentle motion. Excited = fast, chaotic distortion

```
          High Arousal
              ↑
    Anger ⛈️  |  Excitement ✨
    Anxiety 🌀|
              |
  ←───────────┼───────────→ Valence
   Negative   |   Positive
              |
    Sadness 🌧️|  Calm 🌿
    Tired 🌙  |  Hopeful 🌅
              ↓
          Low Arousal
```

## 3. Emotion Palette

| Emotion    | Color   | Valence | Arousal | Visual Effect                        | Icon |
|------------|---------|---------|---------|--------------------------------------|------|
| Happiness  | #FFD700 | +0.8    | 0.5     | Warm glow, gentle pulse, golden rays | ☀️   |
| Sadness    | #4169E1 | -0.7    | 0.2     | Slow ripple, rain particles, dim     | 🌧️   |
| Anger      | #DC143C | -0.8    | 0.9     | Sharp spikes, lightning, fast spin   | ⛈️   |
| Calm       | #2E8B57 | +0.5    | 0.1     | Smooth surface, floating leaves      | 🌿   |
| Excitement | #FF8C00 | +0.9    | 0.9     | Burst particles, confetti, vibrant   | ✨   |
| Anxiety    | #8B008B | -0.5    | 0.8     | Unstable wobble, swirl distortion    | 🌀   |
| Tired      | #708090 | -0.2    | 0.1     | Minimal motion, dim glow, muted      | 🌙   |
| Hopeful    | #FF69B4 | +0.6    | 0.4     | Sunrise gradient, gentle rise        | 🌅   |

## 4. Innovative Features

### Mood Constellation Galaxy
Your dashboard is a 3D galaxy. Your sphere sits at the center, friends orbit around you. Closer friends = closer orbits. Sphere colors show everyone's current mood at a glance.

### Emotional Ripple
When you log a mood, a ripple animation propagates to friends' views in real-time via WebSocket. They see your sphere transform.

### Time Capsule
Write a message to your future self tied to an emotion. It gets delivered when you log that same emotion again.

### Ambient Sounds
Each emotion has an ambient sound profile — rain for sadness, birds for calm, crackling fire for tired, upbeat tones for excitement.

### Mood Weather Report
"Today's emotional forecast: Mostly sunny with a 30% chance of anxiety." Generated from your recent mood patterns.

### Anonymous Mood Board
Groups can see aggregate mood distributions without identifying individuals — respecting privacy while building awareness.

### Emotion Journal
Optional text entry with each mood log. Private by default, shareable if desired.

## 5. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT                            │
│  React 18 + Vite                                    │
│  ┌──────────┐ ┌──────────┐ ┌───────────────┐       │
│  │ Pages    │ │ Stores   │ │ React Three   │       │
│  │ (Router) │ │ (Zustand)│ │ Fiber (3D)    │       │
│  └────┬─────┘ └────┬─────┘ └───────┬───────┘       │
│       │             │               │                │
│  ┌────┴─────────────┴───────────────┴──────┐        │
│  │         Services Layer (Axios)           │        │
│  └────┬────────────────────────┬────────────┘        │
│       │ REST                   │ WebSocket            │
└───────┼────────────────────────┼─────────────────────┘
        │                        │
┌───────┼────────────────────────┼─────────────────────┐
│       ▼          API GATEWAY   ▼                      │
│  ┌─────────┐              ┌──────────┐               │
│  │ Express │              │ Socket.io│               │
│  │ REST API│              │ Server   │               │
│  └────┬────┘              └────┬─────┘               │
│       │                        │                      │
│  ┌────┴────────────────────────┴──────┐              │
│  │        Service Layer               │              │
│  │  (Auth, Mood, Social, Insights)    │              │
│  └────┬───────────────────┬───────────┘              │
│       │                   │                           │
│  ┌────┴────┐        ┌────┴────┐                      │
│  │ Prisma  │        │  Bull   │                      │
│  │  ORM    │        │ Queue   │                      │
│  └────┬────┘        └────┬────┘                      │
│       │                  │                            │
└───────┼──────────────────┼────────────────────────────┘
        │                  │
   ┌────┴────┐       ┌────┴────┐
   │PostgreSQL│       │  Redis  │
   │   16    │       │    7    │
   └─────────┘       └─────────┘
```

## 6. API Design

### Auth (`/api/auth`)
| Method | Path       | Description              | Auth |
|--------|------------|--------------------------|------|
| POST   | /register  | Create account           | No   |
| POST   | /login     | Login, get tokens        | No   |
| POST   | /refresh   | Refresh access token     | No   |
| GET    | /me        | Get current user         | Yes  |

### Moods (`/api/moods`)
| Method | Path      | Description              | Auth |
|--------|-----------|--------------------------|------|
| POST   | /         | Log new mood             | Yes  |
| GET    | /current  | Get latest mood          | Yes  |
| GET    | /history  | Paginated mood history   | Yes  |
| GET    | /streak   | Get streak info          | Yes  |

### Friends (`/api/friends`)
| Method | Path          | Description              | Auth |
|--------|---------------|--------------------------|------|
| GET    | /             | List friends + moods     | Yes  |
| POST   | /request/:id  | Send friend request      | Yes  |
| POST   | /accept/:id   | Accept friend request    | Yes  |
| GET    | /requests     | Pending requests         | Yes  |
| DELETE | /:id          | Remove friend            | Yes  |

### Groups (`/api/groups`)
| Method | Path                | Description          | Auth |
|--------|---------------------|----------------------|------|
| POST   | /                   | Create group         | Yes  |
| GET    | /                   | List groups          | Yes  |
| GET    | /:id                | Group details        | Yes  |
| POST   | /:id/members        | Add member           | Yes  |
| DELETE | /:id/members/:userId| Remove member        | Yes  |

### Reactions (`/api/reactions`)
| Method | Path      | Description              | Auth |
|--------|-----------|--------------------------|------|
| POST   | /         | Send reaction            | Yes  |
| GET    | /received | Get received reactions   | Yes  |

### Messages (`/api/messages`)
| Method | Path        | Description              | Auth |
|--------|-------------|--------------------------|------|
| POST   | /           | Send message             | Yes  |
| GET    | /:friendId  | Get conversation         | Yes  |

### Music (`/api/music`)
| Method | Path      | Description              | Auth |
|--------|-----------|--------------------------|------|
| POST   | /         | Share a song             | Yes  |
| GET    | /received | Get received songs       | Yes  |

### Insights (`/api/insights`)
| Method | Path                  | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| GET    | /weekly               | Weekly patterns          | Yes  |
| GET    | /monthly              | Monthly summary          | Yes  |
| GET    | /compatibility/:friendId | Compatibility score   | Yes  |

## 7. Database Schema

### User
```
id          UUID     PK, default uuid
email       String   unique
username    String   unique
displayName String
passwordHash String
avatarUrl   String?
bio         String?
createdAt   DateTime default now
updatedAt   DateTime @updatedAt
```

### UserPreferences (1:1 with User)
```
id               UUID     PK
userId           UUID     unique FK → User
theme            String   default "dark"
sphereStyle      String   default "default"
backgroundStyle  String   default "particles"
chatBackground   String   default "default"
privacyLevel     String   default "friends"  (public/friends/private)
soundEnabled     Boolean  default true
notificationsOn  Boolean  default true
```

### MoodLog
```
id        UUID     PK
userId    UUID     FK → User
emotion   String   (happiness, sadness, anger, etc.)
valence   Float
arousal   Float
intensity Int      (1-10)
colorHex  String
journal   String?
createdAt DateTime default now

@@index([userId, createdAt])
```

### Streak
```
userId          UUID     PK, FK → User
currentCount    Int      default 0
longestCount    Int      default 0
lastLogDate     DateTime?
unlockedEffects String[] default []
```

### Friendship
```
id       UUID   PK
userAId  UUID   FK → User  (always smaller UUID)
userBId  UUID   FK → User
status   String (pending, accepted, blocked)
createdAt DateTime

@@unique([userAId, userBId])
@@index([userAId])
@@index([userBId])
```

### Group
```
id      UUID   PK
name    String
ownerId UUID   FK → User
emoji   String default "👥"
createdAt DateTime
```

### GroupMember
```
id                UUID    PK
groupId           UUID    FK → Group
userId            UUID    FK → User
notifyOnMoodChange Boolean default true

@@unique([groupId, userId])
```

### Reaction
```
id         UUID   PK
senderId   UUID   FK → User
receiverId UUID   FK → User
moodLogId  UUID?  FK → MoodLog
type       String (hug, cheer, high-five, heart, laugh)
emoji      String?
createdAt  DateTime
```

### Message
```
id         UUID    PK
senderId   UUID    FK → User
receiverId UUID    FK → User
content    String
msgType    String  default "text"
read       Boolean default false
createdAt  DateTime

@@index([senderId, receiverId, createdAt])
```

### MusicShare
```
id         UUID   PK
senderId   UUID   FK → User
receiverId UUID   FK → User
songTitle  String
artistName String?
songUrl    String
platform   String  (spotify, youtube, apple, other)
note       String?
createdAt  DateTime
```

### Notification
```
id        UUID    PK
userId    UUID    FK → User
type      String  (friend_request, reaction, mood_update, group_invite, etc.)
title     String
body      String
data      Json?
read      Boolean default false
createdAt DateTime

@@index([userId, read, createdAt])
```

### TimeCapsule
```
id         UUID    PK
userId     UUID    FK → User
emotion    String
message    String
deliverAt  DateTime
delivered  Boolean default false
createdAt  DateTime
```

## 8. 3D Sphere Implementation

### Canvas Setup
```jsx
<Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
  <ambientLight intensity={0.3} />
  <pointLight position={[10, 10, 10]} intensity={1} />
  <MoodSphereCore emotion={emotion} intensity={intensity} />
  <OrbitalParticles emotion={emotion} arousal={arousal} />
  <OrbitControls enableZoom={false} enablePan={false} />
  <EffectComposer>
    <Bloom luminanceThreshold={0.4} intensity={1.5} />
  </EffectComposer>
</Canvas>
```

### Vertex Shader (Key Concepts)
- Simplex 3D noise for organic displacement
- `uArousal` drives displacement amplitude (calm = smooth, anxious = spiky)
- `uTime` animates the noise field
- `uIntensity` scales overall effect

### Fragment Shader (Key Concepts)
- Two-color gradient (`uColorA`, `uColorB`) blended via noise
- Fresnel effect for edge glow
- Storm flashes at high arousal (`uArousal > 0.7`)
- Nebula noise pattern for depth
- Pulse animation synced to `uTime`

### Emotion-to-Color Mapping (vec3)
```glsl
// happiness:  vec3(1.0, 0.843, 0.0)   → vec3(1.0, 0.647, 0.0)
// sadness:    vec3(0.255, 0.412, 0.882) → vec3(0.118, 0.235, 0.588)
// anger:      vec3(0.863, 0.078, 0.235) → vec3(0.545, 0.0, 0.0)
// calm:       vec3(0.180, 0.545, 0.341) → vec3(0.133, 0.412, 0.255)
// excitement: vec3(1.0, 0.549, 0.0)   → vec3(1.0, 0.271, 0.0)
// anxiety:    vec3(0.545, 0.0, 0.545)  → vec3(0.294, 0.0, 0.510)
// tired:      vec3(0.439, 0.502, 0.565) → vec3(0.282, 0.322, 0.365)
// hopeful:    vec3(1.0, 0.412, 0.706)  → vec3(1.0, 0.627, 0.478)
```

### Galaxy View
Friend spheres arranged in orbital rings around the user's central sphere. Each friend sphere is a miniature version with their current mood colors. Click to navigate to friend profile.

### Performance
- LOD: Reduce sphere segments for distant/small spheres
- Instanced rendering for particles
- Lazy load 3D scenes
- 2D CSS fallback for low-end devices

## 9. UI/UX Pages

| Page            | Key Elements                                                    |
|-----------------|----------------------------------------------------------------|
| Landing         | Animated demo sphere, hero text, feature cards, CTA            |
| Login/Register  | Clean forms, emotion-themed backgrounds                        |
| Dashboard       | Friend Galaxy (3D), quick mood FAB, weekly insights card       |
| Profile         | Large sphere, mood info, history timeline, streak              |
| Mood Logger     | Emotion picker grid, intensity slider, live sphere preview     |
| Friend Profile  | Friend's sphere, mood info, reactions, message/music buttons   |
| Messages        | Conversation list + chat view                                  |
| Groups          | Group list, create modal, member spheres                       |
| Monthly Summary | Multi-step slideshow: charts, stats, compatibility             |
| Settings        | Profile edit, privacy, theme, sphere style, sounds, notifs     |
| Notifications   | Chronological list, read/unread, action links                  |

## 10. AI-Powered Insights (Simple Aggregation)

No machine learning — all insights use straightforward database queries:

### Day-of-Week Patterns
```js
// Group mood logs by day of week, calculate average valence per day
// "You tend to feel happiest on Fridays (+0.72 avg valence)"
```

### Trend Detection
```js
// Compare 7-day moving average of current week vs previous week
// "Your mood has been trending upward this week (+12%)"
```

### Emotional Compatibility
```js
// For two users, get their mood logs over the same period
// Calculate average absolute difference of valence values
// Normalize to 0-100% score
// "You and Alex have 78% emotional compatibility"
```

### Monthly Statistics
```js
// Emotion distribution (pie chart data)
// Happiest/saddest day (max/min valence)
// Weekly averages (line chart data)
// Current streak
```

## 11. Development Challenges & Solutions

| Challenge                | Solution                                              |
|--------------------------|-------------------------------------------------------|
| 3D Performance           | LOD, instancing, lazy loading, 2D fallback            |
| Shader Debugging         | Start simple, add effects incrementally, use leva GUI |
| Real-time Sync           | Socket.io rooms per user, optimistic UI updates       |
| Bidirectional Friendships| Always store smaller UUID as userAId, query both dirs |
| Monthly Summary Gen      | On-demand calculation with date range queries         |
| Privacy                  | Privacy levels (public/friends/private) on preferences|
| Mobile Performance       | Reduced particle count, simpler shaders on mobile     |

## 12. Development Timeline (16 Weeks)

| Week  | Phase       | Focus                                    |
|-------|-------------|------------------------------------------|
| 1-2   | Foundation  | Project setup, Docker, DB, Auth          |
| 3-4   | Core Mood   | Mood logging, 3D sphere, shaders         |
| 5-6   | Core Mood   | Emotion picker, backgrounds, streak      |
| 7-8   | Social      | Friends, requests, friend galaxy         |
| 9-10  | Social      | Messages, reactions, groups              |
| 11-12 | Advanced    | Insights, monthly summary, charts        |
| 13-14 | Advanced    | Music sharing, time capsules, polish     |
| 15-16 | Launch      | Testing, performance, deployment         |
