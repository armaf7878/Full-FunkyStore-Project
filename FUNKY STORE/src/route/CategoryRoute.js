const express = require('express');
const router = express.Router();
const CategoryController = require('../app/controller/CategoryController');

router.get('/showall', CategoryController.showall);
router.post('/create', CategoryController.create);
router.delete('/delete', CategoryController.delete);

module.exports = router;