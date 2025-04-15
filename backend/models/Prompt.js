const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        upvote: {
            type: Number, 
            default: 0 
        },
        downvote: {
            type: Number, 
            default: 0 
        },
        likes: { 
            type: Number, 
            default: 0 
        },
        input: {
            type: String,
            required: true,
        },
        output: {
            type: String,
            required: true,
        },
        aiModel: {
            type: String,
            required: true, 
        },
        likedBy: { 
            type: [mongoose.Schema.Types.ObjectId], 
            ref: 'User', 
            default: [] 
        },
        commentsCount: { 
            type: Number, 
            default: 0 
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Prompt', promptSchema);

