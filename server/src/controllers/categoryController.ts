import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.json({ categories });
  } catch (error) {
    next(error);
  }
};
