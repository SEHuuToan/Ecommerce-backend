import { Router } from 'express';
import productController from '../controllers/productController';
import upload from '../middleware/upload';
import uploadCloudinary from '../middleware/uploadCloudinary';

const router: Router = Router();

router.get('/all-product', productController.getAllProducts);
router.get('/latest-product', productController.getLatestProducts);
router.get('/sport-bike', productController.getSportBikeProducts);
router.get('/naked-bike', productController.getNakedBikeProducts);
router.get('/adventure', productController.getAdventureProducts);
router.get('/classic', productController.getClassicProducts);
router.post('/create-product', uploadCloudinary, productController.createProduct);
router.put('/update-product/:id', upload.array('images', 12),productController.updateProduct2);
router.get('/search/:query', productController.searchProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/images', productController.getAllImage);
router.post("/upload", upload.array('product', 12), productController.uploadImages);
router.delete('/images/:productId/:filename', productController.deleteImage);
router.get('/:id', productController.getProductById);
export default router;
