import {hashPassword, comparePassword} from '../services/authService';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function hashPasswordUtils(password: string) {
    return await hashPassword(password);
}
async function comparePasswordUtils(password: string, hashedPassword: string) {
    return await comparePassword(password, hashedPassword);
}
const generateToken = (username: string): string => {
    const secretKey = process.env.JWT_SECRET_KEY as string;
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' }); // Thời gian hết hạn là 1 giờ
    return token;
}

const verifyToken = (token: string): any => {
    const secretKey = process.env.JWT_SECRET_KEY as string;
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

export {
    hashPasswordUtils,
    comparePasswordUtils,
    generateToken,
    verifyToken,
}