"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/register', authController_1.registerUser);
router.post('/login', authController_1.loginUser);
router.get('/profile', auth_1.protect, authController_1.getUserProfile);
router.post('/address', auth_1.protect, authController_1.addAddress);
router.delete('/address/:addressId', auth_1.protect, authController_1.deleteAddress);
router.post('/wishlist/toggle', auth_1.protect, authController_1.toggleWishlist);
router.post('/wishlist/merge', auth_1.protect, authController_1.mergeWishlist);
router.get('/admin/users', auth_1.protect, auth_1.admin, authController_1.getAllUsers);
exports.default = router;
