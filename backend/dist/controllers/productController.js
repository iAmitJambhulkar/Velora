"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySlug = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const getProducts = async (req, res) => {
    try {
        const { category, concern, skinType, hairType, gender, minPrice, maxPrice, rating, sort, featured, bestSeller, newArrival, search, limit = '50', page = '1' } = req.query;
        const query = {};
        if (category)
            query.category = category;
        if (concern)
            query.concern = { $in: Array.isArray(concern) ? concern : [concern] };
        if (skinType)
            query.skinType = { $in: Array.isArray(skinType) ? skinType : [skinType] };
        if (hairType)
            query.hairType = { $in: Array.isArray(hairType) ? hairType : [hairType] };
        if (gender)
            query.gender = gender;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        if (rating)
            query['ratings.average'] = { $gte: Number(rating) };
        if (featured === 'true')
            query.featured = true;
        if (bestSeller === 'true')
            query.bestSeller = true;
        if (newArrival === 'true')
            query.newArrival = true;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'ingredients.name': { $regex: search, $options: 'i' } }
            ];
        }
        let sortOptions = { createdAt: -1 }; // default: newest
        if (sort === 'price_asc')
            sortOptions = { price: 1 };
        else if (sort === 'price_desc')
            sortOptions = { price: -1 };
        else if (sort === 'rating')
            sortOptions = { 'ratings.average': -1 };
        else if (sort === 'popularity')
            sortOptions = { 'ratings.count': -1 };
        const itemsPerPage = Number(limit);
        const currentPage = Number(page);
        const skip = (currentPage - 1) * itemsPerPage;
        const total = await Product_1.default.countDocuments(query);
        const products = await Product_1.default.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(itemsPerPage);
        res.json({
            success: true,
            data: products,
            pagination: {
                total,
                page: currentPage,
                pages: Math.ceil(total / itemsPerPage),
                limit: itemsPerPage
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProducts = getProducts;
const getProductBySlug = async (req, res) => {
    try {
        const product = await Product_1.default.findOne({ slug: req.params.slug });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getProductBySlug = getProductBySlug;
// Admin handlers
const createProduct = async (req, res) => {
    try {
        const product = new Product_1.default(req.body);
        if (!product.slug && product.title) {
            product.slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        await product.save();
        res.status(201).json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product removed successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteProduct = deleteProduct;
