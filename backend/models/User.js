const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    totalPrompts: { type: Number, default: 0 },
    bookmarkedPrompts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' , default: [] }],
    profilePicture: {type: String, default: ''},
    is2FAEnabled: { type: Boolean, default: false },
    twoFASecret: { type: String },
    role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
    flagCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', UserSchema);
