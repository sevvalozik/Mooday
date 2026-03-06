import * as insightsService from './insights.service.js';

export const getWeeklyInsights = async (req, res) => {
  const data = await insightsService.getWeeklyInsights(req.user.userId);
  res.json({ success: true, data });
};

export const getMonthlySummary = async (req, res) => {
  const now = new Date();
  const year = parseInt(req.query.year, 10) || now.getFullYear();
  const month = parseInt(req.query.month, 10) || now.getMonth() + 1;

  const data = await insightsService.getMonthlySummary(req.user.userId, year, month);
  res.json({ success: true, data });
};

export const getCompatibility = async (req, res) => {
  const data = await insightsService.getCompatibility(req.user.userId, req.params.friendId);
  res.json({ success: true, data });
};
