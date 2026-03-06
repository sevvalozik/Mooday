# Mooday

A social mood tracking platform where your emotional state is represented as a living, animated 3D sphere.

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose

### Setup

1. **Clone and configure**
```bash
cp .env.example .env
```

2. **Start database services**
```bash
docker compose up -d
```

3. **Set up the server**
```bash
cd server
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

4. **Set up the client**
```bash
cd client
npm install
```

5. **Run the app** (two terminals)
```bash
# Terminal 1 — Server
cd server && npm run dev

# Terminal 2 — Client
cd client && npm run dev
```

6. **Open** [http://localhost:5173](http://localhost:5173)

### Test Accounts
| Email | Password | Name |
|-------|----------|------|
| test1@test.com | password123 | Alex |
| test2@test.com | password123 | Jordan |
| test3@test.com | password123 | Sam |

All three users are friends with each other and have 30 days of mood history.

## Tech Stack

- **Frontend:** React 18, Vite, Three.js (React Three Fiber), Framer Motion, Zustand, Tailwind CSS, Recharts
- **Backend:** Express.js, Prisma ORM, PostgreSQL, Redis, Socket.io, JWT, Zod
- **3D:** Custom GLSL shaders with simplex noise, Bloom post-processing, orbital particles

## Features

- 3D mood sphere with real-time GLSL shaders
- Friend galaxy view (3D constellation of friend spheres)
- Real-time mood updates via WebSocket
- Weekly insights & trend detection
- Monthly wrapped-style summary with charts
- Emotional compatibility scores
- Reactions (hug, cheer, high-five, heart, laugh)
- Direct messaging
- Group mood boards
- Music sharing
- Streak tracking with milestone badges
- 4 themes (Dark, Light, Cosmic, Sunset)
- Mood-responsive background effects (rain, sun, storm, particles, calm)

## Useful Commands

```bash
# View database
cd server && npx prisma studio

# Reset database
cd server && npx prisma migrate reset

# Build client
cd client && npm run build
```
