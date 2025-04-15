const Prompt = require('../models/Prompt');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
require('dotenv').config();

// Get all prompts
const getAllPrompts = async (req, res) => {
  try {
    const userId = req?.user?.id;

    // Fetch the user's bookmarked prompts
    const user = await User.findById(userId).select('bookmarkedPrompts');
    const bookmarkedPromptIds = user?.bookmarkedPrompts || [];

    // Fetch all prompts
    const prompts = await Prompt.find().sort({ _id: -1 }).populate('user', 'username totalPrompts profilePicture');
    
    // Map through prompts and add isLiked and isBookmarked
    const promptsStatus = prompts.map((prompt) => ({
      ...prompt.toObject(),
      isLiked: prompt.likedBy.some((user) => user.toString() === userId),
      isBookmarked: bookmarkedPromptIds.includes(prompt._id.toString()),
    }));

    res.status(200).json(promptsStatus);
  } catch (err) {
    console.error('Error fetching prompts:', err);
    res.status(500).json({ message: 'An error occurred' });
  }
};

// Create a new prompt
const createPrompt = async (req, res) => {
    const { title, tags, input, aiModel } = req.body;
    let output = req.body.output; // text output
  
    try {
      let imageUrl = null;
  
      if (req.file) {
        // If an image file is uploaded
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;  // Store the image URL in Cloudinary
      }
  
      const newPrompt = new Prompt({
        title,
        tags: tags.split(',').map((tag) => tag.trim()),
        input,
        output: imageUrl ? `${output} ${process.env.OUTPUT_SPLIT} ${imageUrl}` : output, // Store text and image URL
        aiModel,
        user: req?.user?.id,
      });

      await User.findByIdAndUpdate(req?.user?.id, { $inc: { totalPrompts: 1 } });
  
      const savedPrompt = await newPrompt.save();
      res.status(201).json(savedPrompt);
    } catch (error) {
      res.status(500).json({ message: 'Error creating prompt' });
    }
  };



// Like a prompt
const likePrompt = async (req, res) => {
    try {
      const { id } = req.params; // Prompt ID
      const userId = req?.user?.id; // User ID from token
    //   console.log(userId);
    //   console.log(id);
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is missing or invalid' });
      }
  
      const prompt = await Prompt.findById(id);
      if (!prompt) {
        return res.status(404).json({ message: 'Prompt not found' });
      }
  
      const hasLiked = prompt.likedBy.some((user) => user.toString() === userId);
  
      if (hasLiked) {
        // User already liked the prompt; remove their like
        prompt.likedBy = prompt.likedBy.filter((user) => user.toString() !== userId);
        prompt.likes -= 1;
      } else {
        // User hasn't liked the prompt; add their like
        prompt.likedBy.push(userId);
        prompt.likes += 1;
      }
  
      await prompt.save();
  
      res.status(200).json({
        message: hasLiked ? 'Prompt unliked successfully' : 'Prompt liked successfully',
        likes: prompt.likes,
        isLiked: !hasLiked,
      });
    } catch (err) {
      console.error('Error toggling like for prompt:', err);
      res.status(500).json({ message: 'An error occurred' });
    }
  };
  
  


// Upvote a prompt
const upvotePrompt = async (req, res) => {
    try {
        const prompt = await Prompt.findById(req.params.id);
        if (!prompt) return res.status(404).json({ message: 'Prompt not found' });

        prompt.upvotes += 1;
        await prompt.save();
        res.json({ message: 'Upvoted the prompt!', upvotes: prompt.upvotes });
    } catch (error) {
        res.status(500).json({ message: 'Error upvoting prompt' });
    }
};

// Downvote a prompt
const downvotePrompt = async (req, res) => {
    try {
        const prompt = await Prompt.findById(req.params.id);
        if (!prompt) return res.status(404).json({ message: 'Prompt not found' });

        prompt.downvotes += 1;
        await prompt.save();
        res.json({ message: 'Downvoted the prompt!', downvotes: prompt.downvotes });
    } catch (error) {
        res.status(500).json({ message: 'Error downvoting prompt' });
    }
};

const bookmarkPrompt = async (req, res) => {
  try {
      const { id } = req.params; // Prompt ID
      const userId = req?.user?.id; // User ID from token

      if (!userId) {
          return res.status(400).json({ message: 'User ID is missing or invalid' });
      }

      const prompt = await Prompt.findById(id);
      if (!prompt) {
          return res.status(404).json({ message: 'Prompt not found' });
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const hasBookmarked = user.bookmarkedPrompts.includes(id);

      if (hasBookmarked) {
          // User already bookmarked the prompt; remove the bookmark
          user.bookmarkedPrompts = user.bookmarkedPrompts.filter(
              (promptId) => promptId.toString() !== id
          );
      } else {
          // User hasn't bookmarked the prompt; add the bookmark
          user.bookmarkedPrompts.push(id);
      }

      await user.save();

      res.status(200).json({
          message: hasBookmarked
              ? 'Prompt removed from bookmarks'
              : 'Prompt bookmarked successfully',
          isBookmarked: !hasBookmarked,
      });
  } catch (err) {
      console.error('Error toggling bookmark for prompt:', err);
      res.status(500).json({ message: 'An error occurred' });
  }
};


const getPromptById = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) return res.status(404).json({ message: 'Prompt not found' });
    // console.log(prompt);
    res.json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getAllPrompts, createPrompt, likePrompt, upvotePrompt, downvotePrompt, bookmarkPrompt, getPromptById };



