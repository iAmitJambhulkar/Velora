import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Coupon from '../models/Coupon';
import { AuthRequest } from '../middleware/auth';
import { sendInvoiceEmail } from '../utils/mailer';

export const createOrder = async (req: AuthRequest, res: Response) => {
  const {
    products,
    shippingAddress,
    paymentMethod,
    couponCode,
    guestDetails
  } = req.body;

  try {
    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'No products in order' });
    }

    let subtotal = 0;
    const orderItems = [];

    // Verify stock and price from DB
    for (const item of products) {
      const dbProduct = await Product.findById(item.product);
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
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        // Verify expiry
        if (!coupon.expiryDate || new Date(coupon.expiryDate) > new Date()) {
          if (subtotal >= coupon.minOrderValue) {
            if (coupon.discountType === 'Percentage') {
              discount = (subtotal * coupon.discountValue) / 100;
            } else {
              discount = coupon.discountValue;
            }
          }
        }
      }
    }

    const shippingFee = subtotal > 1500 ? 0 : 99;
    const total = Math.max(0, subtotal - discount + shippingFee);

    const order = new Order({
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
      const invoiceHtml = generateInvoiceHtml(order);
      sendInvoiceEmail(customerEmail, order, invoiceHtml).catch((err) => {
        console.error('Asynchronous email dispatch failed:', err);
      });
    }

    res.status(201).json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateInvoiceHtml = (order: any): string => {
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
            ${order.products.map((p: any) => `
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

export const downloadInvoice = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const invoiceHtml = generateInvoiceHtml(order);

    res.setHeader('Content-Type', 'text/html');
    res.send(invoiceHtml);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin handlers
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { orderStatus } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered') {
      order.paymentStatus = 'Completed';
    }
    await order.save();

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const orders = await Order.find({});
    
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

    const productsCount = await Product.countDocuments({});
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select('title stock');

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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
