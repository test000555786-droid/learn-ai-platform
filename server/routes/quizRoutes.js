const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { getQuiz, submitQuiz } = require('../controllers/quizController');

router.get('/:topic', protect, getQuiz);
router.post('/submit', protect, submitQuiz);

module.exports = router;