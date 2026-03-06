import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import config from './config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { initSocket } from './config/socket.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupSocketHandlers } from './socket/handlers.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import moodRoutes from './modules/mood/mood.routes.js';
import friendRoutes from './modules/social/friend.routes.js';
import reactionRoutes from './modules/social/reaction.routes.js';
import messageRoutes from './modules/social/message.routes.js';
import groupRoutes from './modules/social/group.routes.js';
import musicRoutes from './modules/social/music.routes.js';
import insightsRoutes from './modules/insights/insights.routes.js';

// Catch crashes
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
let io;
try {
  io = initSocket(httpServer);
  setupSocketHandlers(io);
} catch (err) {
  console.warn('Socket.io init failed, continuing without it:', err.message);
}

// Middleware
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/insights', insightsRoutes);

// Serve client build in production
if (config.nodeEnv === 'production') {
  const clientDist = resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(join(clientDist, 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ success: false, error: { message: 'Route not found' } });
  });
}

// Global error handler
app.use(errorHandler);

// Start server
httpServer.listen(config.port, () => {
  console.log(`Mooday server running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

export default app;
