// controllers/adminController.js
const User = require('../models/User');
const Prompt = require('../models/Prompt');
const Comment = require('../models/Comment');

exports.assignRole = async (req, res) => {
    const { userId, role } = req.body;
    if (!['user', 'moderator', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        await User.findByIdAndUpdate(userId, { role });
        res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating role' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Delete user
        await User.findByIdAndDelete(userId);

        // Delete user's prompts and comments
        await Prompt.deleteMany({ user: userId });
        await Comment.deleteMany({ user: userId });

        res.status(200).json({ message: 'User and associated data deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};
