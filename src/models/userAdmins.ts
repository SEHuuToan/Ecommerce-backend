import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const UserAdminSchema = new mongoose.Schema({
    username: { type: String, require: true, unique: true, lowercase: true },
    password: { type: String, require: true, minLength: 6 },
})
UserAdminSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
})
const User = mongoose.model('user', UserAdminSchema);

export default User; 