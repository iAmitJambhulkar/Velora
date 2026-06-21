import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  downloadInvoice,
  getAllOrders,
  updateOrderStatus,
  getAnalytics
} from '../controllers/orderController';
import { protect, admin, optionalProtect } from '../middleware/auth';

const router = express.Router();

router.post('/checkout', optionalProtect, createOrder); // Optional JWT for guest checkout support
router.get('/myorders', protect, getMyOrders);
router.get('/invoice/:id', downloadInvoice);
router.get('/:id', getOrderById);

// Admin routes
router.get('/admin/list', protect, admin, getAllOrders);
router.get('/admin/analytics', protect, admin, getAnalytics);
router.put('/admin/:id/status', protect, admin, updateOrderStatus);

export default router;
