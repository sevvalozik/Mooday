import * as authService from './auth.service.js';

export const register = async (req, res) => {
  const data = await authService.register(req.validatedBody);

  res.status(201).json({
    success: true,
    data,
  });
};

export const login = async (req, res) => {
  const data = await authService.login(req.validatedBody);

  res.json({
    success: true,
    data,
  });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  const data = await authService.refresh(refreshToken);

  res.json({
    success: true,
    data,
  });
};

export const getMe = async (req, res) => {
  const data = await authService.getMe(req.user.userId);

  res.json({
    success: true,
    data,
  });
};
