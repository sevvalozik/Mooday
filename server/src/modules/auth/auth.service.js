import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../../config/database.js';
import config from '../../config/index.js';
import { AppError } from '../../middleware/errorHandler.js';

const SALT_ROUNDS = 12;

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
};

const sanitizeUser = (user) => {
  const { passwordHash, ...rest } = user;
  return rest;
};

export const register = async ({ email, username, displayName, password }) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    const field = existingUser.email === email ? 'Email' : 'Username';
    throw new AppError(`${field} is already taken`, 409, 'CONFLICT');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        username,
        displayName,
        passwordHash,
      },
    });

    await tx.userPreferences.create({
      data: { userId: newUser.id },
    });

    await tx.streak.create({
      data: { userId: newUser.id },
    });

    return newUser;
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

export const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400, 'MISSING_TOKEN');
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new AppError('User no longer exists', 401, 'USER_NOT_FOUND');
  }

  const accessToken = generateAccessToken(user);

  return { accessToken };
};

export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { preferences: true },
  });

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  return sanitizeUser(user);
};

export const updateProfile = async (userId, data) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    include: { preferences: true },
  });

  return sanitizeUser(user);
};
