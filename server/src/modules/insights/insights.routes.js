import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import * as insightsController from './insights.controller.js';

const router = Router();

router.get('/weekly', authenticate, insightsController.getWeeklyInsights);
router.get('/monthly', authenticate, insightsController.getMonthlySummary);
router.get('/compatibility/:friendId', authenticate, insightsController.getCompatibility);

export default router;
