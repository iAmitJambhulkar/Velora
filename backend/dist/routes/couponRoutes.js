"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const couponController_1 = require("../controllers/couponController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/validate', couponController_1.validateCoupon);
// Admin routes
router.get('/', auth_1.protect, auth_1.admin, couponController_1.getCoupons);
router.post('/', auth_1.protect, auth_1.admin, couponController_1.createCoupon);
router.delete('/:id', auth_1.protect, auth_1.admin, couponController_1.deleteCoupon);
exports.default = router;
