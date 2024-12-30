// import express, { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import productRoutes from './routes/product';
// import authRoutes from './routes/authRoutes';
// import blogRoutes from './routes/blogRoute';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';

// dotenv.config();
// const port = 4000;
// const app = express();
// const hostname = process.env.HOST_NAME;

// app.use(express.json());
// app.use(cors({origin: true, credentials: true}));
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));
// app.use(cookieParser())
// //database connect with mongodb
// mongoose.connect("mongodb://127.0.0.1:27017/db_motocycle");

// app.get("/", (req: Request, res: Response) => {
//     res.send("Express app is running")
// })
// app.listen(port, hostname, () => {
//     console.log(`Máy chủ đang chạy tại http://${hostname}:${port}/`);
// });

// app.use('/api/products', productRoutes);
// app.use('/auth', authRoutes);
// app.use('/api', blogRoutes);
// // app.use('/api/images', express.static(path.resolve(__dirname, '../upload/images')));

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes/product';
import authRoutes from './routes/authRoutes';
import blogRoutes from './routes/blogRoute';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();
const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const hostname = process.env.HOST_NAME || '0.0.0.0';

const allowedOrigins = [
    'http://localhost:3000', // Phát triển local
    'https://ecommerce-frontend-beta-eight.vercel.app', // URL front-end sau khi deploy
];

const app = express();
app.use(cors(allowedOrigins));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Static files
app.use('/api/images', express.static(path.resolve(__dirname, '../upload/images')));

// Database connection
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/db_motocycle", {
}).then(() => {
    console.log('Kết nối MongoDB thành công');
}).catch((error) => {
    console.error('Lỗi kết nối MongoDB:', error);
});

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("Express app is running");
});
app.use('/api/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/api', blogRoutes);

app.listen(port, hostname, () => {
    console.log(`Máy chủ đang chạy tại http://${hostname}:${port}/`);
});

