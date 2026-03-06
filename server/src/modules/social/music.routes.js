import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import * as musicController from './music.controller.js';
import { shareSongSchema } from './music.controller.js';

const router = Router();

router.post('/', authenticate, validate(shareSongSchema), musicController.shareSong);
router.get('/received', authenticate, musicController.getReceivedSongs);

export default router;
