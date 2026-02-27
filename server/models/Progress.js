const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  totalQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  masteryScore: { type: Number, default: 0 }, // 0–100
  difficultyLevel: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  lastAttempted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', ProgressSchema);