import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { AppError } from './errorHandler.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Access token required', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch {
    throw new AppError('Invalid or expired token', 401, 'INVALID_TOKEN');
  }
};
