import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as friendController from './friend.controller.js';

const router = Router();

router.get('/search', authenticate, asyncHandler(friendController.searchUsers));
router.get('/', authenticate, asyncHandler(friendController.listFriends));
router.post('/request/:id', authenticate, asyncHandler(friendController.sendRequest));
router.post('/accept/:id', authenticate, asyncHandler(friendController.acceptRequest));
router.get('/requests', authenticate, asyncHandler(friendController.getPendingRequests));
router.delete('/:id', authenticate, asyncHandler(friendController.removeFriend));

export default router;
