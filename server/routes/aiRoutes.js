const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { chat, generateStudyPlan, explainTopic } = require('../controllers/aiController');

router.post('/chat', protect, chat);
router.post('/studyplan', protect, generateStudyPlan);
router.post('/explain', protect, explainTopic);

module.exports = router;