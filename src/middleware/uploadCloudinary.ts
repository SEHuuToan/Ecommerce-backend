import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY,
    secure: true,
})
// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename: (req, file, cb) => {
//         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//     }
// });
const storage = multer.memoryStorage();

const uploadCloudinary = multer({ storage: storage });

export default uploadCloudinary.array('images', 12);