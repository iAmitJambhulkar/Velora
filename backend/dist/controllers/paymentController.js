"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRazorpayWebhook = exports.verifyPaymentSignature = exports.initiatePayment = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const Order_1 = __importDefault(require("../models/Order"));
const orderController_1 = require("./orderController");
const mailer_1 = require("../utils/mailer");
// Instantiate Razorpay client lazily (only if credentials exist)
const getRazorpayClient = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
        console.log('paymentController.ts: Razorpay credentials not configured. Operating in SIMULATED Checkout mode.');
        return null;
    }
    return new razorpay_1.default({
        key_id: keyId,
        key_secret: keySecret,
    });
};
// Don't initialize at module load - will be called per request
let rzp;
// 1. Initiate Payment Order inside Razorpay
const initiatePayment = async (req, res) => {
    try {
        const { amount, receipt } = req.body;
        if (!amount || !receipt) {
            return res.status(400).json({ success: false, message: 'Amount and order receipt fields are required' });
        }
        // Get Razorpay client (will be null if not configured)
        const rzp = getRazorpayClient();
        // Fallback if Razorpay is not configured (simulated local sandbox)
        if (!rzp) {
            return res.json({
                success: true,
                isSimulated: true,
                orderId: 'order_sim_' + Math.random().toString(36).substring(7),
                amount: amount * 100,
                keyId: 'rzp_test_mockkeyid12345'
            });
        }
        const options = {
            amount: Math.round(amount * 100), // convert to Paisa (INR sub-unit)
            currency: 'INR',
            receipt: receipt.toString(),
        };
        const order = await rzp.orders.create(options);
        res.json({
            success: true,
            isSimulated: false,
            orderId: order.id,
            amount: order.amount,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    }
    catch (error) {
        console.error('Razorpay order initiation failed:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.initiatePayment = initiatePayment;
// 2. Verify Client-side Razorpay payment signatures
const verifyPaymentSignature = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
            return res.status(400).json({ success: false, message: 'Missing transaction signature parameters' });
        }
        // 1. Fetch Order from local DB
        const order = await Order_1.default.findById(order_id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Matching order not found' });
        }
        // 2. If simulated sandbox checkout was requested, bypass verification
        if (razorpay_order_id.startsWith('order_sim_')) {
            order.paymentStatus = 'Completed';
            order.paymentId = razorpay_payment_id;
            await order.save();
            return res.json({ success: true, message: 'Simulated payment completed successfully' });
        }
        // 3. Verify signature cryptographically
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return res.status(500).json({ success: false, message: 'Razorpay secret keys are missing on backend configuration' });
        }
        const generated_signature = crypto_1.default
            .createHmac('sha256', secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');
        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature verification failed' });
        }
        // 4. Update order payment status in DB
        order.paymentStatus = 'Completed';
        order.paymentId = razorpay_payment_id;
        await order.save();
        // 5. Asynchronously trigger confirmation email with invoice
        const customerEmail = order.guestDetails?.email || order.shippingAddress?.email;
        if (customerEmail) {
            const invoiceHtml = (0, orderController_1.generateInvoiceHtml)(order);
            (0, mailer_1.sendInvoiceEmail)(customerEmail, order, invoiceHtml).catch((err) => {
                console.error('Post-payment signature verification email failure:', err);
            });
        }
        res.json({ success: true, message: 'Payment verified and captured successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.verifyPaymentSignature = verifyPaymentSignature;
// 3. Webhook listener for async Razorpay capture triggers
const handleRazorpayWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!signature || !webhookSecret) {
            return res.status(400).json({ status: 'missing signature or configuration' });
        }
        // Validate webhook payload signature using HMAC-SHA256
        const shasum = crypto_1.default.createHmac('sha256', webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');
        if (signature !== digest) {
            console.warn('[Razorpay Webhook Warning] Invalid signature spoofing attempt rejected.');
            return res.status(400).json({ status: 'signature mismatch' });
        }
        const event = req.body.event;
        console.log(`[Razorpay Webhook Info] Received payment event: ${event}`);
        if (event === 'payment.captured') {
            const entity = req.body.payload.payment.entity;
            const orderId = entity.receipt; // Custom receipt ID mapped to local Mongo Order ObjectId
            const paymentId = entity.id;
            if (orderId) {
                const order = await Order_1.default.findById(orderId);
                if (order && order.paymentStatus !== 'Completed') {
                    order.paymentStatus = 'Completed';
                    order.paymentId = paymentId;
                    await order.save();
                    console.log(`[Razorpay Webhook Success] Order #${orderId} marked as PAID.`);
                    // Send confirmation email
                    const customerEmail = order.guestDetails?.email || order.shippingAddress?.email;
                    if (customerEmail) {
                        const invoiceHtml = (0, orderController_1.generateInvoiceHtml)(order);
                        (0, mailer_1.sendInvoiceEmail)(customerEmail, order, invoiceHtml).catch((err) => {
                            console.error('Webhook captured post-payment email failure:', err);
                        });
                    }
                }
            }
        }
        res.json({ status: 'ok' });
    }
    catch (error) {
        console.error('Webhook execution failed:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.handleRazorpayWebhook = handleRazorpayWebhook;
