const express = require('express');
const { registerUser, loginUser, verifyEmail } = require('../controllers/authController');
const { body } = require('express-validator');
const upload = require('../middleware/upload');
const router = express.Router();

// Login Route
router.post('/login', [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
], loginUser);

// Register Route
router.post('/register', [
    // body('username', 'Username is required').notEmpty(),
    // body('email', 'Please include a valid email').isEmail(),
    // body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
],upload.single('profilePhoto'), registerUser);

//Email Verification Route
router.get('/verify-email/:verificationtoken', verifyEmail);

module.exports = router;
