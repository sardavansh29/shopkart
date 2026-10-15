const mongoose = require('mongoose');
const Product = require('../models/product.model');

const createProduct = async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  if (!name || !description || !category || !image || price === undefined || stock === undefined) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (Number(price) <= 0 || Number(stock) < 0 || Number.isNaN(Number(price)) || Number.isNaN(Number(stock))) {
    return res.status(400).json({ success: false, message: 'Invalid price or stock' });
  }

  try {
    const product = await Product.create({ name, description, price, category, image, stock });
    return res.status(201).json(product);
  } catch {
    return res.status(500).json({ success: false, message: 'Could not create product' });
  }
};

const getProducts = async (req, res) => {
  const { search, category } = req.query;
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (category) {
    query.category = category;
  }

  try {
    const products = await Product.find(query).select('name price category image stock description');
    return res.status(200).json({ success: true, count: products.length, products });
  } catch {
    return res.status(500).json({ success: false, message: 'Could not load products' });
  }
};

const getProduct = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch {
    return res.status(500).json({ success: false, message: 'Could not load product' });
  }
};

module.exports = { createProduct, getProducts, getProduct };
