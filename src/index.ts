import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes/product';
import path from 'path';
const port = 4000;
const app = express();

app.use(express.json());
app.use(cors());

//database connect with mongodb
mongoose.connect("mongodb://localhost:27017/db_motocycle");

app.get("/", (req: Request, res: Response) => {
    res.send("Express app is running")
})
app.listen(port, () => {
    console.log('Server running at Port ' + port);
});

app.use('/api/products', productRoutes);
app.use('/api/images', express.static(path.resolve(__dirname, '../upload/images')));
