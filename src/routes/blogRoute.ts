import { Router } from 'express';
import blogController from "../controllers/blogController";
import uploadCloudinary from '../middleware/uploadCloudinary';

const router: Router = Router();

router.get('/all-blog', blogController.getAllBlogs);
router.get('/blog/:id', blogController.getBlogById);
router.post('/add-blog', uploadCloudinary, blogController.addBlog);
router.put('/update-blog/:id', uploadCloudinary, blogController.updateBlog);
router.delete('/blog/:id',  blogController.deleteBlog);
router.delete('/blog/:id/:filename', blogController.deleteImageBlog);

export default router;