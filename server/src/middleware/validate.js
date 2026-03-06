import { AppError } from './errorHandler.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const messages = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    throw new AppError(messages.join(', '), 400, 'VALIDATION_ERROR');
  }
  req.validatedBody = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    const messages = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    throw new AppError(messages.join(', '), 400, 'VALIDATION_ERROR');
  }
  req.validatedQuery = result.data;
  next();
};
