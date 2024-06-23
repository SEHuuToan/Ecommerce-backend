import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    odo: { type: String, required: true },
    color: { type: String, required: true },
    model: { type: String, required: true },
    brand: { type: String, required: true },
    option: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    image: { type: Array, required: true },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: Boolean, default: true }
});
const Product = mongoose.model('products', ProductSchema);
export default Product;