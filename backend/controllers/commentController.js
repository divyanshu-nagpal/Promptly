const Comment = require('../models/Comment');
const Prompt = require('../models/Prompt');
const User = require('../models/User');

// Create a new comment
const createComment = async (req, res) => {
    const { promptId, text } = req.body;
    const userId = req?.user?.id;
  
    try {
      const prompt = await Prompt.findById(promptId);
      if (!prompt) return res.status(404).json({ message: 'Prompt not found' });
  
      const newComment = new Comment({
        user: userId,
        prompt: promptId,
        text,
      });
  
      const savedComment = await newComment.save();
  
      // Increment comment count in Prompt model
      await Prompt.findByIdAndUpdate(promptId, { $inc: { commentsCount: 1 } });
  
      // Optionally, populate user details in response
      const user = await User.findById(userId).select('username profilePicture');
      savedComment.user = user;
  
      res.status(201).json(savedComment);
    } catch (err) {
      console.error('Error creating comment:', err);
      res.status(500).json({ message: 'Error creating comment' });
    }
  };
  

// Get all comments for a prompt
const getComments = async (req, res) => {
  const { promptId } = req.params;

  try {
    const comments = await Comment.find({ prompt: promptId })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json(comment);
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createComment, getComments, getCommentById };