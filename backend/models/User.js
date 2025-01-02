const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    totalPrompts: { type: Number, default: 0 },
    bookmarkedPrompts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' , default: [] }],
    profilePicture: {type: String, default: ''},
});

module.exports = mongoose.model('User', UserSchema);
