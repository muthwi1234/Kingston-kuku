import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError('Not authenticated', 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { id: string; email: string; role: string };

    const user = await User.findById(decoded.id).select('email role');

    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    next(new AppError('Not authenticated', 401));
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};
