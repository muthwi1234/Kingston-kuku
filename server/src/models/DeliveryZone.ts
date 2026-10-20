import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDeliveryZone extends Document {
  name: string;
  deliveryFee: number;
  areas: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryZoneSchema = new Schema<IDeliveryZone>(
  {
    name: { type: String, required: true },
    deliveryFee: { type: Number, required: true },
    areas: { type: [String], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const DeliveryZone: Model<IDeliveryZone> = mongoose.models.DeliveryZone || mongoose.model<IDeliveryZone>('DeliveryZone', DeliveryZoneSchema);

export default DeliveryZone;
