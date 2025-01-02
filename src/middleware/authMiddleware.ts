import { Request, Response, NextFunction } from 'express';
import { verifyToken, generateAccessToken, } from '../utils/authUtils';
import mongoose from 'mongoose';
interface AuthenticatedRequest extends Request {
    decoded?: object;
  }
const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
       tokenHeader = req.cookies['accessToken'];
    }
    if (!tokenHeader) {
        return res.status(401).send('Access Denied: No tokenheader provided');
    }
    if(tokenHeader.startsWith('Bearer ')){
        tokenHeader = tokenHeader.split(' ')[1];
    }
 
    try {
        const decoded = verifyToken(tokenHeader, 'access');
        req.decoded = decoded
        return next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            const refreshToken = req.cookies['refreshToken'];
            if (!refreshToken) {
                return res.status(401).send('Refresh token missing');
            }
            try {
                const { id } = verifyToken(refreshToken, 'refresh') as { id: mongoose.ObjectId };
                const newAccessToken = generateAccessToken(id);
                res.setHeader('Authorization',  `Bearer ${newAccessToken}`);
                // Add new access token to request headers
                req.headers.authorization =  `Bearer ${newAccessToken}`;
                // Retry the original request with the new token
                req.headers.authorization =  `Bearer ${newAccessToken}`;
                return next();
            } catch (error) {
                console.error('Refresh token verification failed:', error);
                return res.status(401).send('Invalid refresh token');
            }
        } else {
            res.status(400).send('Invalid Token');
        }
        console.log(error)
    }
};

export default authenticateJWT;