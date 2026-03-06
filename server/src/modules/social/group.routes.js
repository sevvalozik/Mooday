import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import * as groupController from './group.controller.js';
import { createGroupSchema, addMemberSchema } from './group.controller.js';

const router = Router();

router.post('/', authenticate, validate(createGroupSchema), groupController.createGroup);
router.get('/', authenticate, groupController.getGroups);
router.get('/:id', authenticate, groupController.getGroup);
router.post('/:id/members', authenticate, validate(addMemberSchema), groupController.addMember);
router.delete('/:id/members/:userId', authenticate, groupController.removeMember);

export default router;
