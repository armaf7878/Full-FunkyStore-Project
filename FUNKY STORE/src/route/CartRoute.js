const express = require('express');
const router = express.Router();
const CartController = require('../app/controller/CartController');
const VerifiedAccount = require('../app/middleware/VerifiedAccount');
router.get('/showall', VerifiedAccount.verifyToken, CartController.showall);
router.get('/get-cart', VerifiedAccount.verifyToken, CartController.getCart);
router.post('/add-to-cart', VerifiedAccount.verifyToken, CartController.addCart);
router.put('/update-quantity', VerifiedAccount.verifyToken, CartController.updateQuantity);
router.delete('/delete', VerifiedAccount.verifyToken, CartController.delete);

module.exports = router;