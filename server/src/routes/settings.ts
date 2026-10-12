import { Router } from 'express';
import { getAllSettings, updateSetting } from '../controllers/settingsController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllSettings);
router.patch('/:key', authenticate, requireAdmin, updateSetting);

export default router;
