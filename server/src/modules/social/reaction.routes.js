import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import * as reactionController from './reaction.controller.js';
import { sendReactionSchema } from './reaction.controller.js';

const router = Router();

router.post('/', authenticate, validate(sendReactionSchema), reactionController.sendReaction);
router.get('/received', authenticate, reactionController.getReceivedReactions);

export default router;
