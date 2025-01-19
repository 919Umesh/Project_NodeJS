// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    salesRate: {
        type: Number,
        required: true
    },
    purchaseRate: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
