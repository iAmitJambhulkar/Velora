"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = exports.updateOrderStatus = exports.getAllOrders = exports.downloadInvoice = exports.generateInvoiceHtml = exports.getOrderById = exports.getMyOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const Coupon_1 = __importDefault(require("../models/Coupon"));
const mailer_1 = require("../utils/mailer");
const createOrder = async (req, res) => {
    const { products, shippingAddress, paymentMethod, couponCode, guestDetails } = req.body;
    try {
        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, message: 'No products in order' });
        }
        let subtotal = 0;
        const orderItems = [];
        // Verify stock and price from DB
        for (const item of products) {
            const dbProduct = await Product_1.default.findById(item.product);
            if (!dbProduct) {
                return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
            }
            if (dbProduct.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${dbProduct.title}` });
            }
            // Deduct stock
            dbProduct.stock -= item.quantity;
            await dbProduct.save();
            const itemPrice = dbProduct.salePrice || dbProduct.price;
            subtotal += itemPrice * item.quantity;
            orderItems.push({
                product: dbProduct._id,
                title: dbProduct.title,
                quantity: item.quantity,
                price: itemPrice,
                image: dbProduct.images[0] || 'placeholder.jpg'
            });
        }
        let discount = 0;
        if (couponCode) {
            const coupon = await Coupon_1.default.findOne({ code: couponCode.toUpperCase(), isActive: true });
            if (coupon) {
                // Verify expiry
                if (!coupon.expiryDate || new Date(coupon.expiryDate) > new Date()) {
                    if (subtotal >= coupon.minOrderValue) {
                        if (coupon.discountType === 'Percentage') {
                            discount = (subtotal * coupon.discountValue) / 100;
                        }
                        else {
                            discount = coupon.discountValue;
                        }
                    }
                }
            }
        }
        const shippingFee = subtotal > 1500 ? 0 : 99;
        const total = Math.max(0, subtotal - discount + shippingFee);
        const order = new Order_1.default({
            user: req.user ? req.user._id : undefined,
            guestDetails: req.user ? undefined : guestDetails,
            products: orderItems,
            shippingAddress,
            paymentMethod,
            paymentStatus: 'Pending',
            paymentId: undefined,
            orderStatus: 'Pending',
            subtotal,
            discount,
            total,
            couponUsed: couponCode ? couponCode.toUpperCase() : undefined
        });
        await order.save();
        // Asynchronously dispatch the email invoice to not block Checkout API response
        const customerEmail = req.user ? req.user.email : (guestDetails?.email || shippingAddress?.email);
        if (customerEmail) {
            const invoiceHtml = (0, exports.generateInvoiceHtml)(order);
            (0, mailer_1.sendInvoiceEmail)(customerEmail, order, invoiceHtml).catch((err) => {
                console.error('Asynchronous email dispatch failed:', err);
            });
        }
        res.status(201).json({ success: true, data: order });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyOrders = getMyOrders;
const getOrderById = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, data: order });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getOrderById = getOrderById;
const generateInvoiceHtml = (order) => {
    return `
    <html>
      <head>
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #1E1E1E; background-color: #F5F1EB; }
          .header { border-bottom: 2px solid #D6C3A5; padding-bottom: 20px; margin-bottom: 20px; }
          .title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: bold; color: #4F6D5A; }
          .details { margin-bottom: 30px; display: flex; justify-content: space-between; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { border-bottom: 1px solid #D6C3A5; padding: 10px; text-align: left; background: rgba(79, 109, 90, 0.1); }
          td { padding: 12px 10px; border-bottom: 1px dashed #D6C3A5; }
          .total-section { text-align: right; font-size: 16px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">VELORA</div>
          <p>Invoice for Order #${order._id}</p>
          <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="details">
          <div>
            <strong>Billed To:</strong><br/>
            ${order.shippingAddress.name || 'Customer'}<br/>
            ${order.shippingAddress.street}, ${order.shippingAddress.city}<br/>
            ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}
          </div>
          <div>
            <strong>Payment Mode:</strong> ${order.paymentMethod}<br/>
            <strong>Status:</strong> ${order.paymentStatus}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.products.map((p) => `
              <tr>
                <td>${p.title}</td>
                <td>₹${p.price}</td>
                <td>${p.quantity}</td>
                <td>₹${p.price * p.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total-section">
          <p>Subtotal: <strong>₹${order.subtotal}</strong></p>
          <p>Discount Applied: <strong>-₹${order.discount}</strong></p>
          <p>Shipping Fee: <strong>${order.subtotal > 1500 ? 'FREE' : `₹99`}</strong></p>
          <p style="font-size: 20px; color: #4F6D5A;">Total: <strong>₹${order.total}</strong></p>
        </div>
      </body>
    </html>
  `;
};
exports.generateInvoiceHtml = generateInvoiceHtml;
const downloadInvoice = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        const invoiceHtml = (0, exports.generateInvoiceHtml)(order);
        res.setHeader('Content-Type', 'text/html');
        res.send(invoiceHtml);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.downloadInvoice = downloadInvoice;
// Admin handlers
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (req, res) => {
    const { orderStatus } = req.body;
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        order.orderStatus = orderStatus;
        if (orderStatus === 'Delivered') {
            order.paymentStatus = 'Completed';
        }
        await order.save();
        res.json({ success: true, data: order });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const getAnalytics = async (req, res) => {
    try {
        const totalOrders = await Order_1.default.countDocuments({});
        const orders = await Order_1.default.find({});
        let totalRevenue = 0;
        let pendingFulfillment = 0;
        orders.forEach(o => {
            if (o.paymentStatus === 'Completed' || o.paymentMethod === 'COD') {
                if (o.orderStatus !== 'Cancelled') {
                    totalRevenue += o.total;
                }
            }
            if (o.orderStatus === 'Pending' || o.orderStatus === 'Processing') {
                pendingFulfillment++;
            }
        });
        const productsCount = await Product_1.default.countDocuments({});
        const lowStockProducts = await Product_1.default.find({ stock: { $lte: 5 } }).select('title stock');
        res.json({
            success: true,
            data: {
                totalOrders,
                totalRevenue,
                pendingFulfillment,
                productsCount,
                lowStockProducts
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAnalytics = getAnalytics;
