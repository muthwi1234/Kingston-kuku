import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  verifyPayment,
  markPaymentVerified,
} from '../controllers/orderController';
import { authenticate, requireAdmin, optionalAuthenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, requireAdmin, getAllOrders);
router.post('/', optionalAuthenticate, createOrder);
router.get('/my', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, requireAdmin, updateOrderStatus);
router.patch('/:id/verify-payment', authenticate, requireAdmin, verifyPayment);
router.patch('/:id/payment-verified', authenticate, requireAdmin, markPaymentVerified);

export default router;
