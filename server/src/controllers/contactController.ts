import { Request, Response, NextFunction } from 'express';
import ContactMessage from '../models/ContactMessage';

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, message } = req.body;

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      message,
    });

    res.status(201).json({ message: 'Message sent successfully', contactMessage });
  } catch (error) {
    next(error);
  }
};
