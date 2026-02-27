const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: String,
  questions: [{ question: String, options: [String], correctAnswer: String }],
  userAnswers: [String],
  score: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);