import { hashPassword, comparePassword } from '../services/authService';
import jwt, { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY as string;
const secretKey = process.env.JWT_SECRET_KEY as string;

interface JwtPayload extends DefaultJwtPayload {
    username: string;
    role: 'user' | 'admin';
}

async function hashPasswordUtils(password: string) {
    return await hashPassword(password);
}
async function comparePasswordUtils(password: string, hashedPassword: string) {
    return await comparePassword(password, hashedPassword);
}
const generateAccessToken = (username: string): string => {
    const accesstoken = jwt.sign({ username }, secretKey, { expiresIn: '45m' }); // Thời gian hết hạn là 45phut
    return accesstoken;
}
const generateRefreshToken = (username: string): string => {
    const refreshToken = jwt.sign({ username }, refreshSecretKey, { expiresIn: '1d' }); // Thời gian hết hạn là 1 ngay
    return refreshToken;
}
const verifyToken = (token: string, type: 'access' | 'refresh'): JwtPayload => {
    const secret = type === 'access' ? secretKey : refreshSecretKey;
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === 'string') {
        throw new Error('Invalid token payload');
    }
    return decoded as JwtPayload;
}


export {
    hashPasswordUtils,
    comparePasswordUtils,
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    refreshSecretKey,
}