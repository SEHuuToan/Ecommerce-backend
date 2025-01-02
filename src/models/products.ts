import mongoose, { SchemaTypeOptions } from "mongoose";

const ProductSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId },
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
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