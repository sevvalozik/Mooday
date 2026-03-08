import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as reactionController from './reaction.controller.js';
import { sendReactionSchema } from './reaction.controller.js';

const router = Router();

router.post('/', authenticate, validate(sendReactionSchema), asyncHandler(reactionController.sendReaction));
router.get('/received', authenticate, asyncHandler(reactionController.getReceivedReactions));

export default router;
