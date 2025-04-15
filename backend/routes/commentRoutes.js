const express = require('express');
const { createComment, getComments, getCommentById } = require('../controllers/commentController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createComment);

// Get comments for a prompt
router.get('/:promptId', getComments);

router.get('/single/:id', getCommentById);


module.exports = router;