import { hashPassword, comparePassword } from '../services/authService';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY as string;
const secretKey = process.env.JWT_SECRET_KEY as string;

async function hashPasswordUtils(password: string) {
    return await hashPassword(password);
}
async function comparePasswordUtils(password: string, hashedPassword: string) {
    return await comparePassword(password, hashedPassword);
}
const generateAccessToken = (username: string): string => {
    const accesstoken = jwt.sign({ username }, secretKey, { expiresIn: '1m' }); // Thời gian hết hạn là 1 giờ
    return accesstoken;
}
const generateRefreshToken = (username: string): string => {
    const refreshToken = jwt.sign({ username }, refreshSecretKey, { expiresIn: '1d' });
    return refreshToken;
}
const verifyToken = (token: string, type: 'access' | 'refresh'): any => {
    try {
        const secret = type === 'access' ? secretKey : refreshSecretKey;
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        throw error
    }
}


export {
    hashPasswordUtils,
    comparePasswordUtils,
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    refreshSecretKey,
}