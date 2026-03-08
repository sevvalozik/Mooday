import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as groupController from './group.controller.js';
import { createGroupSchema, addMemberSchema } from './group.controller.js';

const router = Router();

router.post('/', authenticate, validate(createGroupSchema), asyncHandler(groupController.createGroup));
router.get('/', authenticate, asyncHandler(groupController.getGroups));
router.get('/:id', authenticate, asyncHandler(groupController.getGroup));
router.post('/:id/members', authenticate, validate(addMemberSchema), asyncHandler(groupController.addMember));
router.delete('/:id/members/:userId', authenticate, asyncHandler(groupController.removeMember));

export default router;
