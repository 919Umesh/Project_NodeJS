// connection.js

const mongoose = require('mongoose');

// Function to connect MongoDB
const connectMongoDB = (url) => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch((err) => {
            console.error("MongoDB connection error:", err);
        });
};

module.exports = { connectMongoDB };
