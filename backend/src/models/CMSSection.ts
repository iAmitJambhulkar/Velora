import mongoose, { Schema, Document } from 'mongoose';

export interface ICMSSection extends Document {
  pageKey: string;     // e.g., 'home'
  sectionKey: string;  // e.g., 'hero', 'spotlight', 'testimonials'
  content: Record<string, any>;
  order: number;
  updatedAt: Date;
}

const CMSSectionSchema = new Schema<ICMSSection>({
  pageKey: { type: String, required: true, lowercase: true, trim: true },
  sectionKey: { type: String, required: true, lowercase: true, trim: true },
  content: { type: Schema.Types.Mixed, required: true },
  order: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index to guarantee uniqueness of section per page
CMSSectionSchema.index({ pageKey: 1, sectionKey: 1 }, { unique: true });

export default mongoose.models.CMSSection || mongoose.model<ICMSSection>('CMSSection', CMSSectionSchema);
