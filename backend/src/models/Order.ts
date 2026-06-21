import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderProduct {
  product: mongoose.Types.ObjectId;
  title: string;
  quantity: number;
  price: number;
  image: string;
}

export interface IOrderAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  email?: string;
  name?: string;
}

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId; // Optional for guest checkout
  guestDetails?: {
    name: string;
    email: string;
    phone?: string;
  };
  products: IOrderProduct[];
  shippingAddress: IOrderAddress;
  paymentMethod: 'Razorpay' | 'COD';
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  paymentId?: string;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  subtotal: number;
  discount: number;
  total: number;
  couponUsed?: string;
  createdAt: Date;
}

const OrderProductSchema = new Schema<IOrderProduct>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  image: { type: String, required: true }
});

const OrderAddressSchema = new Schema<IOrderAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  phone: { type: String },
  email: { type: String },
  name: { type: String }
});

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  guestDetails: {
    name: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  products: [OrderProductSchema],
  shippingAddress: { type: OrderAddressSchema, required: true },
  paymentMethod: { type: String, enum: ['Razorpay', 'COD'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  paymentId: { type: String },
  orderStatus: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  couponUsed: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
