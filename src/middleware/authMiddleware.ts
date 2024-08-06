import { Request, Response, NextFunction } from 'express';
import { verifyToken, generateAccessToken, } from '../utils/authUtils';
import { TokenExpiredError } from 'jsonwebtoken';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send('Access Denied');
    }
    try {
        const decoded = verifyToken(token, 'access');
        req.body.decoded = decoded;
        return next();
    }
    catch (error) {
        if (error.name === TokenExpiredError.name) {
            const refreshToken = req.cookies['refreshToken'];
            if (!refreshToken) {
                return res.status(401).send('Refresh token missing');
            }
            try {
                const { username } = verifyToken(refreshToken, 'refresh') as { username: string };
                const newAccessToken = generateAccessToken(username);
                res.setHeader('Authorization', newAccessToken);
                // Add new access token to request headers
                req.headers.authorization = newAccessToken;
                // Retry the original request with the new token
                req.headers.authorization = newAccessToken;
                return next();
            } catch (error) {
                return res.status(401).send('Invalid refresh token');
            }
        } else {
            res.status(400).send('Invalid Token');
        }
        console.log(error)
    }
};

export default authenticateJWT;