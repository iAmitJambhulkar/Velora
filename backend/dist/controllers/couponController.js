"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.createCoupon = exports.getCoupons = exports.validateCoupon = void 0;
const Coupon_1 = __importDefault(require("../models/Coupon"));
const validateCoupon = async (req, res) => {
    const { code, subtotal } = req.body;
    try {
        if (!code) {
            return res.status(400).json({ success: false, message: 'Coupon code is required' });
        }
        const coupon = await Coupon_1.default.findOne({ code: code.toUpperCase(), isActive: true });
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
        }
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({ success: false, message: 'Coupon has expired' });
        }
        if (Number(subtotal) < coupon.minOrderValue) {
            return res.status(400).json({
                success: false,
                message: `Minimum order value for this coupon is ₹${coupon.minOrderValue}`
            });
        }
        res.json({
            success: true,
            data: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.validateCoupon = validateCoupon;
// Admin controllers
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon_1.default.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: coupons });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getCoupons = getCoupons;
const createCoupon = async (req, res) => {
    try {
        const coupon = new Coupon_1.default(req.body);
        await coupon.save();
        res.status(201).json({ success: true, data: coupon });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createCoupon = createCoupon;
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon_1.default.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }
        res.json({ success: true, message: 'Coupon removed successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteCoupon = deleteCoupon;
