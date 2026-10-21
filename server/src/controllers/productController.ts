import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import { AppError } from '../middleware/errorHandler';

const generateSlug = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const ensureUniqueSlug = async (slug: string, excludeId?: string): Promise<string> => {
  let finalSlug = slug;
  let counter = 1;

  while (true) {
    const filter: any = { slug: finalSlug };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const existing = await Product.findOne(filter);
    if (!existing) {
      return finalSlug;
    }

    finalSlug = `${slug}-${counter}`;
    counter++;
  }
};

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
    const { name, description, pricePerKg, imageUrl, categoryId, stockKg } = req.body;

    const slug = generateSlug(name);
    const uniqueSlug = await ensureUniqueSlug(slug);

    const product = await Product.create({
      name,
      slug: uniqueSlug,
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
    const { name, description, pricePerKg, imageUrl, categoryId, stockKg, isActive } = req.body;

    const slug = generateSlug(name);
    const uniqueSlug = await ensureUniqueSlug(slug, Array.isArray(id) ? id[0] : id);

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug: uniqueSlug,
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
