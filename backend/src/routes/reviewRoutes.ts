import express from 'express';
import { createReview, getProductReviews, deleteReview } from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);
router.delete('/:id', protect, deleteReview);

export default router;
