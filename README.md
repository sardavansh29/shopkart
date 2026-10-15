# 🛒 ShopKart — Full Stack E-Commerce App

A full-stack e-commerce web application built with **React**, **Node.js**, **Express**, **MongoDB**, and **Razorpay** for payment processing.

---

## 🚀 Live Features

- 🔐 User Registration & Login (JWT via HTTP-only cookies)
- 🛍️ Product catalogue with search & category filter
- ❤️ Wishlist management
- 🛒 Cart with quantity controls
- 💳 Razorpay payment integration with signature verification
- 📦 Order history and order details
- 🔒 Protected routes with auth middleware

---

## 🗂️ Project Structure

```
ShopKart Backend Project/
├── config/
│   └── razorpay.js          # Razorpay SDK initialisation
├── controllers/
│   ├── customer.controller.js
│   ├── product.controller.js
│   ├── cart.controller.js
│   ├── wishlist.controller.js
│   └── order.controller.js
├── middlewares/
│   └── auth.middleware.js
├── models/
│   ├── customer.model.js
│   ├── product.model.js
│   └── order.model.js
├── routes/
│   ├── customer.routes.js
│   ├── product.routes.js
│   ├── cart.routes.js
│   ├── wishlist.routes.js
│   └── order.routes.js
├── frontend/                # React + Vite frontend
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       ├── context/
│       └── services/
├── index.js                 # Express server entry point
└── .env.example             # Environment variable template
```

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Razorpay account (for payments)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/shopkart.git
cd shopkart
```

---

### 2. Backend Setup

```bash
npm install
```

Create a `.env` file in the root directory:

```env
PORT=8007
MongoDB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend server:

```bash
node index.js
```

You should see:
```
Server Started at port 8007
DB connected
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open your browser at **http://localhost:5173**

> The Vite dev server proxies all API calls (`/customers`, `/products`, `/cart`, `/wishlist`, `/orders`) to `http://localhost:8007` automatically.

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port for the Express server (default: 8007) |
| `MongoDB_URI` | MongoDB connection string (Atlas or local) |
| `JWT_SECRET_KEY` | Secret key for signing JWT tokens |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID (from dashboard) |
| `RAZORPAY_KEY_SECRET` | Razorpay API Key Secret (from dashboard) |

---

## 📡 API Endpoints

### Customer
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/customers/register` | ❌ | Register a new user |
| POST | `/customers/login` | ❌ | Login and receive JWT cookie |
| GET | `/customers/me` | ✅ | Get logged-in user profile |
| POST | `/customers/logout` | ❌ | Logout and clear cookie |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/products` | ❌ | Create a product |
| GET | `/products` | ❌ | Get all products (supports `?search=` & `?category=`) |
| GET | `/products/:id` | ❌ | Get single product |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/cart/:productId` | ✅ | Add item to cart |
| GET | `/cart` | ✅ | View cart |
| PATCH | `/cart/:productId` | ✅ | Update item quantity |
| DELETE | `/cart/:productId` | ✅ | Remove item from cart |

### Wishlist
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/wishlist/:productId` | ✅ | Add to wishlist |
| GET | `/wishlist` | ✅ | View wishlist |
| DELETE | `/wishlist/:productId` | ✅ | Remove from wishlist |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders/create-payment-order` | ✅ | Create Razorpay order |
| POST | `/orders/verify-payment` | ✅ | Verify payment signature |
| GET | `/orders` | ✅ | Get all orders |
| GET | `/orders/:id` | ✅ | Get single order |

---

## 💳 Razorpay Test Payments

Use these test credentials when Razorpay checkout opens:

| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date |
| CVV | Any 3 digits |
| OTP | `1234` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router v7, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Auth | JWT (HTTP-only cookies) |
| Payments | Razorpay |
| Password | bcrypt |

---

## 📸 Screenshots

> Coming soon

---

## 📄 License

MIT
