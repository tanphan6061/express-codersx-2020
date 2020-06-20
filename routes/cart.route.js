const express = require('express');
const router = express.Router();
const controller = require('../controllers/cart.controller');

router.get('/add/:bookId', controller.addToCart);

module.exports = router;