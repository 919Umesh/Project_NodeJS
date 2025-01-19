const express = require('express');
const multer = require('multer');
const { handleCreateProduct, handleGetProducts, handleSearchProducts } = require('../controllers/product');

const router = express.Router();

// Setup file storage using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Routes
// Make sure to use the upload middleware before the controller logic
router.post('/create', upload.single('productImage'), handleCreateProduct);
router.get('/get', handleGetProducts);
router.get('/search', handleSearchProducts);

module.exports = router;
