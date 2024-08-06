import { Router } from 'express';
import authController from "../controllers/authController";
import authenticateJWT from '../middleware/authMiddleware';

const router: Router = Router();

router.post('/sign-up', authController.SignUpPost);
router.post('/login', authController.LoginPost);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

export default router;