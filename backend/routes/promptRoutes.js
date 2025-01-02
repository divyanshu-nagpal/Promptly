const express = require('express');
const { 
    getAllPrompts, 
    createPrompt, 
    likePrompt, 
    upvotePrompt, 
    downvotePrompt ,
    bookmarkPrompt
} = require('../controllers/promptController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', auth, getAllPrompts); // Get all prompts
router.post('/', auth, upload.single('image'), createPrompt);// Create a prompt (requires authentication)
router.post('/:id/like',auth, likePrompt); // Like a prompt
router.post('/:id/upvote',auth, upvotePrompt); // Upvote a prompt
router.post('/:id/downvote',auth, downvotePrompt); // Downvote a prompt
router.post('/:id/bookmark', auth, bookmarkPrompt);

module.exports = router;
