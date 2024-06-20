import { Router } from 'express';
import productController from '../controllers/productController';
import upload from '../middleware/upload';
import Product from '../models/products';

const router: Router = Router();
const port = 4000;

router.get('/all-product', async(req, res) => {
    try {
        const products = await Product.find({});
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/:id', productController.getProductById);
router.get('/products', productController.getLatestProducts);
router.get('/product/sport-bike', productController.getSportBikeProducts);
router.get('/product/naked-bike', productController.getNakedBikeProducts);
router.get('/product/adventure', productController.getAdventureProducts);
router.get('/product/classic', productController.getClassicProducts);
router.post('/', async (req, res) => {
    try {
        // const lastProduct = await Product.findOne().sort({ id: -1 });
        // const newId = lastProduct ? lastProduct.id + 1 : 1;
        const imageUrls = req.body.image
        if (!imageUrls || imageUrls.length === 0) {
            return res.status(400).json({ success: 0, message: 'No image URLs provided' });
        }
        const product = new Product({
            ...req.body,
            image: imageUrls
        });
        await product.save();
        res.json({
            success: true,
            name: req.body.name,
        })
    } catch (error) {
        res.status(500).send(error);
    }
});
router.delete('/product/:id', async(req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        } else {
            res.status(200).json({
                success: true,
                message: 'Product deleted successfully',
                name: product.name
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});
router.post("/upload", upload.array('product', 12), async(req, res) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ success: 0, message: 'No files uploaded' });
    }
    const imageUrls = (req.files as Express.Multer.File[]).map(file => `http://localhost:${port}/api/images/${file.filename}`);

    res.json({
        success: 1,
        imageUrls: imageUrls
    });
});

export default router;
