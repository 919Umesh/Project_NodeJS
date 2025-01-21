
const Question = require('../models/question');


const createQuestion = async (req, res) => {
    try {
        const { question, options } = req.body;

        if (!question || !options || options.length !== 4) {
            return res.status(400).json({
                status: 400,
                message: "Question and exactly 4 options are required"
            });
        }

        
        const correctAnswers = options.filter(opt => opt.isCorrect).length;
        if (correctAnswers !== 1) {
            return res.status(400).json({
                status: 400,
                message: "Exactly one correct answer must be specified"
            });
        }

        const newQuestion = new Question({
            question,
            options
        });

        await newQuestion.save();

        res.status(201).json({
            status: 201,
            message: 'Question created successfully',
            question: newQuestion
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error' });
    }
};


const createMultipleQuestions = async (req, res) => {
    try {
        const { questions } = req.body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Questions array is required"
            });
        }

        
        for (let q of questions) {
            if (!q.question || !q.options || q.options.length !== 4) {
                return res.status(400).json({
                    status: 400,
                    message: "Each question must have a question text and exactly 4 options"
                });
            }

            const correctAnswers = q.options.filter(opt => opt.isCorrect).length;
            if (correctAnswers !== 1) {
                return res.status(400).json({
                    status: 400,
                    message: "Each question must have exactly one correct answer"
                });
            }
        }

        const createdQuestions = await Question.insertMany(questions);

        res.status(201).json({
            status: 201,
            message: 'Questions created successfully',
            questions: createdQuestions
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error' });
    }
};


const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });

        if (questions.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No questions found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Questions retrieved successfully',
            questions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error' });
    }
};

module.exports = {
    createQuestion,
    createMultipleQuestions,
    getAllQuestions
};
