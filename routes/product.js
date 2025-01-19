// routes/product.js
const express = require('express');
const { handleCreateProduct, handleGetProducts, handleSearchProducts } = require('../controllers/product');

const router = express.Router();



// Routes
router.post('/create', handleCreateProduct);
router.get('/get', handleGetProducts);
router.get('/search', handleSearchProducts);

module.exports = router;
