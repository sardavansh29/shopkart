require('dotenv').config();
const cookieParser = require('cookie-parser');
const router = require('./routes/customer.routes');
const productRoutes = require('./routes/product.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/customers',router)
app.use('/products', productRoutes)
app.use('/wishlist', wishlistRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)

app.listen(process.env.PORT,() =>{
  console.log('Server Started at port 8007');
})
mongoose.connect(process.env.MongoDB_URI).then(() =>{
  console.log('DB connected')
})
.catch((err) =>{
  console.log(err);
})
