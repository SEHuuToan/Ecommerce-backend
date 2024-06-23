import { Request, Response } from 'express';
import Product from '../models/products';
import path from 'path';
import fs from 'fs';

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
    console.log('req: ', req)
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
        res.json(products)
    } catch (error) {
        res.status(500).send(error);
    }
};

const getSportBikeProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({ category: 'sport-bike' }).sort({ date: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).send(error);
    }
}
const getNakedBikeProducts = async (req: Request, res: Response) => {
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

 const deleteProduct = async (req: Request, res: Response) => {
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
const updateProduct = async(req: Request, res: Response) => {
    try {
        const productId = req.params._id;
        const updatedFields = req.body;
        if (!updatedFields) {
            return res.status(400).json({ success: 0, message: 'No data provided for update' });
        }
        // Tìm sản phẩm cần cập nhật trong CSDL
        const product = await Product.findByIdAndUpdate(productId, updatedFields, { new: true });
         // Kiểm tra nếu không tìm thấy sản phẩm
         if (!product) {
            return res.status(404).json({ success: 0, message: 'Product not found' });
        }
         // Lưu sản phẩm đã cập nhật vào CSDL
         await product.save();
         res.json({
            success: 1,
            message: 'Product updated successfully',
            updatedProduct: product,
        });

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: 0, message: 'Failed to update product' });
    }
}
const getAllImage =  async (req: Request, res: Response) => {
    const imagesDir = path.join(__dirname, '../../upload/images');
    try {
        fs.promises.readdir(imagesDir).then(files => {
            const imageUrls = files.map(file => `http://localhost:${port}/upload/images/${file}`);
            res.json({ success: 1, images: imageUrls });
        }).catch(err => {
            res.status(500).json({ success: 0, message: 'Unable to scan directory' });
        });
    } catch (error) {
        res.status(500).send(error);
    }
}
const uploadImages = async (req: Request, res: Response) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ success: 0, message: 'No files uploaded' });
    }
    const imageUrls = (req.files as Express.Multer.File[]).map(file => `http://localhost:${port}/api/images/${file.filename}`);
    res.json({
        success: 1,
        imageUrls: imageUrls
    });
}

const deleteImage = async (req: Request, res: Response) => {
    const {filename} = req.params;
    if (!filename) {
        return res.status(400).json({ success: 0, message: 'Can\'t found image!' });
    }
    const filePath = path.join(__dirname, '../../upload/images', filename)
    try {
        fs.unlink(filePath, (error) => {
            if (error) {
                console.error('Failed to delete image:', error);
                return res.status(500).json({ success: 0, message: 'Failed to delete image!' });
            }
            res.json({ success: 1, message: 'Image deleted successfully!' });
        });
    } catch (error) {
        console.error('Caught error:', error);
        res.status(500).send(error);
    }
}
export default {
    getAllProducts,
    getProductById,
    getLatestProducts,
    getSportBikeProducts,
    getNakedBikeProducts,
    getAdventureProducts,
    getClassicProducts,
    deleteProduct,
    createProduct,
    updateProduct,
    getAllImage,
    uploadImages,
    deleteImage,
}
