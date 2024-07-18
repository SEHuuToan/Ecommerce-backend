import { Request, Response } from 'express';
import Blog from '../models/blog';
import { v2 as cloudinary } from 'cloudinary';

interface BlogInterface {
    title: string;
    header: string;
    body1: Date;
    body2: string;
    body3: string;
    footer: string;
    image: string[];
    status: boolean;
}
//handle Error
const handleError = (err: any) => {
    console.log(err.message, err.code);
    let errors = { username: '', password: '' }
    //duplicate username error code
    if (err.code === 11000) {
        errors.username = 'That username already register!'
    }
    return errors;
}
const convertImageToBase64String = (file: Express.Multer.File) => {
    const base64String = file.buffer.toString('base64');
    return `data:${file.mimetype};base64,${base64String}`;
}

const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.find({}).sort({ date: -1 });
        res.send(blogs);
    } catch (error) {
        res.status(500).send(error);
    }
};
const getBlogById = async (req: Request, res: Response) => {
    try {
        const blogs = await Blog.findById(req.params.id);
        if (!blogs) {
            return res.status(404).send({ message: 'Blogs not found' });
        }
        res.send(blogs);
    } catch (error) {
        res.status(500).send(error);
    }
};
const addBlog = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        console.log('files: ', files);
        if (!files || files.length === 0) {
            return res.status(400).json({ success: 0, message: 'No images uploaded' });
        }
        const blogData = JSON.parse(req.body.blog);
        for (let file of files) {
            const result = await cloudinary.uploader.upload(convertImageToBase64String(file), {
                folder: 'blogs',
                format: 'png' || 'jpg' || 'jpeg' || 'svg',
                transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto:good' }], // Tuỳ chỉnh kích thước và chất lượng ảnh
            });
            blogData.image.push({
                url: result.secure_url,
                public_id: result.public_id,
            });
        }
        const requiredFields = ['title'];
        for (const field of requiredFields) {
            if (!blogData[field]) {
                return res.status(400).json({ success: 0, message: `Field ${field} is required` });
            }
        }
        const blogs = new Blog(blogData);
        await blogs.save();
        res.json({
            success: true,
            blogs,
        })
    } catch (error) {
        res.status(500).send(error);
    }
};
const updateBlog = async (req: Request, res: Response) => {
    try {
        const blogId = req.params.id;
        const blogData = JSON.parse(req.body.blog);
        const files = req.files as Express.Multer.File[];
        let formDataChanged = false;
        let fileListChanged = false;
        let imageListChanged = false;
        // Kiểm tra xem có thay đổi trong formData
        if (blogData) {
            const blogFromDB = await Blog.findById(blogId).exec();
            if (!blogFromDB) {
                return res.status(404).json({ success: 0, message: 'Blog not found' });
            }
            const fieldsToUpdate: (keyof BlogInterface)[] = ['title', 'header', 'body1', 'body2', 'body3', 'footer'];
            // Kiểm tra từng trường xem có thay đổi so với dữ liệu hiện tại không
            fieldsToUpdate.forEach(field => {
                if (blogData[field] !== undefined && blogData[field] !== blogFromDB[field]) {
                    formDataChanged = true;
                }
            });
            // Kiểm tra xem có thay đổi trong mảng image so với blogFromDB
            if (blogData.image && blogData.image.length !== blogFromDB.image.length) {
                imageListChanged = true;
            } else {
                blogData.image.forEach((imageUrl: string) => {
                    if (!blogFromDB.image.includes(imageUrl)) {
                        imageListChanged = true;
                    }
                });
                blogFromDB.image.forEach((imageUrl: string) => {
                    if (!blogData.image.includes(imageUrl)) {
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
        if (!formDataChanged && !fileListChanged) {
            return res.status(400).json({ success: 0, message: 'No changes detected for update' });
        }
        // Cập nhật sản phẩm nếu có thay đổi trong formData
        if (formDataChanged) {
            await Blog.findByIdAndUpdate(blogId, blogData, { new: true });
        }
        // Cập nhật hình ảnh nếu có dữ liệu mới trong fileList
        if (fileListChanged) {
            const newImageUrls:{url: string, public_id: string}[] = [];
            for (let file of files) {
                const result = await cloudinary.uploader.upload(convertImageToBase64String(file),{
                    folder: 'blogs',
                    format: 'png' || 'jpg' || 'jpeg' || 'svg',
                    transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto:good' }], // Tuỳ chỉnh kích thước và chất lượng ảnh
                });
                newImageUrls.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
            const blog = await Blog.findById(blogId);
            if (!blog) {
                return res.status(404).json({ success: 0, message: 'Product not found' });
            }
            // Lọc ra các URL hình ảnh còn lại sau khi so sánh với mảng `image` được gửi từ front-end
            blog.image = blog.image.filter((image) => {
                return blogData.image.some((img: any) => img.url === image.url);
            });
            // Thêm các URL hình ảnh mới vào mảng image của blog
            newImageUrls.forEach(newImage => {
                if (!blog.image.some((img) => img.url === newImage.url)) {
                    blog.image.push(newImage);
                }
            });
            // Lưu lại blog sau khi đã cập nhật hình ảnh
            await blog.save();
        }

        res.json({ success: 1, message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ success: 0, message: 'Failed to update blog' });
    }

};
const deleteBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const blogs = await Blog.findById(blogId);
    if (!blogs) {
        return res.status(404).send({ message: 'Blogs not found' });
    }
    const blogImages = blogs.image.map(img => img.public_id);
    for (const imageUrl of blogImages) {
        try {
            const deleteImage = await cloudinary.uploader.destroy(imageUrl)
            if (deleteImage.result === 'ok') {
                console.log(`Deleted image successfully`);
            } else {
                console.error(`Failed to delete image`);
            }
        } catch (error) {
            console.error(`Failed to delete image: ${error.message}`);
        }
    }
    await Blog.findByIdAndDelete(blogId);
    res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        name: blogs.title,
    });
};
const deleteImageBlog = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const filename   = req.params;
    if (!blogId || !filename ) {
        return res.status(400).json({ success: 0, message: 'Can\'t found image!' });
    }
    try {
        // Lấy sản phẩm từ database
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: 0, message: 'Blog not found!' });
        }
        // Kiểm tra nếu hình ảnh tồn tại trong mảng image
        const imageIndex = blog.image.findIndex(img => img.url.includes(filename));
        if (imageIndex === -1) {
            return res.status(404).json({ success: 0, message: 'Image not found in blog!' });
        }
        // Lấy ra public_id từ image tìm được trong mảng image
        const public_id = blog.image[imageIndex].public_id;
         // Xóa hình ảnh khỏi Cloudinary
         const deleteResult = await cloudinary.uploader.destroy(public_id);
         if (deleteResult.result !== 'ok') {
             return res.status(500).json({ success: 0, message: 'Failed to delete image from Cloudinary!' });
         }
        // Xóa URL của ảnh trong mảng image
        blog.image.splice(imageIndex, 1);
        // Cập nhật lại blog trong database
        await blog.save();
        res.json({ success: 1, message: 'Image deleted and blog updated successfully!', blog });
    } catch (error) {
        console.error('Caught error:', error);
        res.status(500).send(error);
    }
}

export default {
    getAllBlogs,
    getBlogById,
    addBlog,
    updateBlog,
    deleteBlog,
    deleteImageBlog,
}