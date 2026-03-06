import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import * as friendController from './friend.controller.js';

const router = Router();

router.get('/', authenticate, friendController.listFriends);
router.post('/request/:id', authenticate, friendController.sendRequest);
router.post('/accept/:id', authenticate, friendController.acceptRequest);
router.get('/requests', authenticate, friendController.getPendingRequests);
router.delete('/:id', authenticate, friendController.removeFriend);

export default router;
