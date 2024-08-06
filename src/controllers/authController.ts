import { Request, Response, NextFunction } from 'express';
import User from '../models/userAdmins';
import { hashPassword, comparePassword } from '../services/authService';
import { generateAccessToken, generateRefreshToken } from '../utils/authUtils';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY as string;
//handle Error
const handleError = (err: any) => {
    console.log(err.message, err.code);
    let errors = { username: '', password: '' }
    //duplicate username error code
    if (err.code === 11000) {
        errors.username = 'That username already register!'
    }
    return errors;
}
const SignUpPost = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    try {
        // Kiểm tra xem tên người dùng đã tồn tại trong database chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists'); //đã tồn tại người dùng thi k tao account
        }
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ username, password: hashedPassword });
        const result = await newUser.save();
        res.status(200).json(result);
    } catch (error) {
        handleError(error);
        res.status(400).send('Create account fail!!!!');
    }

};
const LoginPost = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username or password is required'); //kiem tra xem front-end gui xuong BE du username or password hay khong
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Sai tai khoan hoac mat khau');
        }
        const isMatch = await comparePassword(password, user.password)
        if (!isMatch) {
            return res.status(400).send('Sai tai khoan hoac mat khau');
        }
        const accessToken = generateAccessToken(username);
        const refreshToken = generateRefreshToken(username);
        // Set refresh token as HTTP-only cookie
        // res.cookie('refreshToken', refreshToken, { httpOnly: false, secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal server error.');
    }
};
const logout = (req: Request, res: Response) => {
    // res.clearCookie('refreshToken', { httpOnly: false, secure: true });
    res.clearCookie('refreshToken', { httpOnly: true, secure: false });
    res.status(200).send('Đăng xuất thành công');
}
const refreshToken = (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).send('Access Denied. No refreshToken provided.');
    }
    try {
        const { username } = jwt.verify(refreshToken, refreshSecretKey) as { username: string };
        // console.log('Username from Refresh Token:', username); // Ghi log username
        const accessToken = generateAccessToken(username);
        res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Refresh Token Error:', error); // Ghi log lỗi
        res.status(401).send('Invalid or expired token.');
    }
};


export default {
    SignUpPost,
    LoginPost,
    logout,
    refreshToken,
}