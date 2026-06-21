<p align="center">
  <strong>VELORA</strong><br/>
  <em>Premium Self-Care E-Commerce Platform</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Express-4-green?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-8-green?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Razorpay-Integrated-purple" alt="Razorpay" />
</p>

---

**Velora** is a production-ready, full-stack e-commerce platform built for premium self-care products. Designed with Apple-level visual standards and modern D2C conversion optimization, it features a complete checkout flow with Razorpay payment integration, admin dashboard, and CMS capabilities.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Database Seeding](#database-seeding)
- [Features](#features)
- [API Reference](#api-reference)
- [Payment Integration](#payment-integration)
- [Testing Payments](#testing-payments)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Tech Stack

| Layer       | Technology                                              |
| ----------- | ------------------------------------------------------- |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand, Framer Motion, Lucide Icons |
| **Backend**  | Node.js, Express 4, TypeScript, Mongoose, JWT, Razorpay SDK |
| **Database** | MongoDB (Mongoose ODM)                                  |
| **Payments** | Razorpay (UPI, Cards, NetBanking, Wallets, COD)         |
| **Email**    | Nodemailer (SMTP — Gmail, SendGrid, Mailgun, AWS SES)   |

---

## Project Structure

```
velora/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.ts     # Register, login, profile
│   │   │   ├── cmsController.ts      # CMS page & section management
│   │   │   ├── couponController.ts   # Coupon validation & management
│   │   │   ├── orderController.ts    # Checkout, order history, admin
│   │   │   ├── paymentController.ts  # Razorpay initiate, verify, webhook
│   │   │   ├── productController.ts  # CRUD, filtering, pagination
│   │   │   ├── reviewController.ts   # Product reviews
│   │   │   └── searchController.ts   # Full-text product search
│   │   ├── middleware/
│   │   │   └── auth.ts               # JWT authentication guard
│   │   ├── models/
│   │   │   ├── CMSPage.ts            # CMS page schema
│   │   │   ├── CMSSection.ts         # CMS section schema
│   │   │   ├── Coupon.ts             # Coupon schema
│   │   │   ├── Order.ts              # Order schema
│   │   │   ├── Product.ts            # Product schema
│   │   │   ├── Review.ts             # Review schema
│   │   │   └── User.ts               # User schema
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── cmsRoutes.ts
│   │   │   ├── couponRoutes.ts
│   │   │   ├── orderRoutes.ts
│   │   │   ├── paymentRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   ├── reviewRoutes.ts
│   │   │   └── searchRoutes.ts
│   │   ├── utils/
│   │   │   ├── mailer.ts             # Email service (invoice emails)
│   │   │   └── seed.ts               # Database seeder
│   │   └── index.ts                  # Express server entry point
│   ├── .env                          # Environment variables (do NOT commit)
│   ├── .env.example                  # Template for environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── about/                # About page
│   │   │   ├── admin/                # Admin dashboard
│   │   │   ├── blog/                 # Blog pages
│   │   │   ├── checkout/             # Checkout + success page
│   │   │   ├── compare/              # Product comparison
│   │   │   ├── contact/              # Contact page
│   │   │   ├── dashboard/            # User dashboard (orders)
│   │   │   ├── faq/                  # FAQ page
│   │   │   ├── ingredients/          # Ingredients info
│   │   │   ├── login/                # Login page
│   │   │   ├── privacy-policy/       # Privacy policy
│   │   │   ├── product/              # Product detail pages
│   │   │   ├── quiz/                 # Self-care quiz
│   │   │   ├── register/             # Registration page
│   │   │   ├── shop/                 # Shop with filters
│   │   │   ├── terms-of-service/     # Terms page
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── globals.css           # Global styles
│   │   │   └── sitemap.ts            # Dynamic sitemap
│   │   ├── components/
│   │   │   ├── CartDrawer.tsx        # Slide-out cart panel
│   │   │   ├── CommandMenu.tsx       # ⌘K command palette
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ProductCard.tsx       # Product card component
│   │   │   ├── RouteGuard.tsx        # Auth route protection
│   │   │   ├── StoreInitializer.tsx  # Zustand hydration
│   │   │   └── ToastContainer.tsx    # Toast notifications
│   │   ├── constants/
│   │   │   ├── animations.ts         # Framer Motion variants
│   │   │   ├── blogData.ts           # Static blog content
│   │   │   ├── colors.ts             # Design system colors
│   │   │   ├── spacing.ts            # Spacing tokens
│   │   │   └── typography.ts         # Font config
│   │   ├── lib/
│   │   │   └── api.ts                # API client (fetch wrapper)
│   │   └── store/
│   │       ├── authStore.ts          # Auth state (Zustand)
│   │       ├── cartStore.ts          # Cart state (Zustand)
│   │       ├── compareStore.ts       # Compare state (Zustand)
│   │       └── toastStore.ts         # Toast state (Zustand)
│   ├── public/                       # Static assets
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                         # ← You are here
```

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally on `mongodb://localhost:27017`

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Copy the example env file
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your credentials (see [Environment Variables](#environment-variables)).

### 3. Seed the Database

```bash
cd backend
npm run build
npx ts-node-dev --transpile-only src/utils/seed.ts
```

This populates products, users, coupons, reviews, and CMS layouts.

### 4. Start the Servers

**Terminal 1 — Backend (port 5000):**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend (port 3000):**
```bash
cd frontend
npm run dev
```

### 5. Open the App

- **Storefront:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## Environment Variables

Create a `backend/.env` file using `backend/.env.example` as a reference:

```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/velora

# Authentication
JWT_SECRET=your_jwt_secret_here

# Razorpay Payment Gateway
# Get from: https://dashboard.razorpay.com → Settings → API Keys
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYYYY

# Razorpay Webhook (optional but recommended)
RAZORPAY_WEBHOOK_SECRET=whsec_ZZZZZZZZZZZZZZ

# Email / SMTP (optional — for order confirmation emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_digit_app_password
```

> **Note:** Without Razorpay credentials the system runs in **simulated sandbox mode** — no real API calls are made, and a mock payment modal is shown for testing.

---

## Database Seeding

The seed script (`backend/src/utils/seed.ts`) creates:

| Data              | Details                                      |
| ----------------- | -------------------------------------------- |
| **Users**         | `user@velora.com` / `user123` (customer)     |
|                   | `admin@velora.com` / `admin123` (admin)      |
| **Products**      | Full catalog with images, variants, reviews   |
| **Coupons**       | Promotional discount codes                    |
| **Reviews**       | Sample product reviews                        |
| **CMS Layouts**   | Homepage hero, sections, banners              |

---

## Features

### Storefront
- Responsive landing page with hero, featured products, and CMS-driven sections
- Product catalog with category filters, search, and sorting
- Product detail pages with image galleries, reviews, and related products
- Self-care quiz that recommends products
- Product comparison tool
- Blog, FAQ, About, Contact, and legal pages
- ⌘K command palette for quick navigation

### Shopping & Checkout
- Persistent cart with real-time updates (Zustand)
- Slide-out cart drawer with quantity controls
- Coupon code system with server-side validation
- Dynamic shipping calculation (free above ₹1,500)
- Guest checkout (no login required)
- Razorpay payment gateway (UPI, Cards, NetBanking, Wallets)
- Cash on Delivery (COD) option
- Order success page with confirmation details

### User Dashboard
- Order history with status tracking
- Saved profile and addresses
- Authentication (register / login / JWT)

### Admin Dashboard
- Order management (view, update status)
- Revenue analytics
- Product and inventory management

### Security
- HMAC-SHA256 payment signature verification
- Webhook signature validation
- Server-side price and stock validation
- JWT authentication with middleware guards
- Environment variable protection (`.env` not committed)
- CORS configuration

### Email
- Automated order confirmation & invoice emails via SMTP
- HTML invoice generation
- Async dispatch (non-blocking)

---

## API Reference

### Authentication
| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| POST   | `/api/auth/register`        | Register new user     |
| POST   | `/api/auth/login`           | Login, returns JWT    |
| GET    | `/api/auth/profile`         | Get current user      |

### Products
| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| GET    | `/api/products`             | List / filter products|
| GET    | `/api/products/:id`         | Product detail        |

### Search
| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| GET    | `/api/search`               | Full-text search      |

### Cart & Checkout
| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| POST   | `/api/orders/checkout`      | Place order           |
| GET    | `/api/orders/my-orders`     | User order history    |
| GET    | `/api/orders/:id`           | Order details         |
| GET    | `/api/orders/invoice/:id`   | Download invoice      |

### Payments
| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| POST   | `/api/payments/initiate`    | Create Razorpay order |
| POST   | `/api/payments/verify`      | Verify payment sig    |
| POST   | `/api/payments/webhook`     | Razorpay webhook      |

### Coupons
| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| POST   | `/api/coupons/validate`     | Validate a coupon     |

### Reviews
| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| GET    | `/api/reviews/:productId`   | Get product reviews   |
| POST   | `/api/reviews`              | Submit a review       |

### CMS
| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| GET    | `/api/cms/pages`            | Get CMS pages         |
| GET    | `/api/cms/sections`         | Get CMS sections      |

### Admin
| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| GET    | `/api/orders/admin/all`     | All orders            |
| PUT    | `/api/orders/admin/:id`     | Update order status   |
| GET    | `/api/orders/admin/analytics` | Revenue analytics   |

---

## Payment Integration

### Payment Flow

```
User adds to cart → Checkout page → Place Order
                                        │
                        ┌───────────────┼───────────────┐
                        ▼                               ▼
                   Razorpay                            COD
                        │                          Order created
         POST /api/payments/initiate              (payment pending)
                        │
              Razorpay modal opens
           (UPI / Card / NetBanking / Wallet)
                        │
               User completes payment
                        │
         POST /api/payments/verify
          (HMAC-SHA256 signature check)
                        │
                 Order confirmed
              Email invoice sent (async)
                        │
                  Success page
```

### Webhook (Parallel)

Razorpay sends `payment.captured` / `payment.failed` events to `POST /api/payments/webhook`. The server validates the signature and updates the order if it hasn't already been marked as completed — this handles cases where the user closes the browser before client-side verification.

### Supported Payment Methods

- **Credit / Debit Cards** — Visa, Mastercard, Amex, RuPay
- **UPI** — Google Pay, PhonePe, Paytm, BHIM
- **Net Banking** — All major Indian banks
- **Wallets** — Paytm, PhonePe, Freecharge, Mobikwik
- **Cash on Delivery** — Pay at doorstep

---

## Testing Payments

### Without Credentials (Simulated Mode)

No setup required. The system automatically uses a mock payment modal. Perfect for development.

### With Test Credentials

1. Get test API keys from [Razorpay Dashboard](https://dashboard.razorpay.com/) → Settings → API Keys
2. Add them to `backend/.env`
3. Restart the backend

**Test cards:**

| Scenario   | Card Number              | CVV | Expiry        |
| ---------- | ------------------------ | --- | ------------- |
| ✅ Success | `4111 1111 1111 1111`    | 123 | Any future    |
| ❌ Failure | `4111 1111 1111 1234`    | 123 | Any future    |
| Mastercard | `5555 5555 5555 4444`    | 123 | Any future    |
| Amex       | `3782 822463 10005`      | 123 | Any future    |

### Webhook Testing (Local)

Use a tunneling service to expose your local server:

```bash
# ngrok
ngrok http 5000

# Then set webhook URL in Razorpay Dashboard:
# https://abc123.ngrok.io/api/payments/webhook
# Events: payment.captured, payment.failed
```

---

## Deployment

### Pre-Production Checklist

- [ ] Complete Razorpay KYC verification
- [ ] Switch to **live** API keys (`rzp_live_xxx`)
- [ ] Update webhook URL to your production domain
- [ ] Configure production SMTP for emails
- [ ] Set a strong, unique `JWT_SECRET`
- [ ] Set up SSL / TLS certificate
- [ ] Add error logging (e.g. Sentry)
- [ ] Add rate limiting
- [ ] Test all payment methods with small real transactions
- [ ] Set up MongoDB backups

### Build Commands

```bash
# Backend
cd backend
npm run build        # Compiles TypeScript → dist/
npm start            # Runs dist/index.js

# Frontend
cd frontend
npm run build        # Produces .next/ production build
npm start            # Runs Next.js production server
```

---

## Troubleshooting

| Problem | Solution |
| ------- | -------- |
| `Razorpay credentials not configured` | Expected in dev — system runs in simulated mode. Add real keys to `backend/.env` to enable live payments. |
| Backend fails to start | Make sure MongoDB is running and `MONGO_URI` in `.env` is correct. Run `npm install` first. |
| Payment modal doesn't open | Check browser console for errors. Ensure Razorpay script loads (handled automatically in checkout). |
| Signature verification fails | Confirm `RAZORPAY_KEY_SECRET` matches your dashboard. No extra spaces in `.env`. Restart backend. |
| Webhook not firing | Ensure the URL is publicly accessible. Use ngrok for local dev. Verify the webhook secret matches. |
| `npm install` fails at root | Run `npm install` inside `backend/` and `frontend/` separately — there is no root `package.json`. |

---

## License

This project is proprietary. All rights reserved.
