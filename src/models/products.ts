import mongoose from "mongoose";

interface IProduct extends Document {
    name: string;
    user: mongoose.Types.ObjectId;
    odo: string;
    color: string;
    model: string;
    brand: string;
    option: string;
    description?: string;
    category: string;
    image: Array<{
        url: string;
        public_id: string;
    }>;
    price: number;
    date: Date;
    status: boolean;
}

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    odo: { type: String, required: true },
    color: { type: String, required: true },
    model: { type: String, required: true },
    brand: { type: String, required: true },
    option: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    image: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    ],
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: Boolean, default: true }
});
const Product = mongoose.model<IProduct>('products', ProductSchema);
export default Product;