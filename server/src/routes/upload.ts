import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Allow admin to upload images
router.post('/', authenticate, requireAdmin, uploadImage);

export default router;
