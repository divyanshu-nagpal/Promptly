const express = require('express');
const { registerUser, loginUser, verifyEmail, enable2FA, disable2FA, verify2FA  } = require('../controllers/authController');
const { body } = require('express-validator');
const upload = require('../middleware/upload');
const router = express.Router();
const auth = require('../middleware/auth');

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

// Enable 2FA Route
router.post('/enable-2fa', auth, [
    body('userId', 'User ID is required').exists()
], enable2FA);

// Disable 2FA Route
router.post('/disable-2fa', auth, [
    body('userId', 'User ID is required').exists()
], disable2FA);

// Verify 2FA Route (after user scans QR code)
router.post('/verify-2fa', auth, [
    body('userId', 'User ID is required').exists(),
    body('token', '2FA token is required').exists()
], verify2FA);

module.exports = router;
