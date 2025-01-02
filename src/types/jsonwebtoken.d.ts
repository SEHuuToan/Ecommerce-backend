import mongoose from 'mongoose';
declare module 'jsonwebtoken' {
    export interface JwtPayload {
      id: mongoose.ObjectId;
      role: 'user' | 'admin';
    }
  
    export function sign(payload: object, secretOrPrivateKey: string, options?: jwt.SignOptions): string;
    export function verify(token: string, secretOrPublicKey: string, options?: jwt.VerifyOptions): JwtPayload;
  }
  