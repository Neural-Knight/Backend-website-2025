import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request{
    user?:{userId:number};
}

export const authenticate=(
    req: AuthRequest,
    res: Response,
    next: NextFunction
)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({message:'No token provided'});
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
    return res.status(401).json({ message: 'No token provided' });
    }
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
        userId: number;
    };
    req.user = { userId: decoded.userId };
    next();
    } catch (error:any) {
    return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};
