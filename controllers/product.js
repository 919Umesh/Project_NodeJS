
const Product = require('../models/product');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const handleCreateProduct = async (req, res) => {
    try {
        console.log('------sdgd-----');  
         console.log(req.body);  
         console.log(req.file); 
        const { name, salesRate, purchaseRate, quantity, unit, duration, fromDate, toDate } = req.body;
        const productImage = req.file ? req.file.path : null;

        if (!name || !salesRate || !purchaseRate || !quantity || !unit || !duration || !fromDate || !toDate) {
            return res.status(400).json({ status: 400, message: 'All fields required' });
        }

        const newProduct = new Product({
            name,
            salesRate,
            purchaseRate,
            quantity,
            unit,
            duration,
            fromDate,
            toDate,
            productImage
        });

        await newProduct.save();
        res.status(201).json({ status: 201, message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};

const handleGetProducts = async (req, res) => {
    try {
        const products = await Product.find();

        
        const updatedProducts = products.map(product => {
            return {
                ...product._doc, 
                productImage: product.productImage
                    ? `${req.protocol}://${req.get('host')}/${product.productImage.replace(/\\/g, '/')}`
                    : null,
            };
        });

        res.status(200).json({
            status: 200,
            message: 'Products retrieved successfully',
            products: updatedProducts,
        });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({
            status: 500,
            message: 'Server error, please try again later',
        });
    }
};


// Search products
const handleSearchProducts = async (req, res) => {
    try {
        const { name, minSalesRate, maxSalesRate, minPurchaseRate, maxPurchaseRate } = req.query;
        const query = {};

        if (name) query.name = { $regex: name, $options: 'i' };
        if (minSalesRate || maxSalesRate) {
            query.salesRate = {};
            if (minSalesRate) query.salesRate.$gte = parseFloat(minSalesRate);
            if (maxSalesRate) query.salesRate.$lte = parseFloat(maxSalesRate);
        }
        if (minPurchaseRate || maxPurchaseRate) {
            query.purchaseRate = {};
            if (minPurchaseRate) query.purchaseRate.$gte = parseFloat(minPurchaseRate);
            if (maxPurchaseRate) query.purchaseRate.$lte = parseFloat(maxPurchaseRate);
        }

        const products = await Product.find(query);
        res.status(200).json({ status: 200, message: 'Products retrieved successfully', products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};

module.exports = { handleCreateProduct, handleGetProducts, handleSearchProducts };
