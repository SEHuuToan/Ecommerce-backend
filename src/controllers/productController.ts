import { Request, Response } from 'express';
import Product from '../models/products';
import path from 'path';
import fs from 'fs';

const port = 4000;

interface ProductInterface {
    model: string;
    name: string;
    date: Date;
    odo: string;
    color: string;
    brand: string;
    option: string;
    category: string;
    image: string[];
    price: number;
    status: boolean;
    description: string;
}

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

const getAdventureProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({ category: 'adventure' }).sort({ date: -1 });
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
}
const getClassicProducts = async (req: Request, res: Response) => {
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
const updateProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const updatedFields: Partial<ProductInterface> = req.body;
        if (!updatedFields || Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ success: 0, message: 'No data provided for update' });
        }
        // Lấy sản phẩm từ CSDL
        const product = await Product.findById(productId).exec();
        if (!product) {
            return res.status(404).json({ success: 0, message: 'Product not found' });
        }
        // Kiểm tra xem có sự thay đổi trong các trường yêu cầu
        const requiredFields: (keyof ProductInterface)[] = ['name', 'odo', 'color', 'model', 'brand', 'option', 'category', 'price'];
        const isRequiredFieldsChanged = requiredFields.some(field => updatedFields[field] !== undefined && updatedFields[field] !== product[field]);
        // Nếu không có thay đổi trong các trường yêu cầu
        if (!isRequiredFieldsChanged) {
            return res.status(400).json({ success: 0, message: 'No required fields were updated' });
        }
        // Cập nhật sản phẩm
        requiredFields.forEach(field => {
            if (updatedFields[field] !== undefined) {
                (product as any)[field] = updatedFields[field];
            }
        });
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
const updateProduct2 = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const updatedFields: Partial<ProductInterface> = req.body;
        if (!updatedFields || Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ success: 0, message: 'No data provided for update' });
        }
        // Lấy sản phẩm từ CSDL
        const product = await Product.findById(productId).exec();
        if (!product) {
            return res.status(404).json({ success: 0, message: 'Product not found' });
        }
        // Kiểm tra xem có sự thay đổi trong các trường yêu cầu hoặc mảng image
        const requiredFields: (keyof ProductInterface)[] = ['name', 'odo', 'color', 'model', 'brand', 'option', 'description', 'category', 'price'];
        const isRequiredFieldsChanged = requiredFields.some(field => updatedFields[field] !== undefined && updatedFields[field] !== product[field]);
        const isImageChanged = updatedFields.image && !arrayEquals(updatedFields.image, product.image);

        // Nếu không có bất kỳ thay đổi nào
        if (!isRequiredFieldsChanged && !isImageChanged) {
            return res.status(400).json({ success: 0, message: 'Không có thay đổi gì được cập nhật' });
        } else {
            let finalImageArray: string[] = [];
            // Cập nhật các trường nếu có thay đổi
            if (isImageChanged) {
                // Tạo mảng mới từ image mới và image cũ
                const newImages = updatedFields.image || [];
                const currentImages = product.image || [];
                const removedImages = currentImages.filter(img => !newImages.includes(img));
                const addedImages = newImages.filter(img => !currentImages.includes(img));
                finalImageArray = [...currentImages.filter(img => !removedImages.includes(img)), ...addedImages];
                // Upload các ảnh mới và lưu URL vào finalImageArray
                if (addedImages.length > 0) {
                        const imageUrls = (req.files as Express.Multer.File[]).map(file => `http://localhost:${port}/api/images/${file.filename}`);
                        finalImageArray.push(...imageUrls);
                        // Cập nhật các trường và hình ảnh
                        if (isRequiredFieldsChanged) {
                            requiredFields.forEach(field => {
                                if (updatedFields[field] !== undefined) {
                                    (product as any)[field] = updatedFields[field];
                                }
                            });
                        }
                        product.image = finalImageArray;
                        // Lưu sản phẩm đã cập nhật vào CSDL
                        await product.save();
                        res.json({
                            success: 1,
                            message: 'Product updated successfully',
                            updatedProduct: product,
                        });
                    };
                    return; // Return để ngăn việc gọi res.json() ở dưới
            }
        }
    } catch (error) {
    }

}
const getAllImage = async (req: Request, res: Response) => {
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
    const { productId, filename } = req.params;
    if (!productId || !filename) {
        return res.status(400).json({ success: 0, message: 'Can\'t found image!' });
    }
    try {
        // Lấy sản phẩm từ database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: 0, message: 'Product not found!' });
        }
        // Lấy danh sách các hình ảnh từ sản phẩm
        const imageArray = product.image;
        // Kiểm tra nếu hình ảnh tồn tại trong mảng image
        if (!imageArray.includes(`http://localhost:4000/api/images/${filename}`)) {
            return res.status(404).json({ success: 0, message: 'Image not found in product!' });
        }
        const filePath = path.join(__dirname, '../../upload/images', filename)
        fs.unlink(filePath, async (error) => {
            if (error) {
                console.error('Failed to delete image:', error);
                return res.status(500).json({ success: 0, message: 'Failed to delete image!' });
            }
            // Xóa URL của ảnh trong mảng image
            const updatedImageArray = imageArray.filter(img => img !== `http://localhost:4000/api/images/${filename}`);
            // Cập nhật lại product trong database
            product.image = updatedImageArray;
            await product.save();
            res.json({ success: 1, message: 'Image deleted and product updated successfully!', product });
        });
    } catch (error) {
        console.error('Caught error:', error);
        res.status(500).send(error);
    }
}
// Helper function to compare two arrays for equality
function arrayEquals(a: any[], b: any[]) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
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
