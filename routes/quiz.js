const express = require('express');
const router = express.Router();
const { createQuestion, createMultipleQuestions, getAllQuestions } = require('../controllers/questionController');

router.post('/create', createQuestion);

router.post('/create-multiple', createMultipleQuestions);


router.get('/questions', getAllQuestions);

module.exports = router;
