const mongoose = require('mongoose');

const StudyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  generatedPlan: { type: String }, // AI-generated text
  weakTopics: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);