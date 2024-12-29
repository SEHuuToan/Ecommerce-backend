import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId },
    title: { type: String},
    header: { type: String},
    body1: { type: String},
    body2: { type: String },
    body3: { type: String},
    image: { type: Array},
    footer: { type: String},
    date: { type: Date, default: Date.now },
    status: { type: Boolean}
});
const Blog = mongoose.model('blogs', BlogSchema);
export default Blog;
