import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import * as ctrl from './notification.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrl.getNotifications);
router.patch('/:id/read', ctrl.markAsRead);
router.patch('/read-all', ctrl.markAllAsRead);

export default router;
