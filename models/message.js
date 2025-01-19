const mongoose = require('mongoose');

// Define schema for a message
const messageSchema = new mongoose.Schema({
    user: { type: String, required: true },  // User identifier (can be username or socket ID)
    message: { type: String, required: true },  // The actual chat message
    timestamp: { type: Date, default: Date.now }  // Timestamp when the message was created
});

// Create a Message model based on the schema
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
