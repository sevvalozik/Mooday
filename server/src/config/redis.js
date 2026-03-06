import Redis from 'ioredis';
import config from './index.js';

const redis = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy(times) {
    if (times > 3) {
      console.warn('Redis connection failed, continuing without Redis');
      return null;
    }
    return Math.min(times * 200, 2000);
  },
});

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis error:', err.message);
});

export default redis;
