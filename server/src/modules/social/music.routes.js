import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as musicController from './music.controller.js';
import { shareSongSchema } from './music.controller.js';

const router = Router();

router.post('/', authenticate, validate(shareSongSchema), asyncHandler(musicController.shareSong));
router.get('/received', authenticate, asyncHandler(musicController.getReceivedSongs));

export default router;
