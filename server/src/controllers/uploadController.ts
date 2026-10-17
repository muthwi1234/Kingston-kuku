import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../middleware/errorHandler';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { image, file } = req.body;
    const dataToUpload = image || file;

    if (!dataToUpload) {
      throw new AppError('No image provided for upload', 400);
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // 1. Upload via Cloudinary API key & secret if configured
    if (cloudName && apiKey && apiSecret) {
      const result = await cloudinary.uploader.upload(dataToUpload, {
        folder: 'kingston_chicken/products',
        resource_type: 'image',
      });
      return res.json({ url: result.secure_url, public_id: result.public_id });
    }

    // 2. Upload via Unsigned preset if preset is configured
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    if (cloudName && uploadPreset) {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: dataToUpload,
          upload_preset: uploadPreset,
        }),
      });

      const cloudData = (await response.json()) as any;
      if (cloudData && cloudData.secure_url) {
        return res.json({ url: cloudData.secure_url, public_id: cloudData.public_id });
      }
    }

    // 3. Fallback: If Cloudinary credentials have not been added to .env yet,
    // return the data URL directly so images still save and display immediately!
    return res.json({ url: dataToUpload });
  } catch (error) {
    next(error);
  }
};
