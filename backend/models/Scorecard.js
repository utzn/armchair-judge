const mongoose = require('mongoose');

const ScorecardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    round: { type: Number, required: true },
    score: { type: String, required: true }, // e.g., '10-9'
    boxer: { type: String, required: true }, // 'A' or 'B'
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Scorecard', ScorecardSchema);
