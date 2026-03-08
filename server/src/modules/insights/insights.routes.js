import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as insightsController from './insights.controller.js';

const router = Router();

router.get('/weekly', authenticate, asyncHandler(insightsController.getWeeklyInsights));
router.get('/monthly', authenticate, asyncHandler(insightsController.getMonthlySummary));
router.get('/compatibility/:friendId', authenticate, asyncHandler(insightsController.getCompatibility));

export default router;
