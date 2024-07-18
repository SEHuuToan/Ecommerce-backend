import { Router } from 'express';
import blogController from "../controllers/blogController";
import uploadCloudinary from '../middleware/uploadCloudinary';

const router: Router = Router();

router.get('/all-blog', blogController.getAllBlogs);
router.get('/blog/:id', blogController.getAllBlogs);
router.post('/add-blog', uploadCloudinary, blogController.addBlog);
router.put('/update-blog/:id', blogController.updateBlog);
router.delete('/blog/:id',  blogController.deleteBlog);


export default router;