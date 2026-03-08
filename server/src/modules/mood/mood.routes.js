import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate, validateQuery } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { createMoodSchema, historyQuerySchema } from './mood.validation.js';
import * as moodController from './mood.controller.js';

const router = Router();

router.post('/', authenticate, validate(createMoodSchema), asyncHandler(moodController.createMood));
router.get('/current', authenticate, asyncHandler(moodController.getCurrentMood));
router.get('/history', authenticate, validateQuery(historyQuerySchema), asyncHandler(moodController.getHistory));
router.get('/streak', authenticate, asyncHandler(moodController.getStreak));

export default router;
