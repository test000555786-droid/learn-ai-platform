const aiService = require('../services/aiService');
const Progress = require('../models/Progress');
const StudyPlan = require('../models/StudyPlan');
const { getWeakTopics } = require('../utils/masteryEngine');

exports.chat = async (req, res) => {
  const { message } = req.body;
  try {
    // Basic prompt injection guard
    const cleaned = message.replace(/ignore previous|system prompt|jailbreak/gi, '[removed]');
    const reply = await aiService.solveDoubt(cleaned);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generateStudyPlan = async (req, res) => {
  const userId = req.user._id;
  try {
    const progressList = await Progress.find({ userId });
    const weakTopics = getWeakTopics(progressList);
    const goal = req.user.learningGoal;

    if (weakTopics.length === 0)
      return res.json({ plan: 'Great job! No weak topics detected. Keep practicing hard topics.' });

    const plan = await aiService.generateStudyPlan(weakTopics, goal);
    await StudyPlan.create({ userId, generatedPlan: plan, weakTopics });
    res.json({ plan, weakTopics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.explainTopic = async (req, res) => {
  const { topic } = req.body;
  try {
    const explanation = await aiService.explainTopic(topic);
    res.json({ explanation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};