/**
 * Mastery Score Formula:
 * masteryScore = (correctAnswers / totalQuestions) * 100
 *
 * Rules:
 * < 60  → Weak   → easy difficulty
 * 60-80 → Moderate → medium difficulty
 * > 80  → Mastered → hard difficulty
 */

exports.calculateMastery = (correct, total) => {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
};

exports.getDifficulty = (masteryScore) => {
  if (masteryScore < 60) return 'easy';
  if (masteryScore <= 80) return 'medium';
  return 'hard';
};

exports.getWeakTopics = (progressList) => {
  return progressList
    .filter((p) => p.masteryScore < 60)
    .map((p) => p.topic);
};