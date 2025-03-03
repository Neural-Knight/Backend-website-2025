import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
const router = Router();

router.get('/',authenticate, userController.getUser);
router.put('/update',authenticate, userController.updateUser);

export default router;