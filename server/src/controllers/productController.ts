import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import { AppError } from '../middleware/errorHandler';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search } = req.query;

    const filter: any = { isActive: true };

    if (category) {
      const cat = await Category.findOne({ slug: category as string });
      if (cat) {
        filter.categoryId = cat._id;
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .populate('categoryId')
      .sort({ name: 1 });

    res.json({ products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('categoryId');

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, description, pricePerKg, imageUrl, categoryId, stockKg } = req.body;

    const product = await Product.create({
      name,
      slug,
      description,
      pricePerKg,
      imageUrl,
      categoryId,
      stockKg,
    });

    await product.populate('categoryId');

    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, slug, description, pricePerKg, imageUrl, categoryId, stockKg, isActive } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description,
        pricePerKg,
        imageUrl,
        categoryId,
        stockKg,
        isActive,
      },
      { new: true }
    ).populate('categoryId');

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
