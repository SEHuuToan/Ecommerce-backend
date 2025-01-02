import { hashPassword, comparePassword } from '../services/authService';
import jwt, { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY as string;
const secretKey = process.env.JWT_SECRET_KEY as string;

interface JwtPayload extends DefaultJwtPayload {
    id: mongoose.ObjectId;
    role: 'user' | 'admin';
}

async function hashPasswordUtils(password: string) {
    return await hashPassword(password);
}
async function comparePasswordUtils(password: string, hashedPassword: string) {
    return await comparePassword(password, hashedPassword);
}
const generateAccessToken = (id: mongoose.ObjectId): string => {
    const accesstoken = jwt.sign({ id }, secretKey, { expiresIn: '45m' }); // Thời gian hết hạn là 45phut
    return accesstoken;
}
const generateRefreshToken = (id: mongoose.ObjectId): string => {
    const refreshToken = jwt.sign({ id }, refreshSecretKey, { expiresIn: '1d' }); // Thời gian hết hạn là 1 ngay
    return refreshToken;
}
const verifyToken = (token: string, type: 'access' | 'refresh'): JwtPayload => {
    const secret = type === 'access' ? secretKey : refreshSecretKey;
    const isTrue = jwt.verify(token, secret);
    let decoded
    if(isTrue){
         decoded = jwt.decode(token);
    }else{
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