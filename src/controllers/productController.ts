import { Request, Response } from 'express';
import Product from '../models/products';

const port = 4000;

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({});
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
};

 const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.send(product);
    } catch (error) {
        res.status(500).send(error);
    }
};

 const getLatestProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find().sort({ date: -1 }).limit(6);
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getSportBikeProducts = async(req: Request, res: Response) => {
    try {
        const products = await Product.find({ category: 'sport-bike' }).sort({ date: -1 });
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
}
const getNakedBikeProducts = async(req: Request, res: Response) => {
    try {
        const products = await Product.find({ category: 'naked-bike' }).sort({ date: -1 });
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
}
const getAdventureProducts = async(req: Request, res: Response) => {
    try {
        const products = await Product.find({ category: 'adventure' }).sort({ date: -1 });
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
}
const getClassicProducts = async(req: Request, res: Response) => {
    try {
        const products = await Product.find({ category: 'classic' }).sort({ date: -1 });
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
}

 const removeProduct = async (req: Request, res: Response) => {
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
};
const createProduct = async (req: Request, res: Response) => {
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
};
const uploadImages = async (req: Request, res: Response) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ success: 0, message: 'No files uploaded' });
    }

    const imageUrls = (req.files as Express.Multer.File[]).map(file => `http://localhost:${port}/images/${file.filename}`);
    
    res.json({
        success: 1,
        imageUrls: imageUrls
    });
}


export default {
    getAllProducts,
    getProductById,
    getLatestProducts,
    getSportBikeProducts,
    getNakedBikeProducts,
    getAdventureProducts,
    getClassicProducts,
    removeProduct,
    createProduct,
    uploadImages,
}
