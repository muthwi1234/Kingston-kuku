import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+254\d{9}$/, 'Invalid Kenyan phone number'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().optional(),
  pricePerKg: z.number().positive('Price must be positive'),
  stockKg: z.number().nonnegative('Stock cannot be negative'),
  imageUrl: z.string().url('Invalid image URL'),
  categoryId: z.string().uuid('Invalid category ID'),
  isActive: z.boolean().optional(),
  lowStockThreshold: z.number().optional(),
});

export const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantityKg: z.number().positive('Quantity must be positive'),
    })
  ),
  guestName: z.string().optional(),
  guestPhone: z.string().regex(/^\+254\d{9}$/, 'Invalid Kenyan phone number').optional(),
  deliveryType: z.enum(['delivery', 'pickup']),
  address: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(['MPESA', 'CASH', 'CARD']),
  mpesaCode: z.string().regex(/^[A-Z0-9]{10}$/, 'Invalid M-Pesa code').optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\+254\d{9}$/, 'Invalid Kenyan phone number').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
