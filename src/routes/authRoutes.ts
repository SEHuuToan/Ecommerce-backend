import { Router } from 'express';
import authController from "../controllers/authController";


const router: Router = Router();

router.post('/sign-up', authController.SignUpPost);
router.post('/login', authController.LoginPost);


export default router;