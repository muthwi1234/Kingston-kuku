import { Router } from 'express';
import {
  getAllDeliveryZones,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
} from '../controllers/deliveryZoneController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllDeliveryZones);
router.post('/', authenticate, requireAdmin, createDeliveryZone);
router.put('/:id', authenticate, requireAdmin, updateDeliveryZone);
router.delete('/:id', authenticate, requireAdmin, deleteDeliveryZone);

export default router;
