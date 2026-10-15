const mongoose = require('mongoose');
const Product = require('../models/product.model');

const addToWishlist = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const exists = req.user.wishlist.some((id) => id.toString() === productId);

    if (exists) {
      return res.status(409).json({ success: false, message: 'Product already in wishlist' });
    }

    req.user.wishlist.push(productId);
    await req.user.save();
    return res.status(201).json({ success: true, message: 'Product added to wishlist' });
  } catch {
    return res.status(500).json({ success: false, message: 'Could not update wishlist' });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await req.user.populate({ path: 'wishlist', select: 'name price category image stock' });
    return res.status(200).json({ success: true, count: user.wishlist.length, wishlist: user.wishlist });
  } catch {
    return res.status(500).json({ success: false, message: 'Could not load wishlist' });
  }
};

const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  const index = req.user.wishlist.findIndex((id) => id.toString() === productId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not in wishlist' });
  }

  req.user.wishlist.splice(index, 1);
  await req.user.save();
  return res.status(200).json({ success: true, message: 'Product removed from wishlist' });
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };
