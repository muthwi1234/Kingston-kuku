import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  pricePerKg: number;
  imageUrl?: string;
  categoryId: mongoose.Types.ObjectId;
  stockKg: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    pricePerKg: { type: Number, required: true },
    imageUrl: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    stockKg: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
