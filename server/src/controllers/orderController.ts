import { Request, Response, NextFunction } from 'express';
import Order, { OrderStatus } from '../models/Order';
import Product from '../models/Product';
import { AppError } from '../middleware/errorHandler';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { items, guestName, guestPhone, deliveryType, address, notes, paymentMethod, mpesaCode } = req.body;

    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }
      subtotal += product.pricePerKg * item.quantityKg;
    }

    const deliveryFee = deliveryType === 'pickup' ? 0 : 150;
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      userId: userId || undefined,
      guestName: userId ? undefined : guestName,
      guestPhone: userId ? undefined : guestPhone,
      items: items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        pricePerKg: item.pricePerKg,
        quantityKg: item.quantityKg,
        subtotal: item.pricePerKg * item.quantityKg,
      })),
      total,
      status: OrderStatus.PENDING,
      paymentMethod,
      paymentVerified: paymentMethod !== 'MPESA',
      mpesaCode: paymentMethod === 'MPESA' ? mpesaCode : undefined,
      deliveryType,
      address: deliveryType === 'delivery' ? address : undefined,
      notes,
    });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, search } = req.query;
    const filter: any = {};

    if (status && status !== 'ALL') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { guestName: { $regex: search as string, $options: 'i' } },
        { guestPhone: { $regex: search as string, $options: 'i' } },
        { mpesaCode: { $regex: search as string, $options: 'i' } },
      ];
    }

    const orders = await Order.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    const order = await Order.findById(id);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (userRole !== 'ADMIN' && order.userId?.toString() !== userId) {
      throw new AppError('Access denied', 403);
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { mpesaCode } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      {
        paymentVerified: true,
        mpesaCode,
        status: OrderStatus.CONFIRMED,
      },
      { new: true }
    );

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
};
