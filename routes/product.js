const express = require('express');
const multer = require('multer');
const { handleCreateProduct, handleGetProducts, handleSearchProducts,handleUpdateProduct } = require('../controllers/product');

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });


router.post('/create', upload.single('productImage'), handleCreateProduct);
router.get('/get', handleGetProducts);
router.get('/search', handleSearchProducts);
router.put('/update/:id', upload.single('productImage'), handleUpdateProduct);  

module.exports = router;
