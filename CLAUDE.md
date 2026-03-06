# Mooday — Social Mood Tracking Platform

## Overview
Mooday is a social mood tracking web platform where each user's emotional state is represented as a living, animated 3D sphere. Users log moods, see friends' spheres in a galaxy view, react to emotions, and receive AI-powered insights.

## Tech Stack
- **Frontend:** React 18 + Vite, Three.js via React Three Fiber, Framer Motion, Zustand, Tailwind CSS, Socket.io-client, Recharts, Axios
- **Backend:** Node.js 20+, Express.js, Prisma ORM, PostgreSQL 16, Redis 7, Socket.io, Bull queue, JWT auth (bcrypt), Zod validation
- **DevOps:** Docker Compose for PostgreSQL + Redis

## Folder Structure
```
moodsphere/
├── CLAUDE.md
├── README.md
├── docker-compose.yml
├── .env / .env.example
├── .gitignore
├── docs/
│   └── DESIGN.md
├── shared/
│   ├── emotions.js
│   └── types.js
├── server/
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── app.js
│       ├── config/
│       │   ├── index.js
│       │   ├── database.js
│       │   ├── redis.js
│       │   └── socket.js
│       ├── middleware/
│       │   ├── auth.js
│       │   ├── errorHandler.js
│       │   └── validate.js
│       ├── modules/
│       │   ├── auth/
│       │   │   ├── auth.routes.js
│       │   │   ├── auth.controller.js
│       │   │   ├── auth.service.js
│       │   │   └── auth.validation.js
│       │   ├── mood/
│       │   │   ├── mood.routes.js
│       │   │   ├── mood.controller.js
│       │   │   ├── mood.service.js
│       │   │   └── mood.validation.js
│       │   ├── social/
│       │   │   ├── friend.routes.js
│       │   │   ├── friend.controller.js
│       │   │   ├── friend.service.js
│       │   │   ├── reaction.routes.js
│       │   │   ├── reaction.controller.js
│       │   │   ├── reaction.service.js
│       │   │   ├── message.routes.js
│       │   │   ├── message.controller.js
│       │   │   ├── message.service.js
│       │   │   ├── group.routes.js
│       │   │   ├── group.controller.js
│       │   │   ├── group.service.js
│       │   │   ├── music.routes.js
│       │   │   ├── music.controller.js
│       │   │   └── music.service.js
│       │   └── insights/
│       │       ├── insights.routes.js
│       │       ├── insights.controller.js
│       │       ├── insights.service.js
│       │       ├── patterns.js
│       │       ├── compatibility.js
│       │       └── monthlyReport.js
│       └── socket/
│           └── handlers.js
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── utils/
        │   ├── emotionConfig.js
        │   └── themes.js
        ├── stores/
        │   ├── authStore.js
        │   ├── moodStore.js
        │   ├── friendStore.js
        │   ├── socketStore.js
        │   └── notificationStore.js
        ├── services/
        │   ├── api.js
        │   ├── authService.js
        │   ├── moodService.js
        │   ├── friendService.js
        │   ├── messageService.js
        │   ├── groupService.js
        │   ├── insightService.js
        │   ├── reactionService.js
        │   └── musicService.js
        ├── hooks/
        │   ├── useSocket.js
        │   └── useAmbientSound.js
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx
        │   │   ├── Sidebar.jsx
        │   │   ├── ProtectedRoute.jsx
        │   │   └── PageWrapper.jsx
        │   ├── ui/
        │   │   ├── Button.jsx
        │   │   ├── Input.jsx
        │   │   ├── Toast.jsx
        │   │   ├── Modal.jsx
        │   │   ├── EmotionPicker.jsx
        │   │   ├── IntensitySlider.jsx
        │   │   ├── StreakBadge.jsx
        │   │   └── ReactionButton.jsx
        │   ├── sphere/
        │   │   ├── MoodSphere.jsx
        │   │   ├── MoodSphereCore.jsx
        │   │   ├── OrbitalParticles.jsx
        │   │   ├── FriendGalaxy.jsx
        │   │   └── shaders/
        │   │       ├── vertexShader.js
        │   │       └── fragmentShader.js
        │   └── effects/
        │       ├── MoodBackground.jsx
        │       ├── RainEffect.jsx
        │       ├── SunEffect.jsx
        │       ├── StormEffect.jsx
        │       ├── ParticleEffect.jsx
        │       └── CalmEffect.jsx
        └── pages/
            ├── Landing.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Profile.jsx
            ├── MoodLogger.jsx
            ├── FriendProfile.jsx
            ├── Messages.jsx
            ├── Groups.jsx
            ├── MonthlySummary.jsx
            ├── Settings.jsx
            └── Notifications.jsx
```

## Coding Conventions

### General
- ES Modules everywhere (`import`/`export`)
- `async`/`await` for all async operations
- `const` over `let`, never `var`
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`

### Frontend
- Functional components only, named exports
- Zustand stores per domain (auth, mood, friend, socket, notification)
- All API calls through `services/` layer — components never call axios directly
- Tailwind CSS only — no inline styles, no CSS modules
- React Three Fiber for all 3D rendering

### Backend
- Module pattern: `routes` → `controller` → `service` per feature
- Zod validation in controllers via `validate` middleware
- Prisma for all database access — no raw SQL
- Custom `AppError` class for error handling
- Environment variables accessed through `config/index.js`, never `process.env` directly

### Database
- UUIDs for all primary keys
- Always include `createdAt` and `updatedAt` timestamps
- Index all foreign keys
- Friendships: always store smaller UUID as `userAId`

### Socket.io
- Rooms: `user:{id}`, `group:{id}`
- Events: `mood:update`, `reaction:received`, `notification:new`, `message:new`

## Emotion System (Source of Truth)
```js
const EMOTIONS = {
  happiness:  { color: '#FFD700', valence:  0.8, arousal: 0.5, label: 'Happy',   icon: '☀️' },
  sadness:    { color: '#4169E1', valence: -0.7, arousal: 0.2, label: 'Sad',     icon: '🌧️' },
  anger:      { color: '#DC143C', valence: -0.8, arousal: 0.9, label: 'Angry',   icon: '⛈️' },
  calm:       { color: '#2E8B57', valence:  0.5, arousal: 0.1, label: 'Calm',    icon: '🌿' },
  excitement: { color: '#FF8C00', valence:  0.9, arousal: 0.9, label: 'Excited', icon: '✨' },
  anxiety:    { color: '#8B008B', valence: -0.5, arousal: 0.8, label: 'Anxious', icon: '🌀' },
  tired:      { color: '#708090', valence: -0.2, arousal: 0.1, label: 'Tired',   icon: '🌙' },
  hopeful:    { color: '#FF69B4', valence:  0.6, arousal: 0.4, label: 'Hopeful', icon: '🌅' },
};
```

## API Routes

### Auth
- `POST /api/auth/register` — Create new user
- `POST /api/auth/login` — Login, returns JWT + refresh token
- `POST /api/auth/refresh` — Refresh access token
- `GET  /api/auth/me` — Get current user profile

### Users
- `GET   /api/users/:id` — Get user profile
- `PATCH /api/users/:id` — Update user profile

### Moods
- `POST /api/moods` — Log a new mood
- `GET  /api/moods/current` — Get current (latest) mood
- `GET  /api/moods/history` — Get mood history (paginated)
- `GET  /api/moods/streak` — Get streak info

### Friends
- `GET    /api/friends` — List friends with current moods
- `POST   /api/friends/request/:id` — Send friend request
- `POST   /api/friends/accept/:id` — Accept friend request
- `GET    /api/friends/requests` — Get pending requests
- `DELETE /api/friends/:id` — Remove friend

### Groups
- `POST   /api/groups` — Create group
- `GET    /api/groups` — List user's groups
- `GET    /api/groups/:id` — Get group details
- `POST   /api/groups/:id/members` — Add member
- `DELETE /api/groups/:id/members/:userId` — Remove member

### Reactions
- `POST /api/reactions` — Send reaction
- `GET  /api/reactions/received` — Get received reactions

### Messages
- `POST /api/messages` — Send message
- `GET  /api/messages/:friendId` — Get conversation

### Music
- `POST /api/music` — Share a song
- `GET  /api/music/received` — Get received songs

### Insights
- `GET /api/insights/weekly` — Weekly mood insights
- `GET /api/insights/monthly` — Monthly summary report
- `GET /api/insights/compatibility/:friendId` — Emotional compatibility score

## Environment Variables
```
DATABASE_URL=postgresql://mooday:mooday@localhost:5432/mooday
REDIS_URL=redis://localhost:6379
JWT_SECRET=mooday-dev-secret-change-in-production
JWT_REFRESH_SECRET=mooday-dev-refresh-secret-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Common Commands
```bash
# Start infrastructure
docker compose up -d

# Server
cd server && npm install
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio
npm run dev

# Client
cd client && npm install
npm run dev
```

## Development Phases
1. **Foundation** — Project setup, Docker, Prisma, Express skeleton, Vite + Tailwind
2. **Core Mood** — Auth, mood logging, 3D sphere, emotion system
3. **Social** — Friends, reactions, messages, groups, galaxy view
4. **Advanced** — Insights, monthly summary, music sharing, time capsules, polish
