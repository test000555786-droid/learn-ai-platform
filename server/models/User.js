const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  learningGoal: { type: String, default: '' },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Fix: no `next` parameter for async pre-save in modern Mongoose
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', UserSchema);