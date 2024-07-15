import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/authUtils';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access Denied');
    }
    try {
        const decoded = verifyToken(token);
        req.body.decoded = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

export default authenticateJWT;