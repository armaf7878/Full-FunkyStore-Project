const express = require('express');
const router = express.Router();
const UserController = require('../app/controller/UserController');

router.get('/showall', UserController.showall);
router.post('/create', UserController.create);
router.post('/login', UserController.login);
module.exports = router;