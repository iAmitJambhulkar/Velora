import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  minOrderValue: number;
  expiryDate?: Date;
  isActive: boolean;
  createdAt: Date;
}

const CouponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['Percentage', 'Fixed'], required: true },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
