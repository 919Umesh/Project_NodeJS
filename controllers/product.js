
const Product = require('../models/product');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const handleCreateProduct = async (req, res) => {
    try {
    
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

        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        console.log(limit);
        const skip = (page - 1) * limit; 

        const products = await Product.find()
            .skip(skip)
            .limit(limit);
            
        const totalProducts = await Product.countDocuments();
        
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
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                totalItems: totalProducts,
                itemsPerPage: limit,
            },
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

const handleUpdateProduct = async (req, res) => {
    try {
        const { id } = req.params; 
        const updateFields = req.body;
        const productImage = req.file ? req.file.path : null;

        if (productImage) {
            updateFields.productImage = productImage;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ status: 404, message: 'Product not found' });
        }

        res.status(200).json({ status: 200, message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ status: 500, message: 'Server error, please try again later' });
    }
};


module.exports = { handleCreateProduct, handleGetProducts, handleSearchProducts,handleUpdateProduct };
