import { Router } from 'express';
import productController from '../controllers/productController';
import upload from '../middleware/upload';
import Product from '../models/products';

const router: Router = Router();
const port = 4000;

router.get('/all-product', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/latest-product', productController.getLatestProducts);
router.get('/product/sport-bike', productController.getSportBikeProducts);
router.get('/naked-bike', productController.getNakedBikeProducts);
router.get('product/adventure', productController.getAdventureProducts);
router.get('product/classic', productController.getClassicProducts);
router.post('/', productController.createProduct);
router.delete('/product/:id', productController.removeProduct);
router.post("/upload", upload.array('product', 12), productController.uploadImages);

export default router;
