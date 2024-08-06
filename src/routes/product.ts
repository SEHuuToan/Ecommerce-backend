import { Router } from 'express';
import productController from '../controllers/productController';
import upload from '../middleware/upload';
import uploadCloudinary from '../middleware/uploadCloudinary';
import authenticateJWT from '../middleware/authMiddleware';

const router: Router = Router();

router.get('/all-product', authenticateJWT, productController.getAllProducts);
router.get('/latest-product', authenticateJWT, productController.getLatestProducts);
router.get('/sport-bike', authenticateJWT, productController.getSportBikeProducts);
router.get('/naked-bike', authenticateJWT, productController.getNakedBikeProducts);
router.get('/adventure', authenticateJWT, productController.getAdventureProducts);
router.get('/classic', authenticateJWT, productController.getClassicProducts);
router.post('/create-product', authenticateJWT, uploadCloudinary, productController.createProduct);
router.put('/update-product/:id', authenticateJWT, uploadCloudinary, productController.updateProduct2);
router.get('/search/:query', productController.searchProduct);
router.delete('/:id', authenticateJWT, productController.deleteProduct);
router.get('/images', authenticateJWT, productController.getAllImageCloudinary);
router.post("/upload", authenticateJWT, upload.array('product', 12), productController.uploadImages);
router.delete('/images/:productId/:filename', authenticateJWT, productController.deleteImage);
router.get('/:id', authenticateJWT, productController.getProductById);
export default router;
