import * as moodService from './mood.service.js';

export const createMood = async (req, res) => {
  const { userId } = req.user;
  const moodLog = await moodService.createMood(userId, req.validatedBody);

  res.status(201).json({
    success: true,
    data: moodLog,
  });
};

export const getCurrentMood = async (req, res) => {
  const { userId } = req.user;
  const moodLog = await moodService.getCurrentMood(userId);

  res.json({
    success: true,
    data: moodLog,
  });
};

export const getHistory = async (req, res) => {
  const { userId } = req.user;
  const { page, limit } = req.validatedQuery;
  const result = await moodService.getHistory(userId, { page, limit });

  res.json({
    success: true,
    ...result,
  });
};

export const getStreak = async (req, res) => {
  const { userId } = req.user;
  const streak = await moodService.getStreak(userId);

  res.json({
    success: true,
    data: streak,
  });
};
