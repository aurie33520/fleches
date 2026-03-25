const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  solvedGrids: [{ gridId: String, solvedAt: Date, score: Number }]
});

module.exports = mongoose.model('User', userSchema);