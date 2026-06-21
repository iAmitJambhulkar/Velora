"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvoiceEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Configure SMTP transport client
const getTransporter = () => {
    const host = process.env.SMTP_HOST || 'smtp.sendgrid.net';
    const port = Number(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    // If no auth details exist, return a dummy mock logger transport
    if (!user || !pass) {
        console.log('mailer.ts: No SMTP credentials found. Falling back to console logger mock mailer.');
        return {
            sendMail: async (options) => {
                console.log(`[MOCK EMAIL DISPATCH] To: ${options.to} | Subject: ${options.subject}`);
                console.log(`[MOCK EMAIL BODY] (HTML snippet omitted for brevity)`);
                return { messageId: 'mock-msg-id-' + Math.random().toString(36).substring(7) };
            }
        };
    }
    return nodemailer_1.default.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for 587
        auth: {
            user,
            pass,
        },
    });
};
const transporter = getTransporter();
const sendInvoiceEmail = async (toEmail, orderDetails, htmlInvoice) => {
    try {
        const fromAddress = process.env.FROM_EMAIL || 'billing@velora.com';
        const orderRef = orderDetails._id.toString().slice(-8).toUpperCase();
        const mailOptions = {
            from: `"Velora Labs" <${fromAddress}>`,
            to: toEmail,
            subject: `Your Velora Order Confirmation - Invoice #${orderRef}`,
            text: `Thank you for your purchase! Your total is ₹${orderDetails.totalAmount}. Attached is your invoice.`,
            html: htmlInvoice,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`Invoice email sent successfully to ${toEmail}. Message ID: ${info.messageId}`);
        return true;
    }
    catch (error) {
        console.error('Failed to dispatch invoice email:', error);
        return false;
    }
};
exports.sendInvoiceEmail = sendInvoiceEmail;
