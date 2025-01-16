const Message = require('../models/message');

// Controller to get chat history
const getChatHistory = async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });  // Retrieve all messages in order of timestamp
        res.status(200).json({
            status: 200,
            message: 'Chat history fetched successfully',
            data: messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error fetching chat history' });
    }
};

// Controller to save new messages
const saveMessage = async (messageData) => {
    try {
        const newMessage = new Message(messageData);
        await newMessage.save();  // Save the message in the database
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getChatHistory,
    saveMessage
};
