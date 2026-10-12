import { Request, Response, NextFunction } from 'express';
import Setting from '../models/Setting';
import { AppError } from '../middleware/errorHandler';

export const getAllSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await Setting.find();
    const settingsMap: Record<string, string> = {};
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value;
    });
    res.json({ settings: settingsMap });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );

    res.json({ setting });
  } catch (error) {
    next(error);
  }
};
