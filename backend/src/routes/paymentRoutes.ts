import express from 'express';
import {
  initiatePayment,
  verifyPaymentSignature,
  handleRazorpayWebhook
} from '../controllers/paymentController';

const router = express.Router();

router.post('/initiate', initiatePayment);
router.post('/verify', verifyPaymentSignature);
router.post('/webhook', handleRazorpayWebhook);

export default router;
