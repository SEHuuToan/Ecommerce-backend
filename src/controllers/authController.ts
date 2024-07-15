import { Request, Response, NextFunction } from 'express';
import User from '../models/userAdmins';
import { hashPassword, comparePassword } from '../services/authService';
import { generateToken } from '../utils/authUtils';
//handle Error
const handleError = (err: any) => {
    console.log(err.message, err.code);
    let errors = {username: '', password: ''}
    //duplicate username error code
    if(err.code === 11000){
        errors.username = 'That username already register!'
    }
    return errors;
}
const SignUpPost = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if(!username || !password){
        return res.status(400).send('Username and password are required');
    }
    try {
        // Kiểm tra xem tên người dùng đã tồn tại trong database chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists'); //đã tồn tại người dùng thi k tao account
        }
       const hashedPassword = await hashPassword(password);
       const newUser = new User({username, password: hashedPassword});
        const result = await newUser.save();
        res.status(200).json(result);
    } catch (error) {
        handleError(error);
        res.status(400).send('Create account fail!!!!');
    }

};
const LoginPost = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if(!username || !password){
        return res.status(400).send('Username or password is required'); //kiem tra xem front-end gui xuong BE du username or password hay khong
    }
    try {
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).send('Sai tai khoan hoac mat khau');
        }
        const isMatch = await comparePassword(password, user.password)
        if(!isMatch){
            return res.status(400).send('Sai tai khoan hoac mat khau');
        }
        const token = generateToken(username);
        res.status(200).json({token});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal server error.');
    }
};
export default {
    SignUpPost,
    LoginPost
}