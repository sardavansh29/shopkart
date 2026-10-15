ShopKart
A full stack e-commerce app I built to learn how backend development works in practice. It has user auth, a product catalogue, cart, wishlist, and Razorpay payment integration.

The backend is built with Node.js and Express, data is stored in MongoDB Atlas, and the frontend is React with Vite.

Tech Stack
Frontend — React 19, React Router v7, Vite
Backend — Node.js, Express
Database — MongoDB with Mongoose
Auth — JWT stored in HTTP-only cookies
Payments — Razorpay
Password hashing — bcrypt
Features
Register and login with JWT auth
Browse products, search by name, filter by category
Add products to cart and manage quantities
Wishlist functionality
Checkout with Razorpay payment gateway
Signature verification on the backend after payment
Order history page
Project Structure


├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── context/
│       └── services/
├── index.js
└── .env.example
Getting Started
1. Clone the repo
bash


git clone https://github.com/sardavansh29/shopkart.git
cd shopkart
2. Setup environment variables
Create a .env file in the root folder. You can use .env.example as a reference.



PORT=8007
MongoDB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
3. Install and run the backend
bash


npm install
node index.js
4. Install and run the frontend
bash


cd frontend
npm install
npm run dev
Frontend runs at http://localhost:5173. The Vite dev server is already configured to proxy API requests to the backend at port 8007, so you don't need to change anything.

API Routes
Customers

POST /customers/register
POST /customers/login
GET /customers/me — requires auth
POST /customers/logout
Products

GET /products — supports ?search= and ?category= query params
GET /products/:id
POST /products
Cart — all require auth

POST /cart/:productId
GET /cart
PATCH /cart/:productId
DELETE /cart/:productId
Wishlist — all require auth

POST /wishlist/:productId
GET /wishlist
DELETE /wishlist/:productId
Orders — all require auth

POST /orders/create-payment-order
POST /orders/verify-payment
GET /orders
GET /orders/:id
Testing Payments
Use Razorpay's test mode. When the payment popup opens, use card number 4111 1111 1111 1111 with any future expiry and CVV. OTP is 1234.
