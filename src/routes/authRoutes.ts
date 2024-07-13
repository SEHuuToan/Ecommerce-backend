import { Router } from 'express';
import authController from "../controllers/authController";


const router: Router = Router();
router.get('/sign-up', authController.SignUpGet);
router.post('/sign-up', authController.SignUpPost);
router.get('/login', authController.LoginGet);
router.post('/login', authController.LoginPost);



export default router;