const crypto = require('crypto');
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const razorpay = require('../config/razorpay');

const validAddress = (address) => {
  if (!address) {
    return false;
  }

  const fields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];

  if (fields.some((field) => !address[field]?.trim())) {
    return false;
  }

  return /^\d{10}$/.test(address.phone) && /^\d{6}$/.test(address.pincode);
};

const createPaymentOrder = async (req, res) => {
  const { shippingAddress } = req.body;

  if (!validAddress(shippingAddress)) {
    return res.status(400).json({ success: false, message: 'Enter a valid shipping address' });
  }

  if (!req.user.cart.length) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  if (!razorpay) {
    return res.status(500).json({ success: false, message: 'Razorpay is not configured' });
  }

  try {
    const items = [];
    let totalAmount = 0;

    for (const cartItem of req.user.cart) {
      const product = await Product.findById(cartItem.product);

      if (!product) {
        return res.status(404).json({ success: false, message: 'A product in your cart no longer exists' });
      }

      if (cartItem.quantity > product.stock) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image
      });
      totalAmount += product.price * cartItem.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: order._id.toString()
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return res.status(201).json({
      success: true,
      shopKartOrderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Could not create payment order' });
  }
};

const verifyPayment = async (req, res) => {
  const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
    return res.status(400).json({ success: false, message: 'Invalid order ID' });
  }

  try {
    const order = await Order.findOne({ _id: shopKartOrderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ success: false, message: 'Invalid Razorpay order' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const products = [];

    for (const item of order.items) {
      const product = await Product.findById(item.product);

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
      }

      products.push({ product, quantity: item.quantity });
    }

    for (const item of products) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    order.paymentStatus = 'PAID';
    order.status = 'PLACED';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    req.user.cart = [];
    await req.user.save();

    return res.status(200).json({ success: true, message: 'Payment verified', order });
  } catch {
    return res.status(500).json({ success: false, message: 'Could not verify payment' });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch {
    return res.status(500).json({ success: false, message: 'Could not load orders' });
  }
};

const getOrder = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid order ID' });
  }

  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.status(200).json({ success: true, order });
  } catch {
    return res.status(500).json({ success: false, message: 'Could not load order' });
  }
};

module.exports = { createPaymentOrder, verifyPayment, getOrders, getOrder };
