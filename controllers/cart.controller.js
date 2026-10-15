const mongoose = require('mongoose');
const Product = require('../models/product.model');

const cartResponse = async (user) => {
  await user.populate({ path: 'cart.product', select: 'name price category image stock' });
  return user.cart;
};

const addToCart = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const item = req.user.cart.find((cartItem) => cartItem.product.toString() === productId);
    const quantity = item ? item.quantity + 1 : 1;

    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: 'Requested quantity exceeds stock' });
    }

    if (item) {
      item.quantity = quantity;
    } else {
      req.user.cart.push({ product: productId, quantity: 1 });
    }

    await req.user.save();
    const cart = await cartResponse(req.user);
    return res.status(200).json({ success: true, message: 'Cart updated', cart });
  } catch {
    return res.status(500).json({ success: false, message: 'Could not update cart' });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await cartResponse(req.user);
    return res.status(200).json({ success: true, cart });
  } catch {
    return res.status(500).json({ success: false, message: 'Could not load cart' });
  }
};

const updateCartQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const item = req.user.cart.find((cartItem) => cartItem.product.toString() === productId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Product not in cart' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: 'Requested quantity exceeds stock' });
    }

    item.quantity = quantity;
    await req.user.save();
    const cart = await cartResponse(req.user);
    return res.status(200).json({ success: true, message: 'Cart updated', cart });
  } catch {
    return res.status(500).json({ success: false, message: 'Could not update cart' });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  const index = req.user.cart.findIndex((cartItem) => cartItem.product.toString() === productId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not in cart' });
  }

  req.user.cart.splice(index, 1);
  await req.user.save();
  const cart = await cartResponse(req.user);
  return res.status(200).json({ success: true, message: 'Product removed from cart', cart });
};

module.exports = { addToCart, getCart, updateCartQuantity, removeFromCart };
