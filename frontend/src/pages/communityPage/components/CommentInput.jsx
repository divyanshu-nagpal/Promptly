// CommentInput.jsx
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import api from "../lib/api";

const CommentInput = ({ promptId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [textareaFocused, setTextareaFocused] = useState(false);

  const token = localStorage.getItem('token');
  if (!token || token === 'undefined' || token === 'null') {
    return (
      <div className="text-center py-4 bg-gray-900/30 rounded-lg border border-gray-800 text-gray-400">
        Sign in to leave a comment
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/api/comments', 
        { promptId, text: commentText },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setCommentText('');
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-start gap-3">
        <img
          src="https://res.cloudinary.com/djncnauta/image/upload/v1735364671/profile_photo_gaqfit.jpg"
          alt="User"
          className="w-8 h-8 rounded-full border border-gray-700 object-cover"
        />
        <div className="flex-1 relative">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={() => setTextareaFocused(true)}
            onBlur={() => setTextareaFocused(false)}
            placeholder="Add your thoughts..."
            className={`w-full px-4 py-2.5 bg-gray-800/80 rounded-2xl min-h-[45px] max-h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border ${textareaFocused ? 'border-blue-500' : 'border-gray-700'} text-gray-200 placeholder-gray-500 resize-none`}
            rows={1}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all duration-300 ${commentText.trim() ? 'text-blue-400 hover:bg-blue-900/50' : 'text-gray-600'} disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      {isSubmitting && (
        <div className="mt-2 text-sm text-gray-500 text-center animate-pulse">
          Posting your comment...
        </div>
      )}
    </form>
  );
};

export default CommentInput;