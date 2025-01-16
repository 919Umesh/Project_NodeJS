const express = require('express');
const router = express.Router();
const { getChatHistory } = require('../controllers/chatController');

// Route to get chat history
router.get('/chat_history', getChatHistory);

module.exports = router;
