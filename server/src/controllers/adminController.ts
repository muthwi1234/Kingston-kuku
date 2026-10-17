import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { status: { $in: ['CONFIRMED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'PENDING' });
    const lowStockProducts = await Product.countDocuments({ stockKg: { $lt: 20 } });

    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      pendingOrders,
      lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;

    const filter: any = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 });

    const csv = [
      ['Order ID', 'Date', 'Total', 'Status', 'Payment Method', 'Payment Verified'].join(','),
      ...orders.map((order) =>
        [
          order._id,
          order.createdAt.toISOString(),
          order.total,
          order.status,
          order.paymentMethod,
          order.paymentVerified,
        ].join(',')
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=sales-report.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    const customers = users.map((user) => {
      const u = user.toObject ? user.toObject() : user;
      return {
        ...u,
        role: u.role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
      };
    });

    res.json({ customers });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const normalizedRole = role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';

    const user = await User.findByIdAndUpdate(
      id,
      { role: normalizedRole },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      message: 'User role updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: normalizedRole,
      },
    });
  } catch (error) {
    next(error);
  }
};
