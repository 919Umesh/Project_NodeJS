const express = require('express');
const router = express.Router();
const { getChatHistory } = require('../controllers/chatController');

router.get('/chat_history', getChatHistory);

module.exports = router;
