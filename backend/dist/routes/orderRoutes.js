"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/checkout', auth_1.optionalProtect, orderController_1.createOrder); // Optional JWT for guest checkout support
router.get('/myorders', auth_1.protect, orderController_1.getMyOrders);
router.get('/invoice/:id', orderController_1.downloadInvoice);
router.get('/:id', orderController_1.getOrderById);
// Admin routes
router.get('/admin/list', auth_1.protect, auth_1.admin, orderController_1.getAllOrders);
router.get('/admin/analytics', auth_1.protect, auth_1.admin, orderController_1.getAnalytics);
router.put('/admin/:id/status', auth_1.protect, auth_1.admin, orderController_1.updateOrderStatus);
exports.default = router;
