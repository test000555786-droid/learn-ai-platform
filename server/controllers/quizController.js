const { generateQuiz } = require('../services/aiService');
const { calculateMastery, getDifficulty } = require('../utils/masteryEngine');
const Progress = require('../models/Progress');
const QuizAttempt = require('../models/QuizAttempt');

exports.getQuiz = async (req, res) => {
  const { topic } = req.params;
  const userId = req.user._id;

  try {
    // Find current difficulty for this topic
    let progress = await Progress.findOne({ userId, topic });
    const difficulty = progress ? getDifficulty(progress.masteryScore) : 'easy';

    const questions = await generateQuiz(topic, difficulty);
    res.json({ questions, difficulty });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  const { topic, questions, userAnswers } = req.body;
  const userId = req.user._id;

  try {
    // Grade quiz
    let correct = 0;
    questions.forEach((q, i) => {
      if (q.correctAnswer === userAnswers[i]) correct++;
    });
    const score = Math.round((correct / questions.length) * 100);

    // Save attempt
    await QuizAttempt.create({ userId, topic, questions, userAnswers: userAnswers, score });

    // Update progress
    let progress = await Progress.findOne({ userId, topic });
    if (!progress) {
      progress = new Progress({ userId, topic });
    }
    progress.totalQuestions += questions.length;
    progress.correctAnswers += correct;
    progress.masteryScore = calculateMastery(progress.correctAnswers, progress.totalQuestions);
    progress.difficultyLevel = getDifficulty(progress.masteryScore);
    progress.lastAttempted = new Date();
    await progress.save();

    res.json({ score, masteryScore: progress.masteryScore, difficulty: progress.difficultyLevel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};