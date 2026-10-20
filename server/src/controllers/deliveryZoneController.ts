import { Request, Response, NextFunction } from 'express';
import DeliveryZone from '../models/DeliveryZone';
import { AppError } from '../middleware/errorHandler';

export const getAllDeliveryZones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const zones = await DeliveryZone.find({ isActive: true }).sort({ deliveryFee: 1 });
    res.json({ zones });
  } catch (error) {
    next(error);
  }
};

export const createDeliveryZone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, deliveryFee, areas } = req.body;

    const zone = await DeliveryZone.create({
      name,
      deliveryFee,
      areas,
    });

    res.status(201).json({ zone });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryZone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, deliveryFee, areas, isActive } = req.body;

    const zone = await DeliveryZone.findByIdAndUpdate(
      id,
      { name, deliveryFee, areas, isActive },
      { new: true }
    );

    if (!zone) {
      throw new AppError('Delivery zone not found', 404);
    }

    res.json({ zone });
  } catch (error) {
    next(error);
  }
};

export const deleteDeliveryZone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await DeliveryZone.findByIdAndDelete(id);

    res.json({ message: 'Delivery zone deleted successfully' });
  } catch (error) {
    next(error);
  }
};
