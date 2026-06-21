import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

export const createReview = async (req: AuthRequest, res: Response) => {
  const { productId, rating, comment, images } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = new Review({
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
    const reviews = await Review.find({ product: productId });
    const count = reviews.length;
    const sum = reviews.reduce((acc, item) => acc + item.rating, 0);
    const average = count > 0 ? Number((sum / count).toFixed(1)) : 5;

    product.ratings = {
      average,
      count
    };
    await product.save();

    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate ratings
    const reviews = await Review.find({ product: productId });
    const count = reviews.length;
    const sum = reviews.reduce((acc, item) => acc + item.rating, 0);
    const average = count > 0 ? Number((sum / count).toFixed(1)) : 5;

    await Product.findByIdAndUpdate(productId, {
      ratings: { average, count }
    });

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
