import mongoose, { Document, Model, Schema } from 'mongoose';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  MPESA = 'MPESA',
  CASH = 'CASH',
  CARD = 'CARD',
}

export enum DeliveryType {
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP',
}

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  pricePerKg: number;
  quantityKg: number;
  subtotal: number;
}

export interface IOrder extends Document {
  userId?: mongoose.Types.ObjectId;
  guestName?: string;
  guestPhone?: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentVerified: boolean;
  mpesaCode?: string;
  deliveryType: DeliveryType;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true },
  pricePerKg: { type: Number, required: true },
  quantityKg: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    guestName: { type: String },
    guestPhone: { type: String },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: OrderStatus, default: OrderStatus.PENDING },
    paymentMethod: { type: String, enum: PaymentMethod, required: true },
    paymentVerified: { type: Boolean, default: false },
    mpesaCode: { type: String },
    deliveryType: { type: String, enum: DeliveryType, required: true },
    address: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
