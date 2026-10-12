import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Setting: Model<ISetting> = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);

export default Setting;
