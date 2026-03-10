const express = require('express');
const router = express.Router();
const OrderController = require('../app/controller/OrderController');
const VerifiedAccount = require('../app/middleware/VerifiedAccount');

router.post('/create', VerifiedAccount.verifyToken, OrderController.create);

module.exports = router