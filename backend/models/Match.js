const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    boxerA: { type: String, required: true },
    boxerB: { type: String, required: true },
    currentRound: { type: Number, default: 1 },
    status: { type: String, default: 'not started' }, // 'not started', 'ongoing', 'ended'
});

module.exports = mongoose.model('Match', MatchSchema);