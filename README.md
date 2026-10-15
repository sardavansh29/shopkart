auth, product catalogue, cart, wishlist, and Razorpay payments.

Tech Stack
Frontend — React 19, React Router, Vite

Backend — Node.js, Express

Database — MongoDB with Mongoose

Auth — JWT in HTTP-only cookies

Payments — Razorpay

Getting Started
Clone the repo



git clone https://github.com/sardavansh29/shopkart.git
cd shopkart
Create a .env file in the root folder (refer to .env.example)



PORT=8007
MongoDB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
Install and start the backend



npm install
node index.js
Install and start the frontend



cd frontend
npm install
npm run dev
Open http://localhost:5173 in your browser.

Notes
The .env file is gitignored, do not push it.

Razorpay keys are optional but checkout won't work without them.

For testing payments use card number 4111 1111 1111 1111, any future expiry, any CVV, OTP is 1234.

Frontend is configured to proxy all API calls to the backend on port 8007 so no extra config needed.

