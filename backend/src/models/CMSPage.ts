import mongoose, { Schema, Document } from 'mongoose';

export interface ICMSPage extends Document {
  pageKey: string; // e.g., 'home', 'about', 'ingredients'
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: Date;
}

const CMSPageSchema = new Schema<ICMSPage>({
  pageKey: { type: String, required: true, unique: true, lowercase: true, trim: true },
  title: { type: String, required: true },
  seoTitle: { type: String },
  seoDescription: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.CMSPage || mongoose.model<ICMSPage>('CMSPage', CMSPageSchema);
