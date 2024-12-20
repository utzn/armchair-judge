const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    pin: { type: String }, // Store hashed PIN
});

module.exports = mongoose.model('User', UserSchema);
