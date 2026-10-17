import { Router } from 'express';
import { getStats, getSalesReport, getCustomers, updateUserRole } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, requireAdmin, getStats);
router.get('/reports/sales', authenticate, requireAdmin, getSalesReport);
router.get('/customers', authenticate, requireAdmin, getCustomers);
router.patch('/users/:id/role', authenticate, requireAdmin, updateUserRole);

export default router;
