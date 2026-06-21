"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const couponRoutes_1 = __importDefault(require("./routes/couponRoutes"));
const cmsRoutes_1 = __importDefault(require("./routes/cmsRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Enable CORS for frontend Next.js dev server (typically 3000)
app.use((0, cors_1.default)({
    origin: '*', // For development flexibility
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Database connection
(0, db_1.connectDB)();
// API Route bindings
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/search', searchRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/coupons', couponRoutes_1.default);
app.use('/api/cms', cmsRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
// Base route
app.get('/', (req, res) => {
    res.json({ message: 'Velora API is running.' });
});
// Start Express Listener
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
