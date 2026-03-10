const express = require('express');
const router = express.Router();
const ProductController = require('../app/controller/ProductController');


const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage });


router.get('/showall',  ProductController.showall);
router.post('/create',upload.single('image'),  ProductController.create);
router.delete('/delete',  ProductController.delete);
router.post('/create_variable',  ProductController.create_variable);
router.get('/showall_variable',  ProductController.showall_variable);
router.delete('/delete_variable',  ProductController.delete_variable);
router.get('/variable/:id',  ProductController.get_VariableProduct);     
router.get('/:id',  ProductController.get_product);     
module.exports = router;