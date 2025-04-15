const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware for authentication
const { getUserProfile, getBookmarkedPrompts, getTopUsers } = require('../controllers/userController');



// Route to get the user profile
router.get('/profile', auth, getUserProfile);
router.get('/bookmarks', auth, getBookmarkedPrompts);
router.get('/leaderboard',auth,getTopUsers);


module.exports = router;
