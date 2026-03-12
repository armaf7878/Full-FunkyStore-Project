const express = require('express');
const router = express.Router();
const OrderController = require('../app/controller/OrderController');
const VerifiedAccount = require('../app/middleware/VerifiedAccount');

router.post('/create', VerifiedAccount.verifyToken, OrderController.create);
router.get('/user/orders', VerifiedAccount.verifyToken, OrderController.getUserOrders);
router.get('/user/:id', VerifiedAccount.verifyToken, OrderController.getUserOrderById);
router.post('/vnpay/create', VerifiedAccount.verifyToken, OrderController.createVNPayPayment);
router.get('/vnpay/callback', OrderController.vnpayCallback);

module.exports = router