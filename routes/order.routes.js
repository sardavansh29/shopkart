const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { createPaymentOrder, verifyPayment, getOrders, getOrder } = require('../controllers/order.controller');

const router = express.Router();

router.post('/create-payment-order', authMiddleware, createPaymentOrder);
router.post('/verify-payment', authMiddleware, verifyPayment);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrder);

module.exports = router;
