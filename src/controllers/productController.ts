import { Request, Response } from 'express';
import Product from '../models/products';
import { v2 as cloudinary } from 'cloudinary';
// const port = process.env.PORT || 4000;

interface ProductInterface {
    model: string;
    name: string;
    date: Date;
    odo: string;
    color: string;
    brand: string;
    option: string;
    category: string;
    image: { url: string; public_id: string }[];
    price: number;
    status: boolean;
    description: string;
}
interface Image {
    url: string;
    public_id: string;
}

const convertImageToBase64String = (file: Express.Multer.File) => {
    const base64String = file.buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64String}`;
}

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({}).sort({ date: -1 });
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
        //logic xóa ảnh trước khi xóa product
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        // Lấy mảng hình ảnh từ sản phẩm
        const productImages = product.image.map(img => img.public_id)
        // Xóa từng hình ảnh trong sản phẩm
        for (const imageUrl of productImages) {
            try {
                const deleteImage = await cloudinary.uploader.destroy(imageUrl)
                if (!deleteImage) {
                    console.log(`Deleted image successfully`);
                } else {
                    console.error(`Failed to delete image`);
                }
            } catch {
                console.log(`Failed to delete image`);
            }
        }
        // Xóa sản phẩm sau khi đã xóa tất cả các hình ảnh
        await Product.findByIdAndDelete(productId);
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            name: product.name
        });
    } catch (error) {
        res.status(500).send(error);
    }
};


const createProduct = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        console.log( 'files: ',files);
        if (!files || files.length === 0) {
            return res.status(400).json({ success: 0, message: 'No images uploaded' }); 
        }
        const productData = JSON.parse(req.body.product);
        for (const file of files) {
            const allowedFormats = ['png', 'jpg', 'jpeg', 'svg'];
            if (!allowedFormats.includes(file.mimetype.split('/')[1])) {
                throw new Error('Unsupported file format');
            }
            const result = await cloudinary.uploader.upload(convertImageToBase64String(file), {
                folder: 'products',
                format: file.mimetype.split('/')[1],
                transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto:good' }], // Tuỳ chỉnh kích thước và chất lượng ảnh
            });
            productData.image.push({
                url: result.secure_url,
                public_id: result.public_id,
            });
        }
        const requiredFields = ['price', 'category', 'option', 'brand', 'model', 'color', 'odo', 'name'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                return res.status(400).json({ success: 0, message: `Field ${field} is required` });
            }
        }
        const product = new Product(productData);
        await product.save();
        res.json({
            success: true,
            product,
        })
    } catch (error) {
        res.status(500).send(error);
    }
};

// const createProduct = async (req: Request, res: Response) => {
//     try {
//         const files = req.files as Express.Multer.File[];
//         console.log(files);
//         if (!files || files.length === 0) {
//             return res.status(400).json({ success: 0, message: 'No images provided' });
//         }
//         const imageUrls = files.map(file => { return `http://localhost:${port}/api/images/${file.filename}` });
//         const productData = JSON.parse(req.body.product);
//         const requiredFields = ['price', 'category', 'option', 'brand', 'model', 'color', 'odo', 'name'];
//         for (const field of requiredFields) {
//             if (!productData[field]) {
//                 return res.status(400).json({ success: 0, message: `Field ${field} is required` });
//             }
//         }
//         productData.image = imageUrls;
//         const product = new Product(productData);
//         await product.save();
//         res.json({
//             success: true,
//             product,
//         })
//     } catch (error) {
//         res.status(500).send(error);
//     }
// };
const updateProduct2 = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        const productData = JSON.parse(req.body.product);
        const files = req.files as Express.Multer.File[];
        let formDataChanged = false;
        let fileListChanged = false;
        let imageListChanged = false;
        // Kiểm tra xem có thay đổi trong formData
        if (productData) {
            const productFromDB = await Product.findById(productId).exec();
            if (!productFromDB) {
                return res.status(404).json({ success: 0, message: 'Product not found' });
            }
            const fieldsToUpdate: (keyof ProductInterface)[] = ['name', 'odo', 'color', 'model', 'brand', 'option', 'description', 'category', 'price'];
            // Kiểm tra từng trường xem có thay đổi so với dữ liệu hiện tại không
            fieldsToUpdate.forEach(field => {
                if (productData[field] !== undefined && productData[field] !== productFromDB[field]) {
                    formDataChanged = true;
                }
            });
            // Kiểm tra xem có thay đổi trong mảng image so với productFromDB
            if (productData.image && productData.image.length !== productFromDB.image.length) {
                imageListChanged = true;
            } else {
                productData.image.forEach((imageUrl: string) => {
                    if (!productFromDB.image.includes(imageUrl)) {
                        imageListChanged = true;
                    }
                });
                productFromDB.image.forEach((imageUrl: string) => {
                    if (!productData.image.includes(imageUrl)) {
                        imageListChanged = true;
                    }
                });
            }
        }
        // Kiểm tra xem có thay đổi trong fileList (có tệp mới được tải lên không)
        if (files && files.length > 0) {
            fileListChanged = true;
        }
        // Nếu không có gì thay đổi thì không cần update
        if (!formDataChanged && !fileListChanged && !imageListChanged) {
            return res.status(400).json({ success: 0, message: 'No changes detected for update' });
        }
        // Cập nhật sản phẩm nếu có thay đổi trong formData
        if (formDataChanged) {
            await Product.findByIdAndUpdate(productId, productData, { new: true });
        }
        // Cập nhật hình ảnh nếu có dữ liệu mới trong fileList
        if (fileListChanged) {
            const newImageUrls:{url: string, public_id: string}[] = [];
            for (const file of files) {
                const allowedFormats = ['png', 'jpg', 'jpeg', 'svg'];
                if (!allowedFormats.includes(file.mimetype.split('/')[1])) {
                    throw new Error('Unsupported file format');
                }
                const result = await cloudinary.uploader.upload(convertImageToBase64String(file),{
                    folder: 'products',
                    format: file.mimetype.split('/')[1],
                    transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto:good' }], // Tuỳ chỉnh kích thước và chất lượng ảnh
                });
                newImageUrls.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ success: 0, message: 'Product not found' });
            }
            // Lọc ra các URL hình ảnh còn lại sau khi so sánh với mảng `image` được gửi từ front-end
            product.image = product.image.filter((image) => {
                return productData.image.some((img: Image) => img.url === image.url);
            });
            // Thêm các URL hình ảnh mới vào mảng image của sản phẩm
            newImageUrls.forEach(newImage => {
                if (!product.image.some((img) => img.url === newImage.url)) {
                    product.image.push(newImage);
                }
            });
            // Lưu lại sản phẩm sau khi đã cập nhật hình ảnh
            await product.save();
        }

        res.json({ success: 1, message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: 0, message: 'Failed to update product' });
    }
}
const searchProduct = async (req: Request, res: Response) => {
    try {
        const query = req.params.query;
        if (!query) {
            return res.status(400).send({ message: 'Query parameter is missing' });
        }
        const product = await Product.find({
            name: { $regex: query, $options: 'i' }
        }).limit(5);
        res.send(product);
    } catch (error) {
        res.status(500).send(error);
    }
}
// const getAllImage = async (req: Request, res: Response) => {
//     const imagesDir = path.join(__dirname, '../../upload/images');
//     try {
//         fs.promises.readdir(imagesDir).then(files => {
//             const imageUrls = files.map(file => `http://localhost:${port}/upload/images/${file}`);
//             res.json({ success: 1, images: imageUrls });
//         }).catch(err => {
//             res.status(500).json({ success: 0, message: 'Unable to scan directory' });
//         });
//     } catch (error) {
//         res.status(500).send(error);
//     }
// }
const getAllImageCloudinary = async () => {
    const options = {
        expression: "folder:products",
        max_results: 100
    };
    try {
        const resources  = await cloudinary.search.expression(options.expression).execute(); 
        return resources;
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
    }
}

const uploadImages = async (req: Request, res: Response): Promise<string[]> => {
    try {
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            throw new Error("Please upload a file!");
        }
        const files = req.files as Express.Multer.File[];
        const imageUrls = files.map(file => `/api/images/${file.filename}`);
        res.json({
            success: 1,
            imageUrls: imageUrls
        });
        return imageUrls;
    } catch (error) {
        console.error('Failed to upload images:', error);
        throw new Error("Failed to upload images");
    }
}

const deleteImage = async (req: Request, res: Response) => {
    const { productId, filename  } = req.params;
    if (!productId || !filename ) {
        return res.status(400).json({ success: 0, message: 'Can\'t found image!' });
    }
    try {
        // Lấy sản phẩm từ database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: 0, message: 'Product not found!' });
        }
        // Kiểm tra nếu hình ảnh tồn tại trong mảng image
        const imageIndex = product.image.findIndex(img => img.url.includes(filename));
        if (imageIndex === -1) {
            return res.status(404).json({ success: 0, message: 'Image not found in product!' });
        }
        // Lấy ra public_id từ image tìm được trong mảng image
        const public_id = product.image[imageIndex].public_id;
         // Xóa hình ảnh khỏi Cloudinary
         const deleteResult = await cloudinary.uploader.destroy(public_id);
         if (!deleteResult) {
             return res.status(500).json({ success: 0, message: 'Failed to delete image from Cloudinary!' });
         }
        // Xóa URL của ảnh trong mảng image
        product.image.splice(imageIndex, 1);
        // Cập nhật lại product trong database
        await product.save();
        res.json({ success: 1, message: 'Image deleted and product updated successfully!', product });
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
    updateProduct2,
    searchProduct,
    getAllImageCloudinary,
    uploadImages,
    deleteImage,
}
