import { Router } from 'express';
import blogController from "../controllers/blogController";
import uploadCloudinary from '../middleware/uploadCloudinary';
import authenticateJWT from '../middleware/authMiddleware';

const router: Router = Router();

router.get('/all-blog', authenticateJWT, blogController.getAllBlogs);
router.get('/blog/:id', authenticateJWT, blogController.getBlogById);
router.post('/add-blog', authenticateJWT, uploadCloudinary, blogController.addBlog);
router.put('/update-blog/:id', authenticateJWT, uploadCloudinary, blogController.updateBlog);
router.delete('/blog/:id', authenticateJWT, blogController.deleteBlog);
router.delete('/images/:blogId/:filename',authenticateJWT, blogController.deleteImageBlog);

export default router;