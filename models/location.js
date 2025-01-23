const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photos: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;