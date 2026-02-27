const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const Progress = require('../models/Progress');

router.get('/', protect, async (req, res) => {
  const data = await Progress.find({ userId: req.user._id });
  res.json(data);
});

module.exports = router;