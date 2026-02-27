const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const StudyPlan = require('../models/StudyPlan');

// Get latest study plan for user
router.get('/', protect, async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(plan || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;