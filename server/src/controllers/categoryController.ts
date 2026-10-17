import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import { AppError } from '../middleware/errorHandler';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let categories = await Category.find().sort({ name: 1 });
    if (!categories || categories.length === 0) {
      categories = await Category.create([
        { name: 'Chicken Cuts & Parts', slug: 'chicken-parts', description: 'Fresh chicken cuts, wings, thighs, and drumsticks' },
        { name: 'Whole Chicken', slug: 'whole-chicken', description: 'Fresh whole and dressed chickens' },
        { name: 'Specialty Cuts & Offal', slug: 'specialty', description: 'Gizzards, livers, and specialty chicken pieces' },
      ]);
    }
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description } = req.body;

    const category = await Category.create({
      name,
      slug,
      description,
    });

    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, description },
      { new: true }
    );

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    res.json({ category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await Category.findByIdAndDelete(id);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
