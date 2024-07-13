import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes/product';
import authRoutes from './routes/authRoutes';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const port = 4000;
const app = express();
const hostname = process.env.HOST_NAME;

app.use(express.json());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
//database connect with mongodb
mongoose.connect("mongodb://localhost:27017/db_motocycle");

app.get("/", (req: Request, res: Response) => {
    res.send("Express app is running")
})
app.listen(port, hostname,  () => {
    console.log(`Máy chủ đang chạy tại http://${hostname}:${port}/`);
});

app.use('/api/products', productRoutes);
app.use(authRoutes)
// app.use('/api/images', express.static(path.resolve(__dirname, '../upload/images')));
