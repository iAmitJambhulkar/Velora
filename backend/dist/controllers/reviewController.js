"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.getProductReviews = exports.createReview = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const Product_1 = __importDefault(require("../models/Product"));
const createReview = async (req, res) => {
    const { productId, rating, comment, images } = req.body;
    try {
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const review = new Review_1.default({
            user: req.user._id,
            userName: req.user.name,
            product: productId,
            rating,
            comment,
            images: images || [],
            verifiedPurchase: true // default verified for demo
        });
        await review.save();
        // Recalculate average ratings for the product
        const reviews = await Review_1.default.find({ product: productId });
        const count = reviews.length;
        const sum = reviews.reduce((acc, item) => acc + item.rating, 0);
        const average = count > 0 ? Number((sum / count).toFixed(1)) : 5;
        product.ratings = {
            average,
            count
        };
        await product.save();
        res.status(201).json({ success: true, data: review });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createReview = createReview;
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review_1.default.find({ product: req.params.productId }).sort({ createdAt: -1 });
        res.json({ success: true, data: reviews });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProductReviews = getProductReviews;
const deleteReview = async (req, res) => {
    try {
        const review = await Review_1.default.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
        }
        const productId = review.product;
        await review.deleteOne();
        // Recalculate ratings
        const reviews = await Review_1.default.find({ product: productId });
        const count = reviews.length;
        const sum = reviews.reduce((acc, item) => acc + item.rating, 0);
        const average = count > 0 ? Number((sum / count).toFixed(1)) : 5;
        await Product_1.default.findByIdAndUpdate(productId, {
            ratings: { average, count }
        });
        res.json({ success: true, message: 'Review deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteReview = deleteReview;
