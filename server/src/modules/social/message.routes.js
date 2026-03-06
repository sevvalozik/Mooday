import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import * as messageController from './message.controller.js';
import { sendMessageSchema } from './message.controller.js';

const router = Router();

router.post('/', authenticate, validate(sendMessageSchema), messageController.sendMessage);
router.get('/:friendId', authenticate, messageController.getConversation);

export default router;
