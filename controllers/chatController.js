const Message = require('../models/message');


const getChatHistory = async (req, res) => {
    try {
        const { sender, receiver } = req.query; 

        
        const messages = await Message.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        }).sort({ timestamp: 1 });

        res.status(200).json({
            status: 200,
            message: 'Chat history fetched successfully',
            data: messages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error fetching chat history' });
    }
};


const saveMessage = async (messageData) => {
    try {
        const newMessage = new Message(messageData);
        await newMessage.save();
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    saveMessage,
    getChatHistory,
};
