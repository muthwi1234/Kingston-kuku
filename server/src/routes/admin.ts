import { Router } from 'express';
import { getStats, getSalesReport } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, requireAdmin, getStats);
router.get('/reports/sales', authenticate, requireAdmin, getSalesReport);

export default router;
