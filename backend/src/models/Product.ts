import mongoose, { Schema, Document } from 'mongoose';

export interface IIngredient {
  name: string;
  percentage?: string;
  purpose?: string;
}

export interface IUsageGuide {
  morning?: string;
  night?: string;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  category: string;
  concern: string[];
  skinType: string[];
  hairType: string[];
  gender: 'Men' | 'Women' | 'Unisex';
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  beforeAfterImages: string[];
  videoUrl?: string;
  benefits: string[];
  ingredients: IIngredient[];
  description: string;
  usageGuide: IUsageGuide;
  ratings: {
    average: number;
    count: number;
  };
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
}

const IngredientSchema = new Schema<IIngredient>({
  name: { type: String, required: true },
  percentage: { type: String },
  purpose: { type: String }
});

const UsageGuideSchema = new Schema<IUsageGuide>({
  morning: { type: String },
  night: { type: String }
});

const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  category: { type: String, required: true, trim: true },
  concern: [{ type: String }],
  skinType: [{ type: String }],
  hairType: [{ type: String }],
  gender: { type: String, enum: ['Men', 'Women', 'Unisex'], default: 'Unisex' },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  beforeAfterImages: [{ type: String }],
  videoUrl: { type: String },
  benefits: [{ type: String }],
  ingredients: [IngredientSchema],
  description: { type: String, required: true },
  usageGuide: { type: UsageGuideSchema, default: {} },
  ratings: {
    average: { type: Number, default: 5 },
    count: { type: Number, default: 0 }
  },
  featured: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  seoTitle: { type: String },
  seoDescription: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Add database indexes for query performance optimization
ProductSchema.index({ category: 1 });
ProductSchema.index({ concern: 1 });
ProductSchema.index({ featured: 1, bestSeller: 1, newArrival: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
