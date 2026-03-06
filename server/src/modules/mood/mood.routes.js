import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate, validateQuery } from '../../middleware/validate.js';
import { createMoodSchema, historyQuerySchema } from './mood.validation.js';
import * as moodController from './mood.controller.js';

const router = Router();

router.post('/', authenticate, validate(createMoodSchema), moodController.createMood);
router.get('/current', authenticate, moodController.getCurrentMood);
router.get('/history', authenticate, validateQuery(historyQuerySchema), moodController.getHistory);
router.get('/streak', authenticate, moodController.getStreak);

export default router;
