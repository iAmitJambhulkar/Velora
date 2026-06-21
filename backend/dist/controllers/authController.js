"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.mergeWishlist = exports.toggleWishlist = exports.deleteAddress = exports.addAddress = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'velora_jwt_secret_token_key_987654321', {
        expiresIn: '30d'
    });
};
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await User_1.default.create({
            name,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString())
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password, guestWishlist } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        // Merge wishlist if guestWishlist is provided
        if (Array.isArray(guestWishlist) && guestWishlist.length > 0) {
            const mergedWishlist = Array.from(new Set([
                ...user.wishlist.map((id) => id.toString()),
                ...guestWishlist.filter((id) => id.match(/^[0-9a-fA-F]{24}$/))
            ]));
            user.wishlist = mergedWishlist;
            await user.save();
        }
        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                addresses: user.addresses,
                wishlist: user.wishlist,
                token: generateToken(user._id.toString())
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.loginUser = loginUser;
const getUserProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUserProfile = getUserProfile;
const addAddress = async (req, res) => {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    try {
        const user = await User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (isDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }
        user.addresses.push({ street, city, state, zipCode, country, isDefault });
        await user.save();
        res.json({ success: true, data: user.addresses });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.addAddress = addAddress;
const deleteAddress = async (req, res) => {
    const { addressId } = req.params;
    try {
        const user = await User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.addresses = user.addresses.filter((addr) => addr._id.toString() !== addressId);
        await user.save();
        res.json({ success: true, data: user.addresses });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteAddress = deleteAddress;
const toggleWishlist = async (req, res) => {
    const { productId } = req.body;
    try {
        const user = await User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const index = user.wishlist.indexOf(productId);
        if (index >= 0) {
            user.wishlist.splice(index, 1); // remove
        }
        else {
            user.wishlist.push(productId); // add
        }
        await user.save();
        res.json({ success: true, data: user.wishlist });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.toggleWishlist = toggleWishlist;
const mergeWishlist = async (req, res) => {
    const { wishlist } = req.body; // array of product IDs
    try {
        const user = await User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (Array.isArray(wishlist)) {
            const merged = Array.from(new Set([
                ...user.wishlist.map((id) => id.toString()),
                ...wishlist.filter((id) => id.match(/^[0-9a-fA-F]{24}$/))
            ]));
            user.wishlist = merged;
            await user.save();
        }
        res.json({ success: true, data: user.wishlist });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.mergeWishlist = mergeWishlist;
// Admin route
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.default.find({}).select('-password');
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllUsers = getAllUsers;
