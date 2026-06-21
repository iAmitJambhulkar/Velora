"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const IngredientSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    percentage: { type: String },
    purpose: { type: String }
});
const UsageGuideSchema = new mongoose_1.Schema({
    morning: { type: String },
    night: { type: String }
});
const ProductSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.default.models.Product || mongoose_1.default.model('Product', ProductSchema);
