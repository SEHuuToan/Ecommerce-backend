import { Router } from 'express';
import productController from '../controllers/productController';
import upload from '../middleware/upload';


const router: Router = Router();

router.get('/all-product', productController.getAllProducts);
router.get('/latest-product', productController.getLatestProducts);
router.get('/sport-bike', productController.getSportBikeProducts);
router.get('/naked-bike', productController.getNakedBikeProducts);
router.get('/adventure', productController.getAdventureProducts);
router.get('/classic', productController.getClassicProducts);
router.post('/', productController.createProduct);
router.put('/update-product/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/images', productController.getAllImage);
router.post("/upload", upload.array('product', 12), productController.uploadImages);
router.delete('/images/:productId/:filename', productController.deleteImage);
router.get('/:id', productController.getProductById);
export default router;
